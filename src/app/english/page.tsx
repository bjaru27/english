import { EnglishScreen } from "@/components/sheet-practice/EnglishScreen";

export default function EnglishPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center bg-gradient-to-b from-zinc-50 to-zinc-100/80 px-4 py-12 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-xl">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            영문보기
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            선택된 행의 B열 영어 문장
          </p>
        </header>
        <main className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-8">
          <EnglishScreen />
        </main>
      </div>
    </div>
  );
}
