import { PracticeHome } from "@/components/sheet-practice/PracticeHome";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center bg-gradient-to-b from-zinc-50 to-zinc-100/80 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-xl">
        <main className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-8">
          <PracticeHome />
        </main>
      </div>
    </div>
  );
}
