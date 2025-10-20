import * as FileSystem from 'expo-file-system/legacy';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';

const DEFAULT_DB_NAME = 'shutokun-v2.db';
const DEFAULT_DB_ASSET_NAME = 'core-data.db';

// Maintain a map of opened database connections keyed by filename.
const dbMap: Map<string, SQLiteDatabase> = new Map();

// Map known asset filenames to their require() module references so bundlers
// can statically include them. Add new DB asset filenames here when you
// include them in `assets/db`.
const ASSET_MODULES: Record<string, any> = {
  'core-data.db': require('../assets/db/core-data.db'),
};

// SQL script for database initialization on the web
const DB_INIT_SCRIPT = `
CREATE TABLE IF NOT EXISTS vocab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  level TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS kanji (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  character TEXT NOT NULL,
  meaning TEXT NOT NULL,
  level TEXT NOT NULL
);

-- N5 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('犬', 'いぬ (dog)', 'N5'),
('猫', 'ねこ (cat)', 'N5'),
('学校', 'がっこう (school)', 'N5');

INSERT INTO kanji (character, meaning, level) VALUES
('一', 'one', 'N5'),
('二', 'two', 'N5'),
('三', 'three', 'N5');

-- N4 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('変', 'へん (strange)', 'N4'),
('払う', 'はらう (to pay)', 'N4'),
('続ける', 'つづける (to continue)', 'N4');

INSERT INTO kanji (character, meaning, level) VALUES
('味', 'taste', 'N4'),
('写', 'copy', 'N4'),
('真', 'true', 'N4');

-- N3 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('情報', 'じょうほう (information)', 'N3'),
('経済', 'けいざい (economy)', 'N3'),
('社会', 'しゃかい (society)', 'N3');

INSERT INTO kanji (character, meaning, level) VALUES
('指', 'finger, point', 'N3'),
('政', 'politics', 'N3'),
('議', 'deliberation', 'N3');

-- N2 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('権利', 'けんり (right, privilege)', 'N2'),
('義務', 'ぎむ (duty, obligation)', 'N2'),
('政府', 'せいふ (government)', 'N2');

INSERT INTO kanji (character, meaning, level) VALUES
('革', 'leather', 'N2'),
('憲', 'constitution', 'N2'),
('派', 'faction', 'N2');

-- N1 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('哲学', 'てつがく (philosophy)', 'N1'),
('曖昧', 'あいまい (ambiguous)', 'N1'),
('翻訳', 'ほんやく (translation)', 'N1');

INSERT INTO kanji (character, meaning, level) VALUES
('朕', 'majestic plural', 'N1'),
('鬱', 'gloom', 'N1'),
('璽', 'emperor\'\'s seal', 'N1');
`;

/**
 * 指定したファイル名／アセット名でデータベースを初期化して返す。
 * assetName は assets/db にあるファイル名を指定する。
 */
async function initializeDatabaseFor(dbName = DEFAULT_DB_NAME, assetName = DEFAULT_DB_ASSET_NAME): Promise<SQLiteDatabase> {
  // If already opened, return from cache
  if (dbMap.has(dbName)) {
    return dbMap.get(dbName)!;
  }

  let opened: SQLiteDatabase;

  if (Platform.OS === 'web') {
    // Web platform: Use SQL script to initialize the database
    console.log('[DB_WEB] Initializing database for web...');
    opened = openDatabaseSync(dbName);
    // The `execSync` method can execute multiple statements
    opened.execSync(DB_INIT_SCRIPT);
    console.log('[DB_WEB] Database initialized from script.');
  } else {
    // Native platform: Use file-system to copy the pre-built DB
    const sqliteDirectory = `${(FileSystem as any).documentDirectory}SQLite`;

    // Ensure SQLite directory exists
    const dirInfo = await FileSystem.getInfoAsync(sqliteDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDirectory, { intermediates: true });
    }

    const dbPath = `${sqliteDirectory}/${dbName}`;
    const dbInfo = await FileSystem.getInfoAsync(dbPath);

    if (!dbInfo.exists) {
      console.log(`[DB_NATIVE] Database ${dbName} not found, copying from assets ${assetName}...`);
      const moduleRef = ASSET_MODULES[assetName];
      if (!moduleRef) {
        throw new Error(`Unknown DB asset: ${assetName}. Add it to ASSET_MODULES in db/database.ts`);
      }
      const asset = Asset.fromModule(moduleRef);
      await asset.downloadAsync();
      const sourceUri = (asset.localUri ?? asset.uri) as string;
      await FileSystem.copyAsync({ from: sourceUri, to: dbPath });
      console.log('[DB_NATIVE] Database copied.');
    } else {
      console.log('[DB_NATIVE] Database already exists.');
    }

    opened = openDatabaseSync(dbName);
  }

  runMigrations(opened);
  dbMap.set(dbName, opened);
  return opened;
}

/**
 * 既定の名前でデータベースを取得する既存 API（下位互換）
 */
