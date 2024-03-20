import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  searchParams.set('key', process.env.YOUTUBE_API_KEY ?? '');
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${searchParams.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error }, { status: res.status });
  }

  return NextResponse.json({ data });
}
