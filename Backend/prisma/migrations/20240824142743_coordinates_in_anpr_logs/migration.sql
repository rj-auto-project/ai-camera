/*
  Warnings:

  - Added the required column `boxCoords` to the `AnprLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnprLogs" ADD COLUMN     "boxCoords" VARCHAR(255) NOT NULL;
