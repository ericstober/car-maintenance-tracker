const Loading = () => {
  return (
    <main className='mx-auto max-w-3xl px-6 py-12'>
      <div className='h-4 w-24 animate-pulse rounded bg-neutral-100' />

      <div className='mt-4 mb-10 space-y-2 border-b border-neutral-200 pb-6'>
        <div className='h-3 w-24 animate-pulse rounded bg-neutral-200' />
        <div className='h-8 w-64 animate-pulse rounded bg-neutral-200' />
      </div>

      <div className='space-y-3'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-16 animate-pulse rounded-lg bg-neutral-100' />
        ))}
      </div>
    </main>
  );
};

export default Loading;
