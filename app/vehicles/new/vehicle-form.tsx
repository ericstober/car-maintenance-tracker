"use client";

import { useActionState } from "react";
import { createVehicle, type CreateVehicleState } from "@/lib/actions/vehicles";

const initialState: CreateVehicleState = null;

const VehicleForm = () => {
  const [state, formAction, isPending] = useActionState(createVehicle, initialState);

  return (
    <form action={formAction} className='space-y-5'>
      <Field label='Nickname' name='nickname' errors={state?.errors?.nickname} />

      <div className='grid grid-cols-3 gap-4'>
        <Field label='Year' name='year' type='number' errors={state?.errors?.year} />
        <Field label='Make' name='make' errors={state?.errors?.make} />
        <Field label='Model' name='model' errors={state?.errors?.model} />
      </div>

      <Field label='VIN (optional)' name='vin' errors={state?.errors?.vin} />
      <Field
        label='Current mileage (optional)'
        name='currentMileage'
        type='number'
        errors={state?.errors?.currentMileage}
      />
      <Field label='Purchase date (optional)' name='purchaseDate' type='number' errors={state?.errors?.purchaseDate} />

      <div>
        <label htmlFor='notes' className='block text-sm font-medium text-neutral-700'>
          Notes (optional)
        </label>
        <textarea
          name='notes'
          id='notes'
          rows={3}
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
        {isPending ? "Saving..." : "Save vehicle"}
      </button>
    </form>
  );
};

export default VehicleForm;

function Field({
  label,
  name,
  type = "text",
  errors,
}: {
  label: string;
  name: string;
  type?: string;
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