export async function getDatabase(): Promise<SQLiteDatabase> {
  return dbMap.get(DEFAULT_DB_NAME) ?? await initializeDatabaseFor(DEFAULT_DB_NAME, DEFAULT_DB_ASSET_NAME);
}

/**
 * 指定した dbName/assetName に対してデータベース接続を取得する（複数 DB を扱う用途）
 */
export async function getDatabaseFor(dbName?: string, assetName?: string): Promise<SQLiteDatabase> {
  // If caller wants the default behaviour, reuse existing getDatabase
  const name = dbName ?? DEFAULT_DB_NAME;
  const asset = assetName ?? DEFAULT_DB_ASSET_NAME;
  return dbMap.get(name) ?? await initializeDatabaseFor(name, asset);
}

/**
 * SELECTクエリを実行し、すべての結果を取得する。
 * @param sqlStatement SQLクエリ文 (例: 'SELECT * FROM users WHERE name = ?')
 * @param params クエリのパラメータ
 * @returns クエリ結果のオブジェクト配列
 */
export async function getAllAsync<T>(sqlStatement: string, params: any[]): Promise<T[]> {
  const database = await getDatabase();
  return database.getAllSync<T>(sqlStatement, params);
}

/**
 * 指定した DB（asset ファイル名やコピー先ファイル名）を使って SELECT を実行する。
 * dbName / assetName は任意。指定しない場合は既定 DB を使う。
 */
export async function getAllFromDatabase<T>(dbName: string | undefined, assetName: string | undefined, sqlStatement: string, params: any[]): Promise<T[]> {
  const database = dbName || assetName ? await getDatabaseFor(dbName, assetName) : await getDatabase();
  return database.getAllSync<T>(sqlStatement, params);
}

/**
 * Close all opened databases and clear the cache.
 * Note: expo-sqlite's sync API may not expose an explicit close method; this is best-effort.
 */
export function closeAllDatabases(): void {
  try {
    // If the opened database objects have a close method, call it.
    for (const [name, database] of dbMap.entries()) {
      try {
        const anyDb = database as any;
        if (typeof anyDb.close === 'function') {
          anyDb.close();
        }
      } catch (e) {
        // ignore per-db close errors
      }
    }
  } finally {
    dbMap.clear();
  }
}

function runMigrations(db: SQLiteDatabase) {
  // Migration 1: Add SRS columns to vocab and kanji tables
  const tables = ['vocab', 'kanji'];
  for (const table of tables) {
    const columns = db.getAllSync<any>(`PRAGMA table_info(${table})`);
    const hasSrsLevel = columns.some(c => c.name === 'srs_level');
    if (!hasSrsLevel) {
      console.log(`Running migration on ${table}: adding SRS columns...`);
      db.runSync(`ALTER TABLE ${table} ADD COLUMN srs_level INTEGER DEFAULT 0`);
      db.runSync(`ALTER TABLE ${table} ADD COLUMN next_review_timestamp INTEGER DEFAULT 0`);
      console.log(`Migration on ${table} complete.`);
    }
  }
}

// Persisted settings file for storing selected DB info
const SETTINGS_FILE = `${(FileSystem as any).documentDirectory}shutokun-settings.json`;

export type SavedDbSelection = {
  assetName?: string;
  dbName?: string;
};

/**
 * Save DB selection to a small settings file.
 */
export async function saveDbSelection(selection: SavedDbSelection): Promise<void> {
  try {
  await FileSystem.writeAsStringAsync(SETTINGS_FILE, JSON.stringify(selection), { encoding: 'utf8' as any });
  } catch (e) {
    console.error('Failed to save DB selection', e);
  }
}

/**
 * Load saved DB selection. Returns undefined if none saved.
 */
export async function loadDbSelection(): Promise<SavedDbSelection | undefined> {
  try {
    const info = await FileSystem.getInfoAsync(SETTINGS_FILE);
    if (!info.exists) return undefined;
  const text = await FileSystem.readAsStringAsync(SETTINGS_FILE, { encoding: 'utf8' as any });
    return JSON.parse(text) as SavedDbSelection;
  } catch (e) {
    console.error('Failed to load DB selection', e);
    return undefined;
  }
}

/**
 * 単一のSELECTクエリを実行し、最初の結果を取得する。
 * @param sqlStatement SQLクエリ文 (例: 'SELECT * FROM users WHERE id = ?')
 * @param params クエリのパラメータ
 * @returns クエリ結果の単一オブジェクト、または見つからない場合はnull
 */
export async function getFirstAsync<T>(sqlStatement: string, params: any[]): Promise<T | null> {
    const database = await getDatabase();
    return database.getFirstSync<T>(sqlStatement, params);
}

/**
 * INSERT, UPDATE, DELETEなどのクエリを実行する。
 * @param sqlStatement SQLクエリ文
 * @param params クエリのパラメータ
 * @returns 実行結果
 */
export async function runAsync(sqlStatement: string, params: any[]): Promise<any> {
  const database = await getDatabase();
  return database.runSync(sqlStatement, params);
}