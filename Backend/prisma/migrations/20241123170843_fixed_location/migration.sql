/*
  Warnings:

  - The `initialDestination` column on the `Survey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finalDestination` column on the `Survey` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `location` column on the `SurveyReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "initialDestination",
ADD COLUMN     "initialDestination" JSONB,
DROP COLUMN "finalDestination",
ADD COLUMN     "finalDestination" JSONB;

-- AlterTable
ALTER TABLE "SurveyReport" DROP COLUMN "location",
ADD COLUMN     "location" JSONB;
