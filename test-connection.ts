import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

try {
  await client.connect();
  console.log('✅ Успешное подключение!');
  const res = await client.query('SELECT NOW()');
  console.log('Время БД:', res.rows[0].now);
  await client.end();
} catch (err) {
  console.error('❌ Ошибка подключения:');
}