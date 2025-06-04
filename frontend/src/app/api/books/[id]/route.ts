import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8080';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, { params }: any) {
  const res = await fetch(`${BACKEND}/books/${params.id}`);
  if (!res.ok) {
    return NextResponse.json({ error: 'Not found' }, { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
