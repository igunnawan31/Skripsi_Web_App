/*
  Warnings:

  - Added the required column `timezone` to the `Agenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "timezone" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "AgendaOccurrence_date_idx" ON "AgendaOccurrence"("date");

-- CreateIndex
CREATE INDEX "AgendaOccurrence_agendaId_date_idx" ON "AgendaOccurrence"("agendaId", "date");
