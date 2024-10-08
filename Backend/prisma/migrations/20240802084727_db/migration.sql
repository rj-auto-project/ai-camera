-- CreateTable
CREATE TABLE "DetectionLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "cameraId" TEXT NOT NULL,
    "detectionId" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,
    "trackId" TEXT,

    CONSTRAINT "DetectionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" SERIAL NOT NULL,
    "operationType" VARCHAR(20) NOT NULL,
    "operationData" JSONB NOT NULL,
    "initialTimestamp" TIMESTAMP(3) NOT NULL,
    "finalTimestamp" TIMESTAMP(3) NOT NULL,
    "cameraId" VARCHAR(20) NOT NULL,
    "userId" VARCHAR(20) NOT NULL,
    "closeTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnprLogs" (
    "id" SERIAL NOT NULL,
    "camera_ip" VARCHAR(30) NOT NULL,
    "camera_id" VARCHAR(30) NOT NULL,
    "time_stamp" TIMESTAMP(6) NOT NULL,
    "detection_id" INTEGER NOT NULL,
    "meta_data" JSONB NOT NULL,
    "license_number" VARCHAR(20),
    "prediction_confidence" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AnprLogs_pkey" PRIMARY KEY ("id")
);
