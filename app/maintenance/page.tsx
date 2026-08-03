import type { Metadata } from "next";
import Link from "next/link";
import { getUpcomingMaintenance } from "@/lib/actions/maintenance-records";

export const metadata: Metadata = {
  title: "Upcoming Maintenance",
};

type UpcomingRecord = Awaited<ReturnType<typeof getUpcomingMaintenance>>[number];

function getStatus(record: UpcomingRecord, now: Date) {
  const dateOverdue = record.nextDueDate ? record.nextDueDate <= now : false;
  const mileageOverdue =
    record.nextDueMileage != null && record.vehicle.currentMileage != null
      ? record.vehicle.currentMileage >= record.nextDueMileage
      : false;

  return dateOverdue || mileageOverdue ? "overdue" : "upcoming";
}

const UpcomingMaintenancePage = async () => {
  const records = await getUpcomingMaintenance();
  const now = new Date();

  const overdue = records.filter((record) => getStatus(record, now) === "overdue");
  const upcoming = records.filter((record) => getStatus(record, now) === "upcoming");

  return (
    <main className='mx-auto w-2xl px-6 py-12'>
      <Link href='/vehicles' className='text-neutral-500 hover:text-neutral-800'>
        ← Back to garage
      </Link>

      <div className='mt-4 mb-10 border-b border-neutral-200 pb-6'>
        <p className='font-mono uppercase tracking-widest text-amber-700'>Dashboard</p>
        <h1 className='mt-1 text-3xl font-semibold text-neutral-900'>Upcoming maintenance</h1>
      </div>

      {records.length === 0 ? (
        <div className='rounded-lg border border-dashed border-neutral-300 px-6 py-16 text-center'>
          <p className='text-neutral-600'>Nothing on the horizon.</p>
          <p className='mt-1 text-neutral-500'>
            Set a &ldquo;next due&rdquo; date or mileage when logging maintenance to see it here.
          </p>
        </div>
      ) : (
        <div className='space-y-10'>
          {overdue.length > 0 && (
            <section>
              <h2 className='mb-4 text-lg font-semibold text-red-700'>Overdue ({overdue.length})</h2>
              <RecordList records={overdue} tone='overdue' />
            </section>
          )}

          {upcoming.length > 0 && (
            <section>
              <h2 className='mb-4 text-lg font-semibold text-neutral-900'>Upcoming ({upcoming.length})</h2>
              <RecordList records={upcoming} tone='upcoming' />
            </section>
          )}
        </div>
      )}
    </main>
  );
};

export default UpcomingMaintenancePage;

function RecordList({ records, tone }: { records: UpcomingRecord[]; tone: "overdue" | "upcoming" }) {
  return (
    <ul
      className={`divide-y rounded-lg border ${
        tone === "overdue" ? "divide-red-100 border-red-200 bg-red-50/40" : "divide-neutral-200 border-neutral-200"
      }`}
    >
      {records.map((record) => (
        <li key={record.id} className='p-4'>
          <Link href={`/vehicles/${record.vehicleId}`} className='block hover:opacity-70'>
            <div className='flex items-baseline justify-between'>
              <p className='font-medium text-neutral-900'>{record.category?.name ?? record.title ?? "Maintenance"}</p>
              <p className='text-neutral-500'>{record.vehicle.nickname}</p>
            </div>
            <p className='mt-1 font-mono text-neutral-500'>
              {record.nextDueDate && `Due ${new Date(record.nextDueDate).toLocaleDateString()}`}
              {record.nextDueDate && record.nextDueMileage != null && " · "}
              {record.nextDueMileage != null &&
                `Due at ${record.nextDueMileage.toLocaleString()} mi${
                  record.vehicle.currentMileage != null
                    ? ` (currently ${record.vehicle.currentMileage.toLocaleString()} mi)`
                    : ""
                }`}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
