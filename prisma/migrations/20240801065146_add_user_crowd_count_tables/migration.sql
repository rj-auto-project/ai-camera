-- CreateTable
CREATE TABLE "CrowdCount" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrowdCount_pkey" PRIMARY KEY ("id")
);
