import { NextRequest, NextResponse } from 'next/server';

const styleSearchTerms: Record<string, string> = {
  '미드센추리 모던': 'mid century modern interior',
  'Mid-Century Modern': 'mid century modern interior',
  '스칸디나비안': 'scandinavian interior design',
  'Scandinavian': 'scandinavian interior design',
  '인더스트리얼': 'industrial loft interior',
  'Industrial': 'industrial loft interior',
  '미니멀리즘': 'minimalist interior design',
  'Minimalism': 'minimalist interior design',
  '보헤미안': 'bohemian interior decor',
  'Bohemian': 'bohemian interior decor',
  '내추럴': 'natural interior design',
  'Natural': 'natural interior design',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get('style');
    if (!style) return NextResponse.json({ images: [] });

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) return NextResponse.json({ images: [] });

    const searchQuery = styleSearchTerms[style] || `${style} interior design`;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=4&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );

    if (!response.ok) return NextResponse.json({ images: [] });

    const data = await response.json();
    const images = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      alt: photo.alt_description || `${style} interior`,
      credit: { name: photo.user.name, link: photo.user.links.html },
    }));

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ images: [] });
  }
}
