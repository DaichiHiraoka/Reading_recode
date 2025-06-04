import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8080';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: Request, { params }: any) {
  const body = await req.json();
  const res = await fetch(`${BACKEND}/books/${params.id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
