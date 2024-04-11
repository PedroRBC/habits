import { SummaryTable } from "@/components/summary-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summary",
};

export default function Home() {
  return (
    <main className="container flex-1 flex items-center">
      <section className="my-10 flex flex-1 flex-col lg:flex-row items-center justify-between gap-8">
        <SummaryTable />
      </section>
    </main>
  );
}
