import Link from "next/link";
import { getVehicleById } from "@/lib/actions/vehicles";
import EditVehicleForm from "./edit-vehicle-form";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  return { title: `Edit ${vehicle.nickname}` };
}

const EditVehiclePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  return (
    <main className='mx-auto max-w-xl px-6 py-12'>
      <Link href={`/vehicles/${id}`} className='text-sm text-neutral-500 hover:text-neutral-800'>
        ← Back to {vehicle.nickname}
      </Link>

      <div className='mt-4 mb-8 border-b border-neutral-200 pb-6'>
        <p className='font-mono text-xs uppercase tracking-widest text-amber-700'>Garage</p>
        <h1 className='mt-1 text-3xl font-semibold text-neutral-900'>Edit {vehicle.nickname}</h1>
      </div>

      <EditVehicleForm vehicle={vehicle} />
    </main>
  );
};

export default EditVehiclePage;
