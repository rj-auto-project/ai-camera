-- CreateTable
CREATE TABLE "DetectionTable" (
    "id" SERIAL NOT NULL,
    "custom_track_id" VARCHAR(255) NOT NULL,
    "camera_id" VARCHAR(30) NOT NULL,
    "first_appearance" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "last_appearance" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dbBox" VARCHAR(255) NOT NULL,
    "dLabel" VARCHAR(255) NOT NULL,
    "dConf" VARCHAR(255),
    "pLabel" VARCHAR(255),
    "pConf" VARCHAR(255),

    CONSTRAINT "DetectionTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetectionTable" ADD CONSTRAINT "DetectionTable_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "Camera"("cameraId") ON DELETE RESTRICT ON UPDATE CASCADE;
