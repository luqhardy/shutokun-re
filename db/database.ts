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
const DB_INIT_SCRIPT = `-- このファイルはダミーのコアデータです。
-- 実際のデータ（語彙、漢字など）をここに追加してください。

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
('学校', 'がっこう (school)', 'N5'),
('私', 'わたし (I, me)', 'N5'),
('人', 'ひと (person)', 'N5'),
('日本', 'にほん (Japan)', 'N5'),
('本', 'ほん (book)', 'N5'),
('学生', 'がくせい (student)', 'N5'),
('先生', 'せんせい (teacher)', 'N5'),
('友達', 'ともだち (friend)', 'N5'),
('家', 'いえ/うち (house, home)', 'N5'),
('車', 'くるま (car)', 'N5'),
('駅', 'えき (station)', 'N5'),
('食べる', 'たべる (to eat)', 'N5'),
('飲む', 'のむ (to drink)', 'N5'),
('見る', 'みる (to see)', 'N5'),
('聞く', 'きく (to listen)', 'N5'),
('読む', 'よむ (to read)', 'N5'),
('書く', 'かく (to write)', 'N5'),
('話す', 'はなす (to speak)', 'N5'),
('買う', 'かう (to buy)', 'N5'),
('行く', 'いく (to go)', 'N5'),
('帰る', 'かえる (to return)', 'N5'),
('おいしい', 'oishii (delicious)', 'N5'),
('たかい', 'takai (high, expensive)', 'N5'),
('やすい', 'yasui (cheap)', 'N5'),
('おおきい', 'ookii (big)', 'N5'),
('ちいさい', 'chiisai (small)', 'N5'),
('あたらしい', 'atarashii (new)', 'N5'),
('ふるい', 'furui (old)', 'N5'),
('いい', 'ii (good)', 'N5'),
('わるい', 'warui (bad)', 'N5'),
('あつい', 'atsui (hot)', 'N5'),
('さむい', 'samui (cold)', 'N5'),
('たのしい', 'tanoshii (fun)', 'N5'),
('むずかしい', 'muzukashii (difficult)', 'N5'),
('やさしい', 'yasashii (easy)', 'N5'),
('きれい', 'kirei (beautiful, clean)', 'N5'),
('しずか', 'shizuka (quiet)', 'N5'),
('にぎやか', 'nigiyaka (lively)', 'N5'),
('ゆうめい', 'yuumei (famous)', 'N5'),
('げんき', 'genki (healthy, energetic)', 'N5');

INSERT INTO kanji (character, meaning, level) VALUES
('一', 'one', 'N5'),
('二', 'two', 'N5'),
('三', 'three', 'N5'),
('四', 'four', 'N5'),
('五', 'five', 'N5'),
('六', 'six', 'N5'),
('七', 'seven', 'N5'),
('八', 'eight', 'N5'),
('九', 'nine', 'N5'),
('十', 'ten', 'N5'),
('百', 'hundred', 'N5'),
('千', 'thousand', 'N5'),
('万', 'ten thousand', 'N5');

-- N4 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('変', 'へん (strange)', 'N4'),
('払う', 'はらう (to pay)', 'N4'),
('続ける', 'つづける (to continue)', 'N4'),
('教える', 'おしえる (to teach)', 'N4'),
('覚える', 'おぼえる (to remember)', 'N4'),
('貸す', 'かす (to lend)', 'N4'),
('借りる', 'かりる (to borrow)', 'N4'),
('送る', 'おくる (to send)', 'N4'),
('作る', 'つくる (to make)', 'N4'),
('使う', 'つかう (to use)', 'N4'),
('会う', 'あう (to meet)', 'N4'),
('待つ', 'まつ (to wait)', 'N4'),
('持つ', 'もつ (to hold)', 'N4'),
('しる', 'shiru (to know)', 'N4'),
('わかる', 'wakaru (to understand)', 'N4'),
('おわる', 'owaru (to end)', 'N4'),
('はじまる', 'hajimaru (to begin)', 'N4'),
('おしえる', 'oshieru (to teach)', 'N4'),
('ならう', 'narau (to learn)', 'N4'),
('でる', 'deru (to leave)', 'N4'),
('はいる', 'hairu (to enter)', 'N4'),
('のる', 'noru (to ride)', 'N4'),
('おりる', 'oriru (to get off)', 'N4'),
('きる', 'kiru (to wear)', 'N4'),
('ぬぐ', 'nugu (to take off clothes)', 'N4'),
('あける', 'akeru (to open)', 'N4'),
('しめる', 'shimeru (to close)', 'N4'),
('つく', 'tsuku (to arrive)', 'N4'),
('だす', 'dasu (to take out)', 'N4'),
('いれる', 'ireru (to put in)', 'N4'),
('みせる', 'miseru (to show)', 'N4'),
('とる', 'toru (to take)', 'N4');

INSERT INTO kanji (character, meaning, level) VALUES
('味', 'taste', 'N4'),
('写', 'copy', 'N4'),
('真', 'true', 'N4');

-- N3 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('情報', 'じょうほう (information)', 'N3'),
('経済', 'けいざい (economy)', 'N3'),
('社会', 'しゃかい (society)', 'N3'),
('政治', 'せいじ (politics)', 'N3'),
('経済', 'けいざい (economy)', 'N3'),
('法律', 'ほうりつ (law)', 'N3'),
('国際', 'こくさい (international)', 'N3'),
('文化', 'ぶんか (culture)', 'N3'),
('科学', 'かがく (science)', 'N3'),
('歴史', 'れきし (history)', 'N3'),
('地理', 'ちり (geography)', 'N3'),
('数学', 'すうがく (mathematics)', 'N3'),
('物理', 'ぶつり (physics)', 'N3'),
('化学', 'かがく (chemistry)', 'N3'),
('生物', 'せいぶつ (biology)', 'N3'),
('地学', 'ちがく (earth science)', 'N3'),
('英語', 'えいご (English)', 'N3'),
('国語', 'こくご (national language)', 'N3'),
('体育', 'たいいく (physical education)', 'N3'),
('音楽', 'おんがく (music)', 'N3'),
('美術', 'びじゅつ (art)', 'N3'),
('技術', 'ぎじゅつ (technology)', 'N3'),
('家庭科', 'かていか (home economics)', 'N3'),
('書道', 'しょどう (calligraphy)', 'N3'),
('部活', 'ぶかつ (club activities)', 'N3'),
('生徒', 'せいと (student)', 'N3'),
('先生', 'せんせい (teacher)', 'N3'),
('学校', 'がっこう (school)', 'N3'),
('教室', 'きょうしつ (classroom)', 'N3'),
('図書館', 'としょかん (library)', 'N3'),
('体育館', 'たいいくかん (gymnasium)', 'N3');

INSERT INTO kanji (character, meaning, level) VALUES
('指', 'finger, point', 'N3'),
('政', 'politics', 'N3'),
('議', 'deliberation', 'N3');

-- N2 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('権利', 'けんり (right, privilege)', 'N2'),
('義務', 'ぎむ (duty, obligation)', 'N2'),
('政府', 'せいふ (government)', 'N2'),
('企業', 'きぎょう (enterprise)', 'N2'),
('産業', 'さんぎょう (industry)', 'N2'),
('農業', 'のうぎょう (agriculture)', 'N2'),
('工業', 'こうぎょう (manufacturing industry)', 'N2'),
('商業', 'しょうぎょう (commerce)', 'N2'),
('金融', 'きんゆう (finance)', 'N2'),
('保険', 'ほけん (insurance)', 'N2'),
('医療', 'いりょう (medical care)', 'N2'),
('福祉', 'ふくし (welfare)', 'N2'),
('環境', 'かんきょう (environment)', 'N2'),
('教育', 'きょういく (education)', 'N2'),
('労働', 'ろうどう (labor)', 'N2'),
('安全', 'あんぜん (safety)', 'N2'),
('危険', 'きけん (danger)', 'N2'),
('健康', 'けんこう (health)', 'N2'),
('病気', 'びょうき (illness)', 'N2'),
('怪我', 'けが (injury)', 'N2'),
('事故', 'じこ (accident)', 'N2'),
('事件', 'じけん (incident)', 'N2'),
('犯罪', 'はんざい (crime)', 'N2'),
('法律', 'ほうりつ (law)', 'N2'),
('裁判', 'さいばん (trial)', 'N2'),
('警察', 'けいさつ (police)', 'N2'),
('消防', 'しょうぼう (fire fighting)', 'N2'),
('救急', 'きゅうきゅう (emergency)', 'N2'),
('病院', 'びょういん (hospital)', 'N2'),
('薬', 'くすり (medicine)', 'N2'),
('医者', 'いしゃ (doctor)', 'N2');

INSERT INTO kanji (character, meaning, level) VALUES
('革', 'leather', 'N2'),
('憲', 'constitution', 'N2'),
('派', 'faction', 'N2');

-- N1 サンプルデータ
INSERT INTO vocab (term, definition, level) VALUES
('哲学', 'てつがく (philosophy)', 'N1'),
('曖昧', 'あいまい (ambiguous)', 'N1'),
('翻訳', 'ほんやく (translation)', 'N1'),
('芸術', 'げいじゅつ (art)', 'N1'),
('文学', 'ぶんがく (literature)', 'N1'),
('音楽', 'おんがく (music)', 'N1'),
('美術', 'びじゅつ (fine arts)', 'N1'),
('演劇', 'えんげき (theater)', 'N1'),
('映画', 'えいが (movie)', 'N1'),
('写真', 'しゃしん (photograph)', 'N1'),
('建築', 'けんちく (architecture)', 'N1'),
('思想', 'しそう (thought)', 'N1'),
('宗教', 'しゅうきょう (religion)', 'N1'),
('歴史', 'れきし (history)', 'N1'),
('地理', 'ちり (geography)', 'N1'),
('数学', 'すうがく (mathematics)', 'N1'),
('物理', 'ぶつり (physics)', 'N1'),
('化学', 'かがく (chemistry)', 'N1'),
('生物', 'せいぶつ (biology)', 'N1'),
('地学', 'ちがく (earth science)', 'N1'),
('医学', 'いがく (medical science)', 'N1'),
('薬学', 'やくがく (pharmacology)', 'N1'),
('法学', 'ほうがく (law)', 'N1'),
('経済学', 'けいざいがく (economics)', 'N1'),
('政治学', 'せいじがく (political science)', 'N1'),
('社会学', 'しゃかいがく (sociology)', 'N1'),
('心理学', 'しんりがく (psychology)', 'N1'),
('言語学', 'げんごがく (linguistics)', 'N1'),
('情報科学', 'じょうほうかがく (information science)', 'N1'),
('宇宙科学', 'うちゅうかがく (space science)', 'N1'),
('環境科学', 'かんきょうかがく (environmental science)', 'N1');

INSERT INTO kanji (character, meaning, level) VALUES
('朕', 'majestic plural', 'N1'),
('鬱', 'gloom', 'N1'),
('璽', 'emperor''s seal', 'N1');

-- More N5 vocab
INSERT INTO vocab (term, definition, level) VALUES
('時間', 'じかん (time)', 'N5'),
('お金', 'おかね (money)', 'N5'),
('今日', 'きょう (today)', 'N5'),
('明日', 'あした (tomorrow)', 'N5'),
('昨日', 'きのう (yesterday)', 'N5');

-- More N4 vocab
INSERT INTO vocab (term, definition, level) VALUES
('意見', 'いけん (opinion)', 'N4'),
('趣味', 'しゅみ (hobby)', 'N4'),
('試合', 'しあい (match, game)', 'N4'),
('旅行', 'りょこう (travel)', 'N4'),
('準備', 'じゅんび (preparation)', 'N4');

-- More N3 vocab
INSERT INTO vocab (term, definition, level) VALUES
('関係', 'かんけい (relationship)', 'N3'),
('経験', 'けいけん (experience)', 'N3'),
('説明', 'せつめい (explanation)', 'N3'),
('必要', 'ひつよう (necessary)', 'N3'),
('場合', 'ばあい (case, situation)', 'N3');
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

// --- Custom Vocabulary Database ---

const CUSTOM_VOCAB_DB_NAME = 'custom-vocab.db';
const CUSTOM_DB_INIT_SCRIPT = `
CREATE TABLE IF NOT EXISTS custom_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS custom_vocab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  set_id INTEGER NOT NULL,
  term TEXT NOT NULL,
  definition TEXT,
  reading TEXT,
  FOREIGN KEY (set_id) REFERENCES custom_sets (id) ON DELETE CASCADE
);
`;

/**
 * Initializes and/or returns a connection to the custom vocabulary database.
 */
export async function getCustomVocabDb(): Promise<SQLiteDatabase> {
  if (dbMap.has(CUSTOM_VOCAB_DB_NAME)) {
    return dbMap.get(CUSTOM_VOCAB_DB_NAME)!;
  }

  console.log('[DB_CUSTOM] Initializing custom vocabulary database...');
  const db = openDatabaseSync(CUSTOM_VOCAB_DB_NAME);
  db.execSync(CUSTOM_DB_INIT_SCRIPT);
  console.log('[DB_CUSTOM] Custom vocabulary database initialized.');
  
  dbMap.set(CUSTOM_VOCAB_DB_NAME, db);
  return db;
}

/**
 * Executes a write query (INSERT, UPDATE, DELETE) on the custom vocab database.
 */
export async function runCustomVocabQuery(sqlStatement: string, params: any[]): Promise<any> {
  const db = await getCustomVocabDb();
  return db.runSync(sqlStatement, params);
}

/**
 * Executes a read query (SELECT) on the custom vocab database and returns all results.
 */
export async function getAllCustomVocabQuery<T>(sqlStatement: string, params: any[]): Promise<T[]> {
  const db = await getCustomVocabDb();
  return db.getAllSync<T>(sqlStatement, params);
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