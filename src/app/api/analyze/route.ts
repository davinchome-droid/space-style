import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const ANALYSIS_PROMPT = `당신은 인테리어를 처음 접하는 사람에게 쉽고 재미있게 설명해주는 친근한 인테리어 전문가예요.

업로드된 공간 사진을 보고, 인테리어 초보자도 이해할 수 있도록 분석해주세요.
전문 용어를 쓸 때는 반드시 쉬운 설명을 덧붙여주세요.
사진에서 직접 보이는 것만 분석하고, 추측은 하지 마세요.

다음 JSON 형식으로 정확히 응답해주세요. 다른 텍스트 없이 JSON만 반환하세요:

{
  "styleName": "영문 스타일명",
  "styleNameKorean": "한글 스타일명",
  "confidence": 0.0-1.0,
  "spaceType": "거실/침실/주방/서재/오피스/카페 등",
  "mood": ["분위기 키워드 3-5개"],

  "summary": "이 공간을 한 문장으로 표현하면? (친근하고 감성적으로)",

  "styleMix": {
    "mainStyle": {
      "name": "메인 스타일 한글명",
      "percentage": 70,
      "description": "이 스타일이 뭔지 초보자도 알 수 있게 2-3문장으로 쉽게 설명",
      "elementsInPhoto": ["사진에서 이 스타일을 보여주는 요소들"]
    },
    "subStyle": {
      "name": "서브 스타일 한글명 (없으면 null)",
      "percentage": 30,
      "description": "이 스타일이 뭔지 초보자도 알 수 있게 쉽게 설명",
      "elementsInPhoto": ["사진에서 이 스타일을 보여주는 요소들"]
    },
    "mixAnalysis": "두 스타일이 어떻게 조화를 이루는지, 또는 단일 스타일이 어떻게 잘 표현됐는지 설명"
  },

  "colorAnalysis": {
    "palette": [
      {
        "color": "#HEX코드",
        "name": "색상 이름 (예: 따뜻한 베이지)",
        "role": "베이스/메인/포인트",
        "percentage": 60
      }
    ],
    "harmony": "이 색들이 어떻게 어울리는지 쉽게 설명 (예: '차분한 베이지 톤이 전체를 감싸고, 테라코타 쿠션이 포인트가 되어 지루하지 않아요')",
    "mood": "이 컬러 조합이 주는 느낌 (예: '카페에 온 것처럼 편안하고 따뜻한 느낌')",
    "tip": "이 컬러 조합을 따라하고 싶다면? (실용적인 팁)"
  },

  "mismatchPoint": {
    "hasMismatch": true/false,
    "description": "의도적으로 다른 스타일을 섞은 부분이 있다면 설명 (예: '모던한 공간에 빈티지 러그를 놓아서 개성을 더했어요')",
    "effect": "그래서 어떤 효과가 나는지 (예: '깔끔하면서도 심심하지 않은 공간이 됐어요')",
    "elements": ["미스매치 요소들"]
  },

  "designElements": [
    {
      "category": "가구/조명/패브릭/식물/소품 등",
      "items": ["보이는 요소들"],
      "styleContribution": "이 요소들이 전체 스타일에 어떻게 기여하는지"
    }
  ],

  "styleHistory": {
    "origin": "이 스타일이 어디서 시작됐는지",
    "era": "언제 유행했는지",
    "whyPopular": "왜 지금도 사랑받는지 쉽게 설명",
    "funFact": "재미있는 사실 하나 (예: '이케아가 이 스타일을 전 세계에 퍼뜨렸어요!')"
  },

  "stylingTips": [
    {
      "tip": "이 공간을 더 좋게 만들 수 있는 팁",
      "reason": "왜 이게 좋은지",
      "difficulty": "쉬움/보통/어려움"
    }
  ]
}

참고할 인테리어 스타일:
- 미드센추리 모던: 1950-60년대 스타일, 깔끔한 라인과 나무 소재
- 스칸디나비안: 북유럽 스타일, 밝고 심플하며 기능적
- 인더스트리얼: 공장/창고 느낌, 노출 벽돌과 철재
- 미니멀리즘: 최소한의 것만, 여백의 미
- 보헤미안: 자유분방, 다양한 패턴과 색상 믹스
- 재패니즈/와비사비: 일본 스타일, 자연스러움과 불완전함의 미
- 컨템포러리: 현재 트렌드를 반영한 현대적 스타일
- 모던 팜하우스: 시골집 느낌 + 모던함
- 내추럴/오가닉: 자연 소재 중심, 편안함
- 빈티지/레트로: 옛날 느낌, 중고 가구 활용`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: '이미지가 필요합니다' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const mediaType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('응답에서 텍스트를 찾을 수 없습니다');
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('응답에서 JSON을 파싱할 수 없습니다');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
