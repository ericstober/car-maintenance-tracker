import VehicleForm from "./vehicle-form";

const NewVehiclePage = () => {
  return (
    <main className='mx-auto max-w-xl px-6 py-12'>
      <div className='mb-8 border-b border-neutral-200 pb-6'>
        <p className='font-mono text-xs uppercase tracking-widest text-amber-700'>Garage</p>
        <h1 className='mt-1 text-3xl font-semibold text-neutral-900'>Add a vehicle</h1>
      </div>
      <VehicleForm />
    </main>
  );
};

export default NewVehiclePage;
