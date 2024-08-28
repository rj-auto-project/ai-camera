-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('REDLIGHT_VIOLATION', 'OVERSPEEDING', 'ILLEGAL_PARKING', 'WRONG_WAY_DRIVING', 'ACCIDENT', 'VEHICLE_RESTRICTION', 'CROWD_RESTRICTION');

-- CreateTable
CREATE TABLE "Incident" (
    "incidentType" "IncidentType" NOT NULL,
    "verifiedState" BOOLEAN NOT NULL DEFAULT false,
    "incidentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "incidentData" JSONB NOT NULL,
    "cameraId" VARCHAR(30) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "Camera"("cameraId") ON DELETE RESTRICT ON UPDATE CASCADE;
