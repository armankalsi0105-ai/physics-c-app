import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) {
    return NextResponse.json({ available: false, reason: 'missing_url' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) {
      return NextResponse.json({ available: false })
    }
    const data = (await res.json()) as { title?: string }
    return NextResponse.json({ available: true, title: data.title ?? null })
  } catch {
    return NextResponse.json({ available: false })
  }
}
