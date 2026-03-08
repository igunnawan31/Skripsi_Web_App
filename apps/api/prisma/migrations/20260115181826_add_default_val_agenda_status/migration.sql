/*
  Warnings:

  - The values [ANNUALLY] on the enum `AgendaFreq` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgendaFreq_new" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');
ALTER TABLE "Agenda" ALTER COLUMN "frequency" TYPE "AgendaFreq_new" USING ("frequency"::text::"AgendaFreq_new");
ALTER TYPE "AgendaFreq" RENAME TO "AgendaFreq_old";
ALTER TYPE "AgendaFreq_new" RENAME TO "AgendaFreq";
DROP TYPE "public"."AgendaFreq_old";
COMMIT;

-- AlterTable
ALTER TABLE "Agenda" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
