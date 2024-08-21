/*
  Warnings:

  - Added the required column `confidence` to the `CrowdCount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CrowdCount" ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "DetectionLog" ALTER COLUMN "boxCoords" SET DATA TYPE VARCHAR(255);
