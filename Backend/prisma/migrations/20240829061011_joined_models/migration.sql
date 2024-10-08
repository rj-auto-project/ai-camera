-- AlterTable
ALTER TABLE "OperationLog" ALTER COLUMN "closeTimestamp" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AnprLogs" ADD CONSTRAINT "AnprLogs_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "Camera"("cameraId") ON DELETE RESTRICT ON UPDATE CASCADE;
