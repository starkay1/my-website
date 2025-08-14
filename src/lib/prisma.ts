import { PrismaClient } from "../../generated/prisma";

// Ensure a single PrismaClient instance in dev
// Use a fallback for environments where globalThis is not available (like Edge Runtime)
const getGlobalThis = () => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof window !== 'undefined') return window;
  if (typeof self !== 'undefined') return self;
  return {} as any;
};

const globalForPrisma = getGlobalThis() as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;