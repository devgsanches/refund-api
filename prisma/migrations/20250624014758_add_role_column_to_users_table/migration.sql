-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('employee', 'manager');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'employee';
