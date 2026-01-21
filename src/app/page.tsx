'use client';

import { useState } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import MagazineView from '@/components/MagazineView';
import { InteriorAnalysis } from '@/types/analysis';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InteriorAnalysis | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleImageSelect = async (base64: string) => {
    setImageUrl(base64);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '분석에 실패했습니다');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setImageUrl('');
    setError('');
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleReset}
          >
            <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--primary)]">SPACE STYLE</span>
          </div>

          {analysis && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[var(--primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              새로운 분석
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!analysis ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">
                AI가 분석하는<br />
                <span className="text-[var(--accent)]">인테리어 스타일 매거진</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                공간 사진을 업로드하면 AI가 인테리어 사조, 디자인 요소, 컬러 팔레트를
                분석하여 전문 매거진 형태로 보여드립니다.
              </p>
            </section>

            {/* Uploader */}
            <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-red-600">{error}</p>
                <p className="text-sm text-red-400 mt-1">
                  ANTHROPIC_API_KEY 환경 변수를 확인해주세요.
                </p>
              </div>
            )}

            {/* Features */}
            <section className="mt-16 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: '스타일 분석',
                  description: '미드센추리 모던, 스칸디나비안 등 12가지 이상의 인테리어 사조 분석',
                  icon: '🎨',
                },
                {
                  title: '컬러 팔레트',
                  description: '공간의 메인/서브/포인트 컬러를 자동 추출하고 분석',
                  icon: '🌈',
                },
                {
                  title: '스타일링 팁',
                  description: '현재 공간을 더 완성도 있게 만들기 위한 맞춤 제안',
                  icon: '💡',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </section>
          </>
        ) : (
          <MagazineView analysis={analysis} imageUrl={imageUrl} />
        )}
      </div>
    </main>
  );
}
