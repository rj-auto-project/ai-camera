/*
  Warnings:

  - You are about to drop the `Incident` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_cameraId_fkey";

-- AlterTable
ALTER TABLE "DetectionLog" ADD COLUMN     "incidentType" "IncidentType";

-- DropTable
DROP TABLE "Incident";
