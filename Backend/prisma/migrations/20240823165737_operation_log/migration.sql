/*
  Warnings:

  - Made the column `license_number` on table `AnprLogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AnprLogs" ALTER COLUMN "license_number" SET NOT NULL;
