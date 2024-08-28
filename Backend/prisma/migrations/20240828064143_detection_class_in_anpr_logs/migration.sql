/*
  Warnings:

  - Made the column `detectionClass` on table `AnprLogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AnprLogs" ALTER COLUMN "detectionClass" SET NOT NULL;
