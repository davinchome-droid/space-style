export interface StyleInfo {
  name: string;
  percentage: number;
  description: string;
  elementsInPhoto: string[];
}

export interface StyleMix {
  mainStyle: StyleInfo;
  subStyle: StyleInfo | null;
  mixAnalysis: string;
}

export interface ColorItem {
  color: string;
  name: string;
  role: string;
  percentage: number;
}

export interface ColorAnalysis {
  palette: ColorItem[];
  harmony: string;
  mood: string;
  tip: string;
}

export interface MismatchPoint {
  hasMismatch: boolean;
  description: string;
  effect: string;
  elements: string[];
}

export interface DesignElement {
  category: string;
  items: string[];
  styleContribution: string;
}

export interface StyleHistory {
  origin: string;
  era: string;
  whyPopular: string;
  funFact: string;
}

export interface StylingTip {
  tip: string;
  reason: string;
  difficulty: string;
}

export interface InteriorAnalysis {
  styleName: string;
  styleNameKorean: string;
  confidence: number;
  spaceType: string;
  mood: string[];
  summary: string;
  styleMix: StyleMix;
  colorAnalysis: ColorAnalysis;
  mismatchPoint: MismatchPoint;
  designElements: DesignElement[];
  styleHistory: StyleHistory;
  stylingTips: StylingTip[];
}

export interface ReferenceImage {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  credit: {
    name: string;
    link: string;
  };
}
