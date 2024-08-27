/*
  Warnings:

  - Made the column `timestamp` on table `DetectionLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DetectionLog" ALTER COLUMN "timestamp" SET NOT NULL,
ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ;
