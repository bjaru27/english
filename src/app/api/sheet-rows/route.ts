import { parse } from "csv-parse/sync";
import { NextResponse } from "next/server";
import { SHEET_EXPORT_URL } from "@/lib/sheet-practice";

export const dynamic = "force-dynamic";

export async function GET() {
  let res: Response;
  try {
    res = await fetch(SHEET_EXPORT_URL);
  } catch {
    return NextResponse.json(
      { error: "시트 요청 실패 — 네트워크 확인" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `시트 응답 오류 (${res.status}). 공유 권한(링크로 보기 허용)을 확인해 주세요.` },
      { status: 502 },
    );
  }

  const text = await res.text();

  let rowsRaw: string[][];
  try {
    rowsRaw = parse(text, {
      columns: false,
      skip_empty_lines: false,
      relax_column_count: true,
      relax_quotes: true,
      bom: true,
    }) as string[][];
  } catch {
    return NextResponse.json({ error: "CSV 파싱 실패" }, { status: 500 });
  }

  if (!rowsRaw.length) {
    return NextResponse.json({ rows: [] as { b: string; c: string; d: string }[] });
  }

  const dataRows = rowsRaw.slice(1);
  const rows = dataRows
    .map((cells) => {
      const b = (cells[1] ?? "").trim();
      const c = (cells[2] ?? "").trim();
      const d = (cells[3] ?? "").trim();
      return { b, c, d };
    })
    .filter((r) => r.b.length > 0 || r.c.length > 0 || r.d.length > 0);

  return NextResponse.json({ rows });
}
