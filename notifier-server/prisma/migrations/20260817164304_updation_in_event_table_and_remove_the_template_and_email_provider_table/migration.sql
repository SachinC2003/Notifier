/*
  Warnings:

  - You are about to drop the column `created_at` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_key` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `email_providers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `templates` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,eventKey]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `body` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventKey` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "email_providers" DROP CONSTRAINT "email_providers_userId_fkey";

-- DropForeignKey
ALTER TABLE "templates" DROP CONSTRAINT "templates_eventId_fkey";

-- DropForeignKey
ALTER TABLE "templates" DROP CONSTRAINT "templates_userId_fkey";

-- DropIndex
DROP INDEX "events_userId_event_key_key";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "created_at",
DROP COLUMN "event_key",
DROP COLUMN "is_active",
DROP COLUMN "updated_at",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventKey" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "email_providers";

-- DropTable
DROP TABLE "templates";

-- CreateIndex
CREATE UNIQUE INDEX "events_userId_eventKey_key" ON "events"("userId", "eventKey");
