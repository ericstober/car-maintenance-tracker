"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Field the form itself collects. vehicleId is deliberately exluded here - it's bound into the action via .bind() from the page, not submitted by the form.
const maintenanceRecordFormSchema = z.object({
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

const maintenanceRecordSchema = maintenanceRecordFormSchema.extend({
  vehicleId: z.uuid(),
});

export type MaintenanceRecordFormInput = z.infer<typeof maintenanceRecordFormSchema>;
export type MaintenanceRecordInput = z.infer<typeof maintenanceRecordSchema>;

export type CreateMaintenanceRecordState = {
  errors?: Partial<Record<keyof MaintenanceRecordFormInput, string[]>>;
  message: string;
} | null;

export async function createMaintenanceRecord(
  vehicleId: string,
  _prevState: CreateMaintenanceRecordState,
  formData: FormData,
) {
  const raw = Object.fromEntries(formData.entries());

  // Blank optional fields arrive as "" from the form; treat them as "not provided" rather than letting Zod choke on an empty string for a number/date field.
  const cleaned = {
    ...raw,
    categoryId: raw.categoryId === "" ? undefined : raw.categoryId,
    title: raw.title === "" ? undefined : raw.title,
    mileageAtService: raw.mileageAtService === "" ? undefined : raw.mileageAtService,
    cost: raw.cost === "" ? undefined : raw.cost,
    shopName: raw.shopName === "" ? undefined : raw.shopName,
    notes: raw.notes === "" ? undefined : raw.notes,
    nextDueMileage: raw.nextDueMileage === "" ? undefined : raw.nextDueMileage,
    nextDueDate: raw.nextDueDate === "" ? undefined : raw.nextDueDate,
  };

  const parsed = maintenanceRecordFormSchema.safeParse(cleaned);

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  await prisma.maintenanceRecord.create({
    data: { ...parsed.data, vehicleId },
  });

  revalidatePath(`/vehicles/${vehicleId}`);
  redirect(`/vehicles/${vehicleId}`);
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
