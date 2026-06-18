const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const ADMIN_SECRET = 'my_super_secret_key_123'; // در پروژه واقعی از متغیر محیطی استفاده کنید

// Middleware احراز هویت ادمین
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'دسترسی غیرمجاز' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ADMIN_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'توکن نامعتبر' });
  }
}

// ================== مسیرهای عمومی (فروشگاه) ==================
app.get('/api/filters', (req, res) => {
  const brands = db.prepare('SELECT DISTINCT brand FROM products').all().map(r => r.brand);
  const concentrations = db.prepare('SELECT DISTINCT concentration FROM products').all().map(r => r.concentration);
  const genders = db.prepare('SELECT DISTINCT gender FROM products').all().map(r => r.gender);
  const seasons = db.prepare('SELECT DISTINCT season FROM products WHERE season IS NOT NULL').all().map(r => r.season);
  const allProducts = db.prepare('SELECT top_notes, middle_notes, base_notes FROM products').all();
  const notesSet = new Set();
  allProducts.forEach(p => {
    ['top_notes', 'middle_notes', 'base_notes'].forEach(field => {
      try { JSON.parse(p[field]).forEach(n => notesSet.add(n)); } catch {}
    });
  });
  const notes = Array.from(notesSet).sort();
  res.json({ brands, concentrations, genders, seasons, notes });
});

// دریافت محصولات (با صفحه‌بندی و فیلترها)
app.get('/api/products', (req, res) => {
  const { gender, brand, concentration, season, note, search, sort, featured, page, limit } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  let countSql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
  const params = [];

  // فیلترها
  if (gender) {
    sql += ' AND gender = ?';
    countSql += ' AND gender = ?';
    params.push(gender);
  }
  if (brand) {
    sql += ' AND brand = ?';
    countSql += ' AND brand = ?';
    params.push(brand);
  }
  if (concentration) {
    sql += ' AND concentration = ?';
    countSql += ' AND concentration = ?';
    params.push(concentration);
  }
  if (season) {
    sql += ' AND season = ?';
    countSql += ' AND season = ?';
    params.push(season);
  }
  if (note) {
    sql += ' AND (top_notes LIKE ? OR middle_notes LIKE ? OR base_notes LIKE ?)';
    countSql += ' AND (top_notes LIKE ? OR middle_notes LIKE ? OR base_notes LIKE ?)';
    const likeNote = `%${note}%`;
    params.push(likeNote, likeNote, likeNote, likeNote, likeNote, likeNote);
  }
  if (search) {
    sql += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
    countSql += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
    const likeSearch = `%${search}%`;
    params.push(likeSearch, likeSearch, likeSearch, likeSearch, likeSearch, likeSearch);
  }
  if (featured === 'discount') {
    sql += ' AND original_price IS NOT NULL AND original_price > price';
    countSql += ' AND original_price IS NOT NULL AND original_price > price';
  }

  // شمارش کل
  const countStmt = db.prepare(countSql);
  const { total } = countStmt.get(...params);
  const totalItems = total;

  // مرتب‌سازی
  if (sort === 'price_asc') sql += ' ORDER BY price ASC';
  else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
  else sql += ' ORDER BY id DESC';

  // صفحه‌بندی
  const pageNum = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 50;
  const offset = (pageNum - 1) * pageSize;
  sql += ' LIMIT ? OFFSET ?';
  params.push(pageSize, offset);

  const stmt = db.prepare(sql);
  const products = stmt.all(...params);

  res.json({
    products,
    pagination: {
      page: pageNum,
      limit: pageSize,
      total: totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    }
  });
});

// دریافت یک محصول
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'محصول یافت نشد' });
  res.json(product);
});

// محصول تصادفی
app.get('/api/products/random', (req, res) => {
  const product = db.prepare('SELECT * FROM products ORDER BY RANDOM() LIMIT 1').get();
  if (!product) return res.status(404).json({ error: 'محصولی یافت نشد' });
  res.json(product);
});

