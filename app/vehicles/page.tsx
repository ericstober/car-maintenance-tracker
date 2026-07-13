import Link from "next/link";
import { getVehicles } from "@/lib/actions/vehicles";

const VehiclesPage = async () => {
  const vehicles = await getVehicles();

  return (
    <main className='mx-auto max-w-3xl px-6 py-12'>
      <div className='mb-10 flex items-baseline justify-between border-b border-neutral-200 pb-6'>
        <div>
          <p className='font-mono text-xs uppercase tracking-widest text-amber-700'>Garage</p>
          <h1 className='mt-1 text-3xl font-semibold text-neutral-900'>Your Vehicles</h1>
        </div>
        <Link
          href='/vehicles/new'
          className='rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700'
        >
          Add Vehicle
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <div className='rounded-lg border border-dashed border-neutral-300 px-6 py-16 text-center'>
          <p className='text-neutral-600'>No vehicles yet.</p>
          <p className='mt-1 text-sm text-neutral-500'>Add your vehicle to start logging maintenance.</p>
          <Link
            href='/vehicles/new'
            className='mt-6 inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700'
          >
            Add vehicle
          </Link>
        </div>
      ) : (
        <ul className='divide-y divide-neutral-200 border-t border-neutral-200'>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <Link
                href={`/vehicles/${vehicle.id}`}
                className='flex items-center justify-between py-5 hover:bg-neutral-50'
              >
                <div>
                  <p className='font-medium text-neutral-900'>{vehicle.nickname}</p>
                  <p className='text-sm text-neutral-500'>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                </div>
                <p className='font-mono text-sm text-neutral-500'>
                  {vehicle.currentMileage != null ? `${vehicle.currentMileage.toLocaleString()} mi` : "-"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default VehiclesPage;
