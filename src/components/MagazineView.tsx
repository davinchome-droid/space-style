'use client';

import { InteriorAnalysis, ReferenceImage } from '@/types/analysis';
import { Palette, Layers, BookOpen, Lightbulb, Sparkles, Blend, Shuffle, Images, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MagazineViewProps {
  analysis: InteriorAnalysis;
  imageUrl: string;
}

export default function MagazineView({ analysis, imageUrl }: MagazineViewProps) {
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const fetchReferenceImages = async () => {
      try {
        const response = await fetch(`/api/images?style=${encodeURIComponent(analysis.styleName)}`);
        const data = await response.json();
        setReferenceImages(data.images || []);
      } catch (error) {
        console.error('Failed to fetch reference images:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchReferenceImages();
  }, [analysis.styleName]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Cover Section */}
      <section className="relative h-[70vh] min-h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <img
          src={imageUrl}
          alt="공간 이미지"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-[var(--accent)] text-white text-sm font-medium rounded-full">
              {analysis.spaceType}
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
              신뢰도 {Math.round(analysis.confidence * 100)}%
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            {analysis.styleNameKorean}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light">
            {analysis.styleName}
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            {analysis.mood.map((m, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 text-white rounded-full backdrop-blur-sm text-sm">
                #{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn">
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium text-center">
          &quot;{analysis.summary}&quot;
        </p>
      </section>

      {/* Reference Images */}
      {(loadingImages || referenceImages.length > 0) && (
        <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <Images className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--primary)]">
              {analysis.styleNameKorean} 스타일 레퍼런스
            </h2>
          </div>

          {loadingImages ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {referenceImages.map((img) => (
                <a
                  key={img.id}
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden"
                >
                  <img
                    src={img.thumb}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 text-center">Photos by Unsplash</p>
        </section>
      )}

      {/* Style Mix Analysis */}
      <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center">
            <Blend className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--primary)]">스타일 믹스 분석</h2>
        </div>

        <div className="mb-6">
          <div className="flex h-4 rounded-full overflow-hidden mb-3">
            <div
              className="bg-[var(--primary)]"
              style={{ width: `${analysis.styleMix.mainStyle.percentage}%` }}
            />
            {analysis.styleMix.subStyle && (
              <div
                className="bg-[var(--accent)]"
                style={{ width: `${analysis.styleMix.subStyle.percentage}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--primary)] font-medium">
              {analysis.styleMix.mainStyle.name} {analysis.styleMix.mainStyle.percentage}%
            </span>
            {analysis.styleMix.subStyle && (
              <span className="text-[var(--accent)] font-medium">
                {analysis.styleMix.subStyle.name} {analysis.styleMix.subStyle.percentage}%
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-4">
          <h3 className="font-bold text-[var(--primary)] text-lg mb-2">
            메인 스타일: {analysis.styleMix.mainStyle.name}
          </h3>
          <p className="text-gray-700 mb-3">{analysis.styleMix.mainStyle.description}</p>
          <div className="flex flex-wrap gap-2">
            {analysis.styleMix.mainStyle.elementsInPhoto.map((elem, i) => (
              <span key={i} className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm">
                {elem}
              </span>
            ))}
          </div>
        </div>

        {analysis.styleMix.subStyle && analysis.styleMix.subStyle.name && (
          <div className="bg-orange-50 rounded-xl p-5 mb-4">
            <h3 className="font-bold text-[var(--accent)] text-lg mb-2">
              서브 스타일: {analysis.styleMix.subStyle.name}
            </h3>
            <p className="text-gray-700 mb-3">{analysis.styleMix.subStyle.description}</p>
            <div className="flex flex-wrap gap-2">
              {analysis.styleMix.subStyle.elementsInPhoto.map((elem, i) => (
                <span key={i} className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm">
                  {elem}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 rounded-xl">
          <p className="text-gray-700 leading-relaxed">{analysis.styleMix.mixAnalysis}</p>
        </div>
      </section>

      {/* Color Analysis */}
      <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full magazine-gradient flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--primary)]">컬러 매칭 분석</h2>
        </div>

        <div className="flex gap-2 mb-6">
          {analysis.colorAnalysis.palette.map((item, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-24 rounded-xl shadow-inner mb-2"
                style={{ backgroundColor: item.color }}
              />
              <p className="text-sm font-medium text-gray-700 text-center">{item.name}</p>
              <p className="text-xs text-gray-400 text-center">{item.role} · {item.percentage}%</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-[var(--primary)] mb-2">컬러 조화</h4>
            <p className="text-gray-700">{analysis.colorAnalysis.harmony}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-[var(--primary)] mb-2">이 컬러가 주는 느낌</h4>
            <p className="text-gray-700">{analysis.colorAnalysis.mood}</p>
          </div>
          <div className="p-4 bg-[var(--accent)]/10 rounded-xl">
            <h4 className="font-semibold text-[var(--accent)] mb-2">따라하기 팁</h4>
            <p className="text-gray-700">{analysis.colorAnalysis.tip}</p>
          </div>
        </div>
      </section>

      {/* Mismatch Point */}
      {analysis.mismatchPoint.hasMismatch && (
        <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--primary)]">미스매치 포인트</h2>
          </div>

          <div className="bg-purple-50 rounded-xl p-5">
            <p className="text-gray-700 mb-4">{analysis.mismatchPoint.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {analysis.mismatchPoint.elements.map((elem, i) => (
                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {elem}
                </span>
              ))}
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-purple-700 font-medium">효과: {analysis.mismatchPoint.effect}</p>
            </div>
          </div>
        </section>
      )}

      {/* Design Elements */}
      <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--primary)]">디자인 요소</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {analysis.designElements.map((element, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-[var(--primary)] mb-2">{element.category}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {element.items.map((item, j) => (
                  <span key={j} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">{element.styleContribution}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Style History */}
      <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--primary)]">스타일 이야기</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">어디서 시작됐나요?</p>
            <p className="font-semibold text-lg">{analysis.styleHistory.origin}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">언제 유행했나요?</p>
            <p className="font-semibold text-lg">{analysis.styleHistory.era}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-[var(--primary)] mb-2">왜 지금도 사랄받나요?</h4>
            <p className="text-gray-700">{analysis.styleHistory.whyPopular}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl">
            <h4 className="font-semibold text-yellow-700 mb-2">재미있는 사실!</h4>
            <p className="text-gray-700">{analysis.styleHistory.funFact}</p>
          </div>
        </div>
      </section>

      {/* Styling Tips */}
      <section className="bg-white rounded-2xl p-8 mb-6 shadow-sm animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--primary)]">스타일링 팁</h2>
        </div>

        <div className="space-y-4">
          {analysis.stylingTips.map((tip, i) => (
            <div key={i} className="flex gap-4 p-4 bg-emerald-50 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[var(--primary)]">{tip.tip}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    tip.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
                    tip.difficulty === '보통' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {tip.difficulty}
                  </span>
                </div>
                <p className="text-gray-700">{tip.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">SPACE STYLE</span>
        </div>
        <p className="text-sm">AI 인테리어 스타일 분석 매거진</p>
      </footer>
    </div>
  );
}
