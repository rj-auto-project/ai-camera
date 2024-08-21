-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "className" VARCHAR(255) NOT NULL,
    "classStatus" "Status" NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);
