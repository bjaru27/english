"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STORAGE_KEY_ENGLISH } from "@/lib/sheet-practice";

export function EnglishScreen() {
  const [text, setText] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = sessionStorage.getItem(STORAGE_KEY_ENGLISH);
      setText(v);
    } catch {
      setText(null);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
        <p className="text-sm">불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          영문
        </h2>
        <p className="min-h-[6rem] whitespace-pre-wrap text-lg leading-relaxed text-zinc-900 dark:text-zinc-100">
          {text?.trim()
            ? text
            : "영문 데이터가 없습니다. 첫 화면에서「영문보기」를 눌러 주세요."}
        </p>
      </section>

      <div className="flex justify-center">
        <Link
          href="/"
          className="inline-flex min-w-[10rem] items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
}
