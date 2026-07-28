"use client";

import { useActionState } from "react";
import { updateMaintenanceRecord, type UpdateMaintenanceRecordState } from "@/lib/actions/maintenance-records";

const initialState: UpdateMaintenanceRecordState = null;

type Category = {
  id: string;
  name: string;
};

type RecordDefaults = {
  id: string;
  vehicleId: string;
  categoryId: string | null;
  title: string | null;
  datePerformed: Date;
  mileageAtService: number | null;
  cost: unknown; // Prisma Decimal - read via .toString() below, never used as a number directly
  performedBy: "SELF" | "SHOP";
  shopName: string | null;
  notes: string | null;
  nextDueMileage: number | null;
  nextDueDate: Date | null;
};

const EditMaintenanceRecordForm = ({ record, categories }: { record: RecordDefaults; categories: Category[] }) => {
  const updateThisRecord = updateMaintenanceRecord.bind(null, record.id, record.vehicleId);
  const [state, formAction, isPending] = useActionState(updateThisRecord, initialState);

  const datePerformedValue = new Date(record.datePerformed).toISOString().split("T")[0];
  const nextDueDateValue = record.nextDueDate ? new Date(record.nextDueDate).toISOString().split("T")[0] : "";
  const costValue = record.cost != null ? String(record.cost) : "";

  return (
    <form action={formAction} className='space-y-5'>
      <div>
        <label htmlFor='categoryId' className='block text-sm font-medium text-neutral-700'>
          Category
        </label>
        <select
          id='categoryId'
          name='categoryId'
          defaultValue={record.categoryId ?? ""}
          className='mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm'
        >
          <option value=''>- None / other -</option>
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

      <Field
        label='Title (required if no category)'
        name='title'
        defaultValue={record.title ?? ""}
        errors={state?.errors?.title}
      />

      <div className='grid grid-cols-2 gap-4'>
        <Field
          label='Date performed'
          name='datePerformed'
          type='date'
          defaultValue={datePerformedValue}
          errors={state?.errors?.datePerformed}
        />
        <Field
          label='Mileage at service (optional)'
          name='mileageAtService'
          type='number'
          defaultValue={record.mileageAtService ?? ""}
          errors={state?.errors?.mileageAtService}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Field
          label='Cost (optional)'
          name='cost'
          type='number'
          defaultValue={costValue}
          errors={state?.errors?.cost}
        />
        <div>
          <label htmlFor='performedBy' className='block text-sm font-medium text-neutral-700'>
            Performed by
          </label>
          <select
            id='performedBy'
            name='performedBy'
            defaultValue={record.performedBy}
            className='mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm'
          >
            <option value='SELF'>Self</option>
            <option value='SHOP'>Shop</option>
          </select>
        </div>
      </div>

      <Field
        label='Shop name (optional)'
        name='shopName'
        defaultValue={record.shopName ?? ""}
        errors={state?.errors?.shopName}
      />

      <div>
        <label htmlFor='notes' className='block text-sm font-medium text-neutral-700'>
          Notes (optional)
        </label>
        <textarea
          id='notes'
          name='notes'
          rows={3}
          defaultValue={record.notes ?? ""}
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
          defaultValue={record.nextDueMileage ?? ""}
          errors={state?.errors?.nextDueMileage}
        />
        <Field
          label='Next due date (optional)'
          name='nextDueDate'
          type='date'
          defaultValue={nextDueDateValue}
          errors={state?.errors?.nextDueDate}
        />
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

export default EditMaintenanceRecordForm;

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
  defaultValue: string | number;
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
