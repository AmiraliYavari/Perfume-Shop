const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'perfume.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    concentration TEXT NOT NULL,
    gender TEXT NOT NULL,
    season TEXT,
    top_notes TEXT DEFAULT '[]',
    middle_notes TEXT DEFAULT '[]',
    base_notes TEXT DEFAULT '[]',
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    price INTEGER NOT NULL,
    original_price INTEGER,
    volume_ml INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    phone TEXT,
    address TEXT,
    status TEXT DEFAULT 'جدید',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`);

// ادمین پیش‌فرض
const adminCount = db.prepare('SELECT COUNT(*) as cnt FROM admins').get();
if (adminCount.cnt === 0) {
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', 'admin123');
}

// لیست تصاویر ارائه شده
const imageList = [
  'https://hilandbeauty.com/images/thumbs/0051505_navid-mohammadzadeh-navid-for-him-edp-100ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0057400_corniche-dor-rebellion-extrait-de-parfum-125ml-w_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0072554_marco-serussi-harmony-intense-edp-100ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0060611_replika-club-black-opium-by-ysl-edp-100ml-w_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0057398_corniche-dor-rouge-et-noir-extrait-de-parfum-125ml-w-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0072556_masterpiece-asbaad-edp-100ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0066580_corniche-dor-se-lever-extrait-de-parfum-125ml-w-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0069015_royalion-cherish-edp-100ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0047598_la-rive-hit-fire-edt-90ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0079936_cergio-cappele-zeus-edp-100ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0047592_la-rive-elegant-men-edt-90ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0074103_ajmal-sacrifice-edp-50ml-w_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0077775_louis-alavia-king-richard-concentree-edp-100-ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0071739_rbc-story-responsible-edp-100ml-m_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0054227_la-rive-sweet-hope-edp-90ml-w_248.jpeg',
  'https://hilandbeauty.com/images/thumbs/0067170_beverly-hills-polo-club-no9-edp-100-ml-w_248.jpeg',
];

// تابع کمکی برای انتخاب رندوم تصویر
function getRandomImage() {
  return imageList[Math.floor(Math.random() * imageList.length)];
}

// درج محصولات واقعی
const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, brand, concentration, gender, season, top_notes, middle_notes, base_notes, description, image, price, original_price, volume_ml)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    {
      name: 'ادوپرفیوم مردانه نوید محمدزاده',
      brand: 'نوید محمدزاده',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 2812000,
      original_price: 2960000,
      desc: 'عطری شرقی و مردانه با رایحه جذاب و ماندگار'
    },
    {
      name: 'پرفیوم زنانه کورنیش دوق اکسترکت ربلیون',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'female',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'رایحه‌ای لوکس و شیک برای بانوی مدرن'
    },
    {
      name: 'ادوپرفیوم مردانه مارکو سروسی هارمونی اینتنس',
      brand: 'مارکو سروسی',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 12760000,
      original_price: 15950000,
      desc: 'ترکیبی چوبی و آروماتیک با رایحه‌ای قدرتمند'
    },
    {
      name: 'ادوپرفیوم زنانه رپلیکا کلاب بلک اوپیوم',
      brand: 'رپلیکا کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 3239500,
      original_price: 3410000,
      desc: 'رایحه‌ای گرم و اعتیادآور با نت‌های قهوه و وانیل'
    },
    {
      name: 'پرفیوم کورنیش دوق اکسترکت رژ ا نواق',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'unisex',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'رایحه‌ای مرموز و اغواگر با نت‌های چرم و گل'
    },
    {
      name: 'ادوپرفیوم مردانه مسترپیس اسباد',
      brand: 'مسترپیس',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 4113500,
      original_price: 4330000,
      desc: 'رایحه‌ای خنک و مدرن برای آقایان خوش‌پوش'
    },
    {
      name: 'ادوپرفیوم زنانه نوید محمدزاده',
      brand: 'نوید محمدزاده',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 2812000,
      original_price: 2960000,
      desc: 'رایحه‌ای شیرین و گلی برای بانوان خاص'
    },
    {
      name: 'ادوپرفیوم زنانه مارکو سروسی د لیدی اینتنس',
      brand: 'مارکو سروسی',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 90,
      price: 12760000,
      original_price: 15950000,
      desc: 'ترکیبی جذاب از گل‌های شرقی و میوه‌های تابستانی'
    },
    {
      name: 'ادوپرفیوم مردانه مسترپیس لاتیدان',
      brand: 'مسترپیس',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 4113500,
      original_price: 4330000,
      desc: 'رایحه‌ای کلاسیک با ته‌مایه چوب و ادویه'
    },
    {
      name: 'ادوپرفیوم آرتیبل تصنیف بربط',
      brand: 'آرتیبل',
      concentration: 'ادوپرفیوم',
      gender: 'unisex',
      volume: 100,
      price: 9500000,
      original_price: 10000000,
      desc: 'رایحه‌ای الهام‌گرفته از موسیقی ایرانی با نت‌های گرم'
    },
    {
      name: 'پرفیوم اکسترکت زنانه وایت پارادایز کورنیش دوق',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'female',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'ترکیبی از گل‌های سفید و مشک، شاداب و بهشتی'
    },
    {
      name: 'ادوتویلت مردانه مارکو سروسی د من',
      brand: 'مارکو سروسی',
      concentration: 'ادوتویلت',
      gender: 'male',
      volume: 100,
      price: 12760000,
      original_price: 15950000,
      desc: 'رایحه‌ای خنک و مرکباتی برای روزهای گرم'
    },
    {
      name: 'ادوپرفیوم زنانه پازیریک مسترپیس',
      brand: 'مسترپیس',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 90,
      price: 4113500,
      original_price: 4330000,
      desc: 'ترکیبی از گل‌های بهاری و وانیل'
    },
    {
      name: 'ادوپرفیوم زنانه آر بی سی استوری کول',
      brand: 'آر بی سی استوری',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 4598000,
      original_price: 4840000,
      desc: 'رایحه‌ای مدرن و خنک با نت‌های میوه‌ای'
    },
    {
      name: 'ادوپرفیوم مردانه بورلی هیلز پولو کلاب تایتان',
      brand: 'بورلی هیلز پولو کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 5184000,
      original_price: 6480000,
      desc: 'رایحه‌ای قدرتمند و چوبی، مناسب مردان با اعتماد به نفس'
    },
    {
      name: 'ادوپرفیوم مردانه نوید محمدزاده سواق',
      brand: 'نوید محمدزاده',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 3258500,
      original_price: 3430000,
      desc: 'رایحه‌ای جسور و خاص با نت‌های شرقی'
    },
    {
      name: 'پرفیوم اکسترکت مردانه لورد نواق کورنیش دوق',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'male',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'رایحه‌ای سلطنتی و خیره‌کننده'
    },
    {
      name: 'ادوپرفیوم زنانه رویالیون لالبای',
      brand: 'رویالیون',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 7125000,
      original_price: 7500000,
      desc: 'عطری لطیف و زنانه با رایحه شکوفه‌های بهاری'
    },
    {
      name: 'پرفیوم اکسترکت ربل شوال کورنیش دوق',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'unisex',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'رایحه‌ای سرکش و آزادی‌خواه'
    },
    {
      name: 'ادوپرفیوم مردانه گرنویل تورنادو',
      brand: 'گرنویل',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 1824000,
      original_price: 1920000,
      desc: 'رایحه‌ای طوفانی و خنک با نت‌های مرکباتی'
    },
    {
      name: 'ادوپرفیوم زنانه نوید محمدزاده سواق',
      brand: 'نوید محمدزاده',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 3258500,
      original_price: 3430000,
      desc: 'نسخه زنانه سواق با رایحه‌ای شیرین‌تر'
    },
    {
      name: 'ادوپرفیوم مردانه بورلی هیلز پولو کلاب تروفی',
      brand: 'بورلی هیلز پولو کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 5184000,
      original_price: 6480000,
      desc: 'رایحه‌ای لوکس و پرقدرت'
    },
    {
      name: 'ادوتویلت مردانه بورلی هیلز پولو کلاب نامبر ناین',
      brand: 'بورلی هیلز پولو کلاب',
      concentration: 'ادوتویلت',
      gender: 'male',
      volume: 100,
      price: 2992000,
      original_price: 3740000,
      desc: 'خنک و تابستانی، مناسب استفاده روزانه'
    },
    {
      name: 'ادوپرفیوم زنانه توایلایت گرنویل',
      brand: 'گرنویل',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 1824000,
      original_price: 1920000,
      desc: 'رایحه‌ای مرموز و گلی برای غروب'
    },
    {
      name: 'ادوپرفیوم مردانه رویالیون چارم',
      brand: 'رویالیون',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 8360000,
      original_price: 8800000,
      desc: 'جذابیت و اعتماد به نفس در یک بطری'
    },
    {
      name: 'ادوپرفیوم زنانه گرنویل سانشاین',
      brand: 'گرنویل',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 1824000,
      original_price: 1920000,
      desc: 'رایحه‌ای شاد و آفتابی'
    },
    {
      name: 'ادوپرفیوم مردانه رویالیون میستری',
      brand: 'رویالیون',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 8360000,
      original_price: 8800000,
      desc: 'رازآلود و گیرا'
    },
    {
      name: 'ادوپرفیوم مردانه ریپلیکا کلاب تق د هرمس',
      brand: 'ریپلیکا کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 3239500,
      original_price: 3410000,
      desc: 'الهامی از برند هرمس با رایحه چرم و ادویه'
    },
    {
      name: 'ادوپرفیوم مردانه رپلیکا کلاب ولنتینو اومو',
      brand: 'رپلیکا کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 3239500,
      original_price: 3410000,
      desc: 'رایحه‌ای گرم و شیرین'
    },
    {
      name: 'پرفیوم اکسترکت کورنیش دوق روه',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'unisex',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'عطری منحصربه‌فرد و اغواگر'
    },
    {
      name: 'ادوپرفیوم چوگان ل پرنسس دو پلو',
      brand: 'چوگان',
      concentration: 'ادوپرفیوم',
      gender: 'unisex',
      volume: 100,
      price: 11200000,
      original_price: 14000000,
      desc: 'رایحه‌ای شاهزاده‌وار با نت‌های مرکبات و چوب'
    },
    {
      name: 'ادوپرفیوم زنانه آنتونیو روسینی پرزنس',
      brand: 'آنتونیو روسینی',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 5415000,
      original_price: 5700000,
      desc: 'حضوری پررنگ و زنانه'
    },
    {
      name: 'ادوپرفیوم زنانه رپلیکا کلاب گود گرل',
      brand: 'رپلیکا کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 3239500,
      original_price: 3410000,
      desc: 'دختر خوب با رایحه‌ای شیطنت‌آمیز'
    },
    {
      name: 'ادوپرفیوم آرتیبل تصنیف قانون',
      brand: 'آرتیبل',
      concentration: 'ادوپرفیوم',
      gender: 'unisex',
      volume: 100,
      price: 9500000,
      original_price: 10000000,
      desc: 'رایحه‌ای با نظم و هارمونی موسیقایی'
    },
    {
      name: 'ادوتویلت مردانه پولو کلاب نامبر وان',
      brand: 'پولو کلاب',
      concentration: 'ادوتویلت',
      gender: 'male',
      volume: 100,
      price: 2992000,
      original_price: 3740000,
      desc: 'شماره یک، رایحه‌ای کلاسیک و دوست‌داشتنی'
    },
    {
      name: 'ادوپرفیوم زنانه مارکو سروسی د لیدی',
      brand: 'مارکو سروسی',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 90,
      price: 12760000,
      original_price: 15950000,
      desc: 'زنانه و شیک با رایحه‌ای ماندگار'
    },
    {
      name: 'ادوپرفیوم چوگان ل د لیم',
      brand: 'چوگان',
      concentration: 'ادوپرفیوم',
      gender: 'unisex',
      volume: 100,
      price: 11200000,
      original_price: 14000000,
      desc: 'رایحه‌ای الهام‌گرفته از طبیعت'
    },
    {
      name: 'ادوپرفیوم زنانه مارکو سروسی هارمونی ایموشن',
      brand: 'مارکو سروسی',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 12760000,
      original_price: 15950000,
      desc: 'هارمونی احساسات با نت‌های گلی و شیرین'
    },
    {
      name: 'ادوپرفیوم زنانه مسترپیس ترمه',
      brand: 'مسترپیس',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 90,
      price: 3743000,
      original_price: 3940000,
      desc: 'لطافت و ظرافت ترمه در یک رایحه'
    },
    {
      name: 'پرفیوم اکسترکت زنانه لو شقمن کورنیش دوق',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'female',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'رایحه‌ای خاص و به‌یادماندنی'
    },
    {
      name: 'ادوپرفیوم مردانه رویالیون ویگور',
      brand: 'رویالیون',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 8360000,
      original_price: 8800000,
      desc: 'قدرت و نشاط در یک بطری'
    },
    {
      name: 'ادوپرفیوم مردانه ویوا ویتا هیرویک',
      brand: 'ویوا ویتا',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 2137500,
      original_price: 2250000,
      desc: 'رایحه‌ای قهرمانانه و الهام‌بخش'
    },
    {
      name: 'ادوپرفیوم زنانه بورلی هیلز پولو کلاب نامبر وان',
      brand: 'بورلی هیلز پولو کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 2992000,
      original_price: 3740000,
      desc: 'رایحه‌ای اسپرت و شاداب'
    },
    {
      name: 'ادوپرفیوم زنانه بورلی هیلز پولو کلاب پشن',
      brand: 'بورلی هیلز پولو کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 5184000,
      original_price: 6480000,
      desc: 'علاقه و شور در رایحه‌ای جذاب'
    },
    {
      name: 'ادوپرفیوم مردانه سنتودیو پیانو',
      brand: 'سنتودیو',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 1824000,
      original_price: 1920000,
      desc: 'نت‌های چوبی و موسیقایی'
    },
    {
      name: 'پرفیوم زنانه کی کولزیونی کیمیا',
      brand: 'کی کولزیونی',
      concentration: 'پرفیوم',
      gender: 'female',
      volume: 100,
      price: 5130000,
      original_price: 5400000,
      desc: 'جادوی کیمیا در بطری'
    },
    {
      name: 'پرفیوم اکسترکت کورنیش دوق س لور',
      brand: 'کورنیش دوق',
      concentration: 'پرفیوم اکسترکت',
      gender: 'unisex',
      volume: 125,
      price: 6175000,
      original_price: 6500000,
      desc: 'طلوعی باشکوه با رایحه‌ای شرقی'
    },
    {
      name: 'ادوپرفیوم د مرچنت آو ونیز فنیشیا',
      brand: 'د مرچنت آو ونیز',
      concentration: 'ادوپرفیوم',
      gender: 'unisex',
      volume: 100,
      price: 61940000,
      original_price: 65200000,
      desc: 'لوکس و تاریخی، الهام‌گرفته از ونیز'
    },
    {
      name: 'ادوپرفیوم مردانه رویالیون چریش',
      brand: 'رویالیون',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 7125000,
      original_price: 7500000,
      desc: 'گرامی و ارزشمند'
    },
    {
      name: 'ادوپرفیوم زنانه رویالیون بریز',
      brand: 'رویالیون',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 7125000,
      original_price: 7500000,
      desc: 'نسیم ملایم با رایحه خنک'
    },
    {
      name: 'ادوپرفیوم زنانه ل ریو مون',
      brand: 'ل ریو',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 2640000,
      original_price: 3300000,
      desc: 'رایحه‌ای رویایی و شب‌های مهتابی'
    },
    {
      name: 'ادوپرفیوم مردانه سرجیو کاپل زئوس',
      brand: 'سرجیو کاپل',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 4080000,
      original_price: 5100000,
      desc: 'قدرت خدایان یونان'
    },
    {
      name: 'ادوتویلت مردانه لَ ریو هیت فایر',
      brand: 'ل ریو',
      concentration: 'ادوتویلت',
      gender: 'male',
      volume: 90,
      price: 2640000,
      original_price: 3300000,
      desc: 'آتش و هیجان در رایحه'
    },
    {
      name: 'ادوپرفیوم زنانه لَ ریو فلور د فمه',
      brand: 'ل ریو',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 90,
      price: 2640000,
      original_price: 3300000,
      desc: 'گل‌های زنانه و لطیف'
    },
    {
      name: 'ادوپرفیوم زنانه مسترپیس کاریز',
      brand: 'مسترپیس',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 4531500,
      original_price: 4770000,
      desc: 'جذابیت و کاریزما'
    },
    {
      name: 'ادوتویلت مردانه ل ریوالگانت من',
      brand: 'ل ریو',
      concentration: 'ادوتویلت',
      gender: 'male',
      volume: 90,
      price: 2640000,
      original_price: 3300000,
      desc: 'ظرافت و اصالت'
    },
    {
      name: 'ادوپرفیوم مردانه رویالیون دمور',
      brand: 'رویالیون',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 7125000,
      original_price: 7500000,
      desc: 'متین و باشخصیت'
    },
    {
      name: 'ادوپرفیوم زنانه اجمل سکریفایس فور هر',
      brand: 'اجمل',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 50,
      price: 3360000,
      original_price: 4200000,
      desc: 'ایثار و عشق در رایحه'
    },
    {
      name: 'ادوتویلت مردانه ل ریو آکوا من',
      brand: 'ل ریو',
      concentration: 'ادوتویلت',
      gender: 'male',
      volume: 90,
      price: 2640000,
      original_price: 3300000,
      desc: 'آب، خنکی و تازگی'
    },
    {
      name: 'ادوپرفیوم زنانه ل ریو تاچ آف وومن',
      brand: 'ل ریو',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 90,
      price: 2640000,
      original_price: 3300000,
      desc: 'لمسی زنانه و ظریف'
    },
    {
      name: 'ادوپرفیوم مردانه آر بی سی استوری ریسپانسیبل',
      brand: 'آر بی سی استوری',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 4598000,
      original_price: 4840000,
      desc: 'مسئولانه و کاریزماتیک'
    },
    {
      name: 'ادوپرفیوم مردانه لویس آلاویا کینگ ریچارد کنسنتره',
      brand: 'لویس آلاویا',
      concentration: 'ادوپرفیوم',
      gender: 'male',
      volume: 100,
      price: 16672500,
      original_price: 17550000,
      desc: 'پادشاهانه و غنی'
    },
    {
      name: 'ادوپرفیوم زنانه بورلی هیلز پولو کلاب نامبر ناین',
      brand: 'بورلی هیلز پولو کلاب',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 100,
      price: 2992000,
      original_price: 3740000,
      desc: 'شماره نه، رایحه‌ای خاص و امروزی'
    },
    {
      name: 'ادوپرفیوم زنانه ل ریو سوییت هاپ',
      brand: 'ل ریو',
      concentration: 'ادوپرفیوم',
      gender: 'female',
      volume: 90,
      price: 2640000,
      original_price: 3300000,
      desc: 'امید شیرین و دلنشین'
    },
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(
        item.name,
        item.brand,
        item.concentration,
        item.gender,
        null, // season
        '[]', // top_notes
        '[]', // middle_notes
        '[]', // base_notes
        item.desc,
        getRandomImage(), // تصویر رندوم
        item.price,
        item.original_price,
        item.volume
      );
    }
  });
  insertMany(products);
  console.log('محصولات واقعی وارد دیتابیس شدند.');
}

module.exports = db;