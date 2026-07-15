"use client";

import { useActionState } from "react";
import { createMaintenanceRecord, type CreateMaintenanceRecordState } from "@/lib/actions/maintenance-records";

const initialState: CreateMaintenanceRecordState = null;

type Category = {
  id: string;
  name: string;
};

const MaintenanceRecordForm = ({ vehicleId, categories }: { vehicleId: string; categories: Category[] }) => {
  const createMaintenanceRecordForVehicle = createMaintenanceRecord.bind(null, vehicleId);
  const [state, formAction, isPending] = useActionState(createMaintenanceRecordForVehicle, initialState);

  return (
    <form action={formAction} className='space-y-5'>
      <div>
        <label htmlFor='categoryId' className='block text-sm font-medium text-neutral-700'>
          Category
        </label>
        <select
          name='categoryId'
          id='categoryId'
          className='mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm'
          defaultValue=''
        >
          <option value=''>— None / other —</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {state?.errors?.categoryId?.map((error) => (
          <p key={error} className='mt-1 text-sm text-red-600'>
            {error}
          </p>
        ))}
      </div>

      <Field label='Title (required if no category)' name='title' errors={state?.errors?.title} />

      <div className='grid grid-cols-2 gap-4'>
        <Field label='Date performed' name='datePerformed' type='date' errors={state?.errors?.datePerformed} />
        <Field
          label='Mileage at service (optional)'
          name='mileageAtService'
          type='date'
          errors={state?.errors?.mileageAtService}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Field label='Cost (optional)' name='cost' type='number' errors={state?.errors?.cost} />
        <div>
          <label htmlFor='performedBy' className='block text-sm font-medium text-neutral-700'>
            Performed by
          </label>
          <select
            name='performedBy'
            id='performedBy'
            className='mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm'
            defaultValue='SELF'
          >
            <option value='SELF'>Self</option>
            <option value='SHOP'>Shop</option>
          </select>
        </div>
      </div>

      <Field label='Shop name (optional)' name='shopName' errors={state?.errors?.shopName} />

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

      <div className='grid grid-cols-2 gap-4 border-t border-neutral-200 pt-5'>
        <Field
          label='Next due mileage (optional)'
          name='nextDueMileage'
          type='number'
          errors={state?.errors?.nextDueMileage}
        />
        <Field label='Next due date (optional)' name='nextDueDate' type='number' errors={state?.errors?.nextDueDate} />
      </div>

      {state?.message && <p className='text-sm text-red-600'>{state.message}</p>}

      <button
        type='submit'
        disabled={isPending}
        className='rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opactiy-50'
      >
        {isPending ? "Saving..." : "Log maintenance"}
      </button>
    </form>
  );
};

export default MaintenanceRecordForm;

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
