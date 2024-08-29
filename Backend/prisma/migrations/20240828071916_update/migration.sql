/*
  Warnings:

  - Made the column `bottomColor` on table `DetectionLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `topColor` on table `DetectionLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AnprLogs" ADD COLUMN     "ownerName" VARCHAR(255);

-- AlterTable
ALTER TABLE "DetectionLog" ADD COLUMN     "licenseNumber" VARCHAR(20),
ALTER COLUMN "bottomColor" SET NOT NULL,
ALTER COLUMN "topColor" SET NOT NULL;
