"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";

const maintenanceRecordSchema = z.object({
  vehicleId: z.uuid(),
  categoryId: z.uuid().optional().nullable(),
  title: z.string().optional().nullable(),
  datePerformed: z.coerce.date(),
  mileageAtService: z.coerce.number().int().min(0).optional().nullable(),
  cost: z.coerce.number().min(0).optional().nullable(),
  performedBy: z.enum(["SELF", "SHOP"]).default("SELF"),
  shopName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  nextDueMileage: z.coerce.number().int().min(0).optional().nullable(),
  nextDueDate: z.coerce.date().optional().nullable(),
});

export type MaintenanceRecordInput = z.infer<typeof maintenanceRecordSchema>;

export async function createMaintenanceRecord(input: MaintenanceRecordInput) {
  const data = maintenanceRecordSchema.parse(input);

  const record = await prisma.maintenanceRecord.create({
    data,
    include: { category: true },
  });

  revalidatePath(`/vehicles/${data.vehicleId}`);
  return record;
}

export async function getMaintenanceRecords(vehicleId?: string) {
  return prisma.maintenanceRecord.findMany({
    where: vehicleId ? { vehicleId } : undefined,
    orderBy: { datePerformed: "desc" },
    include: { category: true, vehicle: true },
  });
}

export async function getMaintenanceRecordById(id: string) {
  const record = await prisma.maintenanceRecord.findUnique({
    where: { id },
    include: { category: true, vehicle: true },
  });

  if (!record) {
    throw new Error(`Maintenance record with id ${id} not found`);
  }

  return record;
}

export async function updateMaintenanceRecord(id: string, input: Partial<MaintenanceRecordInput>) {
  const data = maintenanceRecordSchema.partial().parse(input);

  const record = await prisma.maintenanceRecord.update({
    where: { id },
    data,
    include: { category: true },
  });

  revalidatePath(`/vehicles/${record.vehicleId}`);
  return record;
}

export async function deleteMaintenanceRecord(id: string) {
  const record = await prisma.maintenanceRecord.delete({ where: { id } });

  revalidatePath(`/vehicles/${record.vehicleId}`);
}

export async function getMaintenanceCategories() {
  return prisma.maintenanceCategory.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getUpcomingMaintenance() {
  return prisma.maintenanceRecord.findMany({
    where: { nextDueDate: { not: null } },
    orderBy: { nextDueDate: "asc" },
    include: { category: true, vehicle: true },
  });
}
