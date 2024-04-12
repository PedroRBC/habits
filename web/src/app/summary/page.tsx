import { type Summary, SummaryTable } from "@/components/summary-table";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { CreateHabit } from "@/components/create-habit";

export const metadata: Metadata = {
  title: "Summary",
};
const fetchSummary = async () => {
  const token = getCookie("token", { cookies });
  if (!token) return [];
  const url =
    process.env.NODE_ENV === "production"
      ? "https://habits.pedrorbc.com"
      : "http://localhost:3000";
  const res = await fetch(url + "/api/habits/summary", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.toString()}`,
    },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json() as Promise<Summary>;
};
export default async function Home() {
  const summary = await fetchSummary();
  return (
    <main className="container flex-1 flex items-center justify-center">
      <section className="flex flex-col gap-4">
        <div className="flex justify-center">
          <CreateHabit />
        </div>
        <SummaryTable summary={summary} />
      </section>
    </main>
  );
}
