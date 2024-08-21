/*
  Warnings:

  - Added the required column `camera_ip` to the `CrowdCount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `camera_ip` to the `DetectionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `camera_ip` to the `OperationLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CrowdCount" ADD COLUMN     "camera_ip" VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE "DetectionLog" ADD COLUMN     "camera_ip" VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE "OperationLog" ADD COLUMN     "camera_ip" VARCHAR(30) NOT NULL;
