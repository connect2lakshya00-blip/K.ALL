import { db } from './lib/prisma';

async function diagnose() {
  console.log('Available Prisma Models:');
  const keys = Object.keys(db).filter(key => !key.startsWith('$') && !key.startsWith('_'));
  console.log(JSON.stringify(keys, null, 2));
  process.exit(0);
}

diagnose();
