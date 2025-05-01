import { PrismaClient } from '@prisma/client';

// 添加调试日志
console.log('初始化 Prisma 客户端');

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'], // 添加日志记录
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;