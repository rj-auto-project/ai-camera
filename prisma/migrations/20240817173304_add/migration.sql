/*
  Warnings:

  - You are about to drop the column `detectionId` on the `DetectionLog` table. All the data in the column will be lost.
  - Added the required column `boxCoords` to the `DetectionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classConfidence` to the `DetectionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detectionClass` to the `DetectionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetectionLog" DROP COLUMN "detectionId",
ADD COLUMN     "boxCoords" VARCHAR(50) NOT NULL,
ADD COLUMN     "classConfidence" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "detectionClass" VARCHAR(20) NOT NULL;
