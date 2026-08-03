import Link from "next/link";

const NotFound = () => {
  return (
    <main className='mx-auto max-w-3xl px-6 py-24 text-center'>
      <p className='font-mono text-xs uppercase tracking-widest text-amber-700'>404</p>
      <h1 className='mt-2 text-2xl font-semibold text-neutral-900'>Nothing here.</h1>
      <p className='mt-2 text-sm text-neutral-500'>
        That vehicle or maintenance record doesn&rsquo;t exist — it may have been deleted.
      </p>
      <Link
        href='/vehicles'
        className='mt-6 inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700'
      >
        Back to garage
      </Link>
    </main>
  );
};

export default NotFound;
