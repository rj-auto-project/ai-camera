-- AlterTable
ALTER TABLE "AnprLogs" ALTER COLUMN "boxCoords" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DetectionLog" ALTER COLUMN "boxCoords" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IncidentLogs" ALTER COLUMN "boxCoords" DROP NOT NULL;
