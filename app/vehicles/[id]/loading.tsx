const Loading = () => {
  return (
    <main className='mx-auto max-w-3xl px-6 py-12'>
      <div className='h-4 w-24 animate-pulse rounded bg-neutral-100' />

      <div className='mt-4 mb-10 space-y-2 border-b border-neutral-200 pb-6'>
        <div className='h-3 w-40 animate-pulse rounded bg-neutral-200' />
        <div className='h-8 w-56 animate-pulse rounded bg-neutral-200' />
        <div className='h-4 w-32 animate-pulse rounded bg-neutral-100' />
      </div>

      <div className='mb-12 space-y-4'>
        <div className='h-5 w-40 animate-pulse rounded bg-neutral-200' />
        <div className='h-40 animate-pulse rounded-md bg-neutral-100' />
      </div>

      <div className='space-y-4'>
        <div className='h-5 w-48 animate-pulse rounded bg-neutral-200' />
        <div className='h-24 animate-pulse rounded-md bg-neutral-100' />
      </div>
    </main>
  );
};

export default Loading;
