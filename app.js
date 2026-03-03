const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Небольшая middleware-логика для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Данные "в памяти" (без БД) — достаточно для практики
let products = [
  { id: 1, title: 'Наушники', price: 4990 },
  { id: 2, title: 'Клавиатура', price: 7990 },
  { id: 3, title: 'Мышь', price: 2990 },
];

// Вспомогательные функции
function toInt(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function validateProductPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.title !== undefined) {
    if (typeof payload.title !== 'string' || payload.title.trim().length === 0) {
      errors.push('Поле "title" должно быть непустой строкой.');
    }
  }

  if (!partial || payload.price !== undefined) {
    const price = toNumber(payload.price);
    if (price === null || price < 0) {
      errors.push('Поле "price" должно быть числом >= 0.');
    }
  }

  return errors;
}

// Главная страница (необязательно, но удобно проверить сервер)
app.get('/', (req, res) => {
  res.type('text').send('Products API работает. Используй /products');
});

// ===== CRUD для товаров =====

// READ: получить все товары
app.get('/products', (req, res) => {
  res.json(products);
});

// READ: получить товар по id
app.get('/products/:id', (req, res) => {
  const id = toInt(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Некорректный id' });

  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });

  res.json(product);
});

// CREATE: добавить товар
app.post('/products', (req, res) => {
  const errors = validateProductPayload(req.body, { partial: false });
  if (errors.length) return res.status(400).json({ errors });

  const title = req.body.title.trim();
  const price = Number(req.body.price);

  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = { id: newId, title, price };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// UPDATE: отредактировать товар (частичное обновление)
app.patch('/products/:id', (req, res) => {
  const id = toInt(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Некорректный id' });

  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Товар не найден' });

  const errors = validateProductPayload(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ errors });

  if (req.body.title !== undefined) product.title = String(req.body.title).trim();
  if (req.body.price !== undefined) product.price = Number(req.body.price);

  res.json(product);
});

// DELETE: удалить товар по id
app.delete('/products/:id', (req, res) => {
  const id = toInt(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Некорректный id' });

  const before = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === before) {
    return res.status(404).json({ error: 'Товар не найден' });
  }

  res.json({ ok: true });
});

// Обработка неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
