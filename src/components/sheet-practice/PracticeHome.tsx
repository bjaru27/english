"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  STORAGE_KEY_ENGLISH,
  STORAGE_KEY_ROW_INDEX,
} from "@/lib/sheet-practice";

type Row = { b: string; c: string; d: string };

function pickRandomIndex(length: number, avoid?: number): number {
  if (length <= 1) return 0;
  const candidates =
    avoid === undefined
      ? Array.from({ length }, (_, i) => i)
      : Array.from({ length }, (_, i) => i).filter((i) => i !== avoid);
  const pool = candidates.length ? candidates : [0];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function PracticeHome() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sheet-rows");
      const data = (await res.json()) as {
        rows?: Row[];
        error?: string;
      };
      if (!res.ok || !data.rows) {
        setError(data.error ?? "데이터를 불러오지 못했습니다.");
        setRows([]);
        return;
      }
      if (data.rows.length === 0) {
        setError("표시할 행이 없습니다.");
        setRows([]);
        return;
      }
      const len = data.rows.length;
      let initialIndex = pickRandomIndex(len);
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY_ROW_INDEX);
        const saved = raw !== null ? Number.parseInt(raw, 10) : NaN;
        if (Number.isFinite(saved) && saved >= 0 && saved < len) {
          initialIndex = saved;
        }
      } catch {
        initialIndex = pickRandomIndex(len);
      }
      setRows(data.rows);
      setIndex(initialIndex);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  useEffect(() => {
    if (!rows?.length) return;
    const safe = Math.min(Math.max(0, index), rows.length - 1);
    try {
      sessionStorage.setItem(STORAGE_KEY_ROW_INDEX, String(safe));
    } catch {
      //
    }
  }, [rows, index]);

  const current = useMemo(() => {
    if (!rows?.length) return null;
    return rows[Math.min(index, rows.length - 1)] ?? null;
  }, [rows, index]);

  const onRefresh = () => {
    if (!rows?.length) return;
    setIndex((prev) => pickRandomIndex(rows.length, prev));
  };

  const onEnglishView = () => {
    if (!current?.b) return;
    try {
      sessionStorage.setItem(STORAGE_KEY_ENGLISH, current.b);
    } catch {
      // storage full / private mode — still navigate; page may show empty
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-zinc-500">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600"
          aria-hidden
        />
        <p className="text-sm">시트에서 문장을 불러오는 중…</p>
      </div>
    );
  }

  if (error || !rows?.length || !current) {
    return (
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 p-6 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="mb-4 text-sm leading-relaxed">{error ?? "데이터가 없습니다."}</p>
        <button
          type="button"
          onClick={() => void fetchRows()}
          className="rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            구글 번역]
          </h2>
          <p className="min-h-[3rem] whitespace-pre-wrap text-lg leading-relaxed text-zinc-900 dark:text-zinc-100">
            {current.c || "(비어 있음)"}
          </p>
        </div>
        <div className="h-px w-full bg-zinc-200/80 dark:bg-zinc-800" />
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            내가 직역]
          </h2>
          <p className="min-h-[3rem] whitespace-pre-wrap text-lg leading-relaxed text-zinc-900 dark:text-zinc-100">
            {current.d || "(비어 있음)"}
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:flex-none sm:min-w-[8.5rem]"
        >
          새로고침
        </button>
        <Link
          href="/english"
          onClick={onEnglishView}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:flex-none sm:min-w-[8.5rem]"
        >
          영문보기
        </Link>
      </div>
    </div>
  );
}
