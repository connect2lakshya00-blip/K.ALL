const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
db.$connect()
  .then(() => { console.log('DB CONNECTED OK'); return db.$disconnect(); })
  .catch(e => { console.log('DB ERROR:', e.message); process.exit(1); });
