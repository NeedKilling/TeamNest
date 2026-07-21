// clear-redis.js

import { redis } from "@/server/redis";



async function clear(){
try {
    await redis.del("projects")
  console.log(`Успешно удалено ключей`);
} catch (error) {
  console.error("Ошибка при очистке:", error);
} finally {
  redis.close();
}
}
clear()