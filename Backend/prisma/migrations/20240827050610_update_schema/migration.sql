/*
  Warnings:

  - The `timestamp` column on the `DetectionLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DetectionLog" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(6);

-- AddForeignKey
ALTER TABLE "DetectionLog" ADD CONSTRAINT "DetectionLog_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("cameraId") ON DELETE RESTRICT ON UPDATE CASCADE;
