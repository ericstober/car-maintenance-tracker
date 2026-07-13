"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";

const vehicleSchema = z.object({
  nickname: z.string().min(1, "Nickname is required"),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  make: z.string().min(1),
  model: z.string().min(1),
  vin: z.string().optional().nullable(),
  currentMileage: z.coerce.number().int().min(0).optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export type CreateVehicleState = {
  errors?: Partial<Record<keyof VehicleInput, string[]>>;
  message?: string;
} | null;

export async function createVehicle(_prevState: CreateVehicleState, formData: FormData): Promise<CreateVehicleState> {
  const raw = Object.fromEntries(formData.entries());

  const cleaned = {
    ...raw,
    vin: raw.vin === "" ? undefined : raw.vin,
    currentMileage: raw.currentMileage === "" ? undefined : raw.currentMileage,
    purchaseDate: raw.purchaseDate === "" ? undefined : raw.purchaseDate,
    notes: raw.notes === "" ? undefined : raw.notes,
  };

  const parsed = vehicleSchema.safeParse(cleaned);

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  await prisma.vehicle.create({ data: parsed.data });

  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function getVehicles() {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function getVehicleById(id: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      maintenanceRecords: {
        orderBy: { datePerformed: "desc" },
        include: { category: true },
      },
    },
  });

  if (!vehicle) {
    throw new Error(`Vehicle with id ${id} not found`);
  }

  return vehicle;
}

export async function updateVehicle(id: string, input: Partial<VehicleInput>) {
  const data = vehicleSchema.partial().parse(input);

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data,
  });

  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
  return vehicle;
}

export async function deleteVehicle(id: string) {
  await prisma.vehicle.delete({ where: { id } });

  revalidatePath("/vehicles");
}
