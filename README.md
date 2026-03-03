Ссылка на сайт: https://arsulken.github.io/FRONTEND-AND-BACKEND-PRACTICE_2/

## Установка и запуск
```bash
npm install
npm start
```

## Формат товара
```json
{
  "id": 1,
  "title": "Наушники",
  "price": 4990
}
```

## Маршруты

### Получить все товары
`GET /products`

### Получить товар по id
`GET /products/:id`

### Добавить товар
`POST /products`
Body (JSON):
```json
{ "title": "Монитор", "price": 12990 }
```

### Редактировать товар (частично)
`PATCH /products/:id`
Body (JSON), можно передать одно или оба поля:
```json
{ "price": 11990 }
```

### Удалить товар
`DELETE /products/:id`

## Примеры запросов (curl)

```bash
curl http://localhost:3000/products
curl http://localhost:3000/products/1

curl -X POST http://localhost:3000/products     -H "Content-Type: application/json"     -d '{"title":"Монитор","price":12990}'

curl -X PATCH http://localhost:3000/products/2     -H "Content-Type: application/json"     -d '{"title":"Механическая клавиатура"}'

curl -X DELETE http://localhost:3000/products/3
```

## Примечание
Данные хранятся в памяти (без БД). При перезапуске сервера список сбросится — это нормально для практического задания.
