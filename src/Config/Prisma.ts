import { Prisma, PrismaClient } from '@prisma/client';
import Logger from './Logger';
 // Import the logger

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' }, // Capture query events
    { level: 'info', emit: 'event' }, // Capture info events
    { level: 'warn', emit: 'event' }, // Capture warnings
    { level: 'error', emit: 'event' }, // Capture errors
  ],
});

// Log every query executed
prisma.$on('query', async (event: Prisma.QueryEvent) => {
  Logger.info('PrismaQuery', event.query, `Duration: ${event.duration}ms`);
});

// Log other events
prisma.$on('info', (event: Prisma.LogEvent) => {
  Logger.info('PrismaInfo', event.message);
});

prisma.$on('warn', (event: Prisma.LogEvent) => {
  Logger.warn('PrismaWarning', event.message);
});

prisma.$on('error', (event: Prisma.LogEvent) => {
  Logger.error('PrismaError', event.message);
});

export default prisma;
