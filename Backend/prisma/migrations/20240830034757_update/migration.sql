-- AddForeignKey
ALTER TABLE "CrowdCount" ADD CONSTRAINT "CrowdCount_camera_ip_fkey" FOREIGN KEY ("camera_ip") REFERENCES "Camera"("cameraId") ON DELETE RESTRICT ON UPDATE CASCADE;
