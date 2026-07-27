"use client";

import { useActionState } from "react";
import { updateVehicle, type UpdateVehicleState } from "@/lib/actions/vehicles";

const initialState: UpdateVehicleState = null;

type VehicleDefaults = {
  id: string;
  nickname: string;
  year: number;
  make: string;
  model: string;
  vin: string | null;
  currentMileage: number | null;
  purchaseDate: Date | null;
  notes: string | null;
};

const EditVehicleForm = ({ vehicle }: { vehicle: VehicleDefaults }) => {
  const updateVehicleById = updateVehicle.bind(null, vehicle.id);
  const [state, formAction, isPending] = useActionState(updateVehicleById, initialState);

  const purchaseDateValue = vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toISOString().split("T")[0] : "";

  return (
    <form action={formAction} className='space-y-5'>
      <Field label='Nickname' name='nickname' defaultValue={vehicle.nickname} errors={state?.errors?.nickname} />

      <div className='grid grid-cols-3 gap-4'>
        <Field label='Year' name='year' type='number' defaultValue={vehicle.year} errors={state?.errors?.year} />
        <Field label='Make' name='make' defaultValue={vehicle.make} errors={state?.errors?.make} />
        <Field label='Model' name='model' defaultValue={vehicle.model} errors={state?.errors?.model} />
      </div>

      <Field label='Vin (optional)' name='vin' defaultValue={vehicle.vin ?? ""} errors={state?.errors?.vin} />
      <Field
        label='Current mileage (optional)'
        name='currentMileage'
        type='number'
        defaultValue={vehicle.currentMileage ?? ""}
        errors={state?.errors?.currentMileage}
      />
      <Field
        label='Purchase date (optional)'
        name='purchaseDate'
        type='date'
        defaultValue={purchaseDateValue}
        errors={state?.errors?.purchaseDate}
      />

      <div>
        <label htmlFor='notes' className='block text-sm font-medium text-neutral-700'>
          Notes (optional)
        </label>
        <textarea
          id='notes'
          name='notes'
          rows={3}
          defaultValue={vehicle.notes ?? ""}
          className='mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm'
        />
        {state?.errors?.notes?.map((error) => (
          <p key={error} className='mt-1 text-sm text-red-600'>
            {error}
          </p>
        ))}
      </div>

      {state?.message && <p className='text-sm text-red-600'>{state.message}</p>}

      <button
        type='submit'
        disabled={isPending}
        className='rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50'
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
};

export default EditVehicleForm;

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  errors?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-neutral-700'>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className='mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm'
      />
      {errors?.map((error) => (
        <p key={error} className='mt-1 text-sm text-red-600'>
          {error}
        </p>
      ))}
    </div>
  );
}
