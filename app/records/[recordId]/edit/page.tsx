import Link from "next/link";
import { getMaintenanceRecordById, getMaintenanceCategories } from "@/lib/actions/maintenance-records";
import EditMaintenanceRecordForm from "./edit-maintenance-record-form";

export async function generateMetadata({ params }: { params: Promise<{ recordId: string }> }) {
  const { recordId } = await params;
  const record = await getMaintenanceRecordById(recordId);
  return { title: `Edit ${record.category?.name ?? record.title ?? "Record"}` };
}

const EditMaintenanceRecordPage = async ({ params }: { params: Promise<{ recordId: string }> }) => {
  const { recordId } = await params;

  const [record, categories] = await Promise.all([getMaintenanceRecordById(recordId), getMaintenanceCategories()]);

  return (
    <main className='mx-auto max-w-xl px-6 py-12'>
      <Link href={`/vehicles/${record.vehicleId}`} className='text-sm text-neutral-500 hover:text-neutral-800'>
        ← Back to {record.vehicle.nickname}
      </Link>

      <div className='mt-4 mb-8 border-b border-neutral-200 pb-6'>
        <p className='font-mono text-xs uppercase tracking-widest text-amber-700'>Edit record</p>
        <h1 className='mt-1 text-3xl font-semibold text-neutral-900'>
          {record.category?.name ?? record.title ?? "Maintenance"}
        </h1>
      </div>

      <EditMaintenanceRecordForm record={record} categories={categories} />
    </main>
  );
};

export default EditMaintenanceRecordPage;
