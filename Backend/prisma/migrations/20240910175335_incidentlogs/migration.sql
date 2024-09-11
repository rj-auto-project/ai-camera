-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IncidentType" ADD VALUE 'GARBAGE';
ALTER TYPE "IncidentType" ADD VALUE 'POTHOLE';
ALTER TYPE "IncidentType" ADD VALUE 'CATTLE';

-- CreateTable
CREATE TABLE "IncidentLogs" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cameraId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "trackId" VARCHAR(255) NOT NULL,
    "camera_ip" VARCHAR(30) NOT NULL,
    "boxCoords" VARCHAR(255) NOT NULL,
    "incidentType" "IncidentType" NOT NULL,

    CONSTRAINT "IncidentLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncidentLogs" ADD CONSTRAINT "IncidentLogs_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("cameraId") ON DELETE RESTRICT ON UPDATE CASCADE;
