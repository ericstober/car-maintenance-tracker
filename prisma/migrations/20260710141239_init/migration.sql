-- CreateEnum
CREATE TYPE "PerformedBy" AS ENUM ('SELF', 'SHOP');

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "vin" TEXT,
    "currentMileage" INTEGER,
    "purchaseDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultIntervalMiles" INTEGER,
    "defaultIntervalMonths" INTEGER,

    CONSTRAINT "maintenance_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_records" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT,
    "datePerformed" TIMESTAMP(3) NOT NULL,
    "mileageAtService" INTEGER,
    "cost" DECIMAL(10,2),
    "performedBy" "PerformedBy" NOT NULL DEFAULT 'SELF',
    "shopName" TEXT,
    "notes" TEXT,
    "nextDueMileage" INTEGER,
    "nextDueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_categories_name_key" ON "maintenance_categories"("name");

-- CreateIndex
CREATE INDEX "maintenance_records_vehicleId_idx" ON "maintenance_records"("vehicleId");

-- CreateIndex
CREATE INDEX "maintenance_records_categoryId_idx" ON "maintenance_records"("categoryId");

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "maintenance_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
