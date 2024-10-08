/*
  Warnings:

  - You are about to alter the column `trackId` on the `DetectionLog` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `trackId` to the `AnprLogs` table without a default value. This is not possible if the table is not empty.
  - Made the column `trackId` on table `DetectionLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AnprLogs" ADD COLUMN     "trackId" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "DetectionLog" ALTER COLUMN "trackId" SET NOT NULL,
ALTER COLUMN "trackId" SET DATA TYPE VARCHAR(255);
