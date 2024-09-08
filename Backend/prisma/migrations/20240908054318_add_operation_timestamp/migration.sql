/*
  Warnings:

  - You are about to drop the column `camera_ip` on the `CrowdCount` table. All the data in the column will be lost.
  - Added the required column `cameraId` to the `CrowdCount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CrowdCount" DROP CONSTRAINT "CrowdCount_camera_ip_fkey";

-- AlterTable
ALTER TABLE "CrowdCount" DROP COLUMN "camera_ip",
ADD COLUMN     "cameraId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OperationLog" ADD COLUMN     "operationTimestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "CrowdCount" ADD CONSTRAINT "CrowdCount_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("cameraId") ON DELETE RESTRICT ON UPDATE CASCADE;
