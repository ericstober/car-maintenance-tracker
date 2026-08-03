const Loading = () => {
  return (
    <main className='mx-auto max-w-3xl px-6 py-12'>
      <div className='mb-10 flex items-baseline justify-between border-b border-neutral-200 pb-6'>
        <div className='space-y-2'>
          <div className='h-3 w-16 animate-pulse rounded bg-neutral-200' />
          <div className='h-8 w-48 animate-pulse rounded bg-neutral-200' />
        </div>
        <div className='h-9 w-28 animate-pulse rounded-md bg-neutral-200' />
      </div>

      <div className='divide-y divide-neutral-200 border-t border-neutral-200'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='flex items-center justify-between py-5'>
            <div className='space-y-2'>
              <div className='h-4 w-32 animate-pulse rounded bg-neutral-200' />
              <div className='h-3 w-40 animate-pulse rounded bg-neutral-100' />
            </div>
            <div className='h-4 w-16 animate-pulse rounded bg-neutral-100' />
          </div>
        ))}
      </div>
    </main>
  );
};

export default Loading;
