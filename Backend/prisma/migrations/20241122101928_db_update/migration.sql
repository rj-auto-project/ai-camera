-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('CROWD_RESTRICTION', 'GARBAGE', 'POTHOLE', 'CATTLE', 'WATERLOGGING', 'PEEING', 'SPITTING', 'GARBAGE_LITTERING');

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "surveyName" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time" VARCHAR(10) NOT NULL,
    "initialDestination" VARCHAR(255) NOT NULL,
    "finalDestination" VARCHAR(255) NOT NULL,
    "type" "SurveyType" NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyReport" (
    "id" SERIAL NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "thumbnail" VARCHAR(255) NOT NULL,
    "className" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,

    CONSTRAINT "SurveyReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyReport" ADD CONSTRAINT "SurveyReport_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