// پیشنهادات جستجو
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  const stmt = db.prepare('SELECT id, name, image FROM products WHERE name LIKE ? LIMIT 5');
  const suggestions = stmt.all(`%${q}%`);
  res.json(suggestions);
});

// ثبت سفارش
app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, items } = req.body;
  if (!customer_name || !phone || !address || !items || !items.length) {
    return res.status(400).json({ error: 'اطلاعات ناقص است' });
  }
  const insertOrder = db.prepare('INSERT INTO orders (customer_name, phone, address) VALUES (?, ?, ?)');
  const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)');
  const result = insertOrder.run(customer_name, phone, address);
  const orderId = result.lastInsertRowid;
  const insertItems = db.transaction((items) => {
    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.quantity || 1);
    }
  });
  insertItems(items);
  res.json({ success: true, order_id: orderId });
});

// ================== مسیرهای ادمین ==================
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE username = ? AND password = ?').get(username, password);
  if (!admin) return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, ADMIN_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.get('/api/admin/products', authenticateAdmin, (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  res.json(products);
});

app.post('/api/admin/products', authenticateAdmin, (req, res) => {
  const { name, brand, concentration, gender, season, top_notes, middle_notes, base_notes, description, image, price, original_price, volume_ml } = req.body;
  if (!name || !brand || !price || !volume_ml) {
    return res.status(400).json({ error: 'فیلدهای ضروری تکمیل نشده‌اند' });
  }
  const stmt = db.prepare(`INSERT INTO products (name, brand, concentration, gender, season, top_notes, middle_notes, base_notes, description, image, price, original_price, volume_ml)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const info = stmt.run(
    name, brand, concentration || '', gender || '', season || null,
    JSON.stringify(top_notes || []), JSON.stringify(middle_notes || []), JSON.stringify(base_notes || []),
    description || '', image || '', price, original_price || null, volume_ml
  );
  res.json({ success: true, id: info.lastInsertRowid });
});

app.put('/api/admin/products/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'محصول یافت نشد' });

  const { name, brand, concentration, gender, season, top_notes, middle_notes, base_notes, description, image, price, original_price, volume_ml } = req.body;
  const updated = {
    name: name ?? existing.name,
    brand: brand ?? existing.brand,
    concentration: concentration ?? existing.concentration,
    gender: gender ?? existing.gender,
    season: season !== undefined ? season : existing.season,
    top_notes: top_notes ? JSON.stringify(top_notes) : existing.top_notes,
    middle_notes: middle_notes ? JSON.stringify(middle_notes) : existing.middle_notes,
    base_notes: base_notes ? JSON.stringify(base_notes) : existing.base_notes,
    description: description ?? existing.description,
    image: image ?? existing.image,
    price: price ?? existing.price,
    original_price: original_price !== undefined ? original_price : existing.original_price,
    volume_ml: volume_ml ?? existing.volume_ml,
  };

  db.prepare(`UPDATE products SET name=?, brand=?, concentration=?, gender=?, season=?, top_notes=?, middle_notes=?, base_notes=?, description=?, image=?, price=?, original_price=?, volume_ml=? WHERE id=?`)
    .run(updated.name, updated.brand, updated.concentration, updated.gender, updated.season,
      updated.top_notes, updated.middle_notes, updated.base_notes, updated.description, updated.image,
      updated.price, updated.original_price, updated.volume_ml, id);
  res.json({ success: true });
});

app.delete('/api/admin/products/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ success: true });
});

app.get('/api/admin/orders', authenticateAdmin, (req, res) => {
  const orders = db.prepare(`
    SELECT o.*, 
      (SELECT json_group_array(json_object('product_id', oi.product_id, 'quantity', oi.quantity, 'name', p.name, 'price', p.price))
       FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
    FROM orders o ORDER BY o.created_at DESC
  `).all();
  orders.forEach(order => {
    order.items = JSON.parse(order.items);
  });
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});