/*
  Warnings:

  - Added the required column `thumbnail` to the `IncidentLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncidentLogs" ADD COLUMN     "thumbnail" VARCHAR(30) NOT NULL;
