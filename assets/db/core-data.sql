-- このファイルはダミーのコアデータです。
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
('璽', 'emperor''s seal', 'N1');