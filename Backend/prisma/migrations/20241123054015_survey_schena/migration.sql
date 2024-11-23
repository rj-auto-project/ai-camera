/*
  Warnings:

  - The values [CROWD_RESTRICTION,GARBAGE,POTHOLE,CATTLE,WATERLOGGING,PEEING,SPITTING,GARBAGE_LITTERING] on the enum `SurveyType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `time` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SurveyType_new" AS ENUM ('ROAD_DEFECTS', 'ROAD_FURNITURE');
ALTER TABLE "Survey" ALTER COLUMN "type" TYPE "SurveyType_new" USING ("type"::text::"SurveyType_new");
ALTER TYPE "SurveyType" RENAME TO "SurveyType_old";
ALTER TYPE "SurveyType_new" RENAME TO "SurveyType";
DROP TYPE "SurveyType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "time";

-- AlterTable
ALTER TABLE "SurveyReport" ADD COLUMN     "distance" DOUBLE PRECISION;
