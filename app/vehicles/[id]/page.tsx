import Link from "next/link";
import { getVehicleById } from "@/lib/actions/vehicles";
import { getMaintenanceCategories } from "@/lib/actions/maintenance-records";
import MaintenanceRecordForm from "./maintenance-record-form";

const VehicleDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [vehicle, categories] = await Promise.all([getVehicleById(id), getMaintenanceCategories()]);

  return (
    <main className='mx-auto max-w-3xl px-6 py-12'>
      <Link href='/vehicles' className='text-sm text-neutral-500 hover:text-neutral-800'>
        ← Back to garage
      </Link>

      <div className='mt-4 mb-10 border-b border-neutral-200 pb-6'>
        <p className='font-mono text-xs uppercase tracking-widest text-amber-700'>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </p>
        <h1 className='mt-1 text-3xl font-semibold text-neutral-900'>{vehicle.nickname}</h1>
        <p className='mt-2 font-mono text-sm text-neutral-500'>
          {vehicle.currentMileage != null ? `${vehicle.currentMileage.toLocaleString()} mi` : "Mileage not set"}
          {vehicle.vin && ` · VIN ${vehicle.vin}`}
        </p>
        {vehicle.notes && <p className='mt-3 text-sm text-neutral-600'>{vehicle.notes}</p>}
      </div>

      <section className='mb-12'>
        <h2 className='mb-4 text-lg font-semibold text-neutral-900'>Log maintenance</h2>
        <MaintenanceRecordForm vehicleId={vehicle.id} categories={categories} />
      </section>

      <section>
        <h2 className='mb-4 text-lg font-semibold text-neutral-900'>Maintenance history</h2>

        {vehicle.maintenanceRecords.length === 0 ? (
          <p className='text-sm text-neutral-500'>No maintenance logged yet.</p>
        ) : (
          <ul className='divide-y divide-neutral-200 border-t border-neutral-200'>
            {vehicle.maintenanceRecords.map((record) => (
              <li key={record.id} className='py-4'>
                <div className='flex items-baseline justify-between'>
                  <p className='font-medium text-neutral-900'>
                    {record.category?.name ?? record.title ?? "Maintenance"}
                  </p>
                  <p className='font-mono text-sm text-neutral-500'>
                    {new Date(record.datePerformed).toLocaleDateString()}
                  </p>
                </div>
                <p className='text-sm text-neutral-500'>
                  {record.mileageAtService != null ? `${record.mileageAtService.toLocaleString()} mi` : ""}
                  {record.performedBy === "SHOP" && record.shopName
                    ? record.shopName
                    : record.performedBy === "SHOP"
                      ? "Shop"
                      : "Self"}
                  {record.cost != null ? ` · $${record.cost.toString()}` : ""}
                </p>
                {record.notes && <p className='mt-1 text-sm text-neutral-600'>{record.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default VehicleDetailsPage;
