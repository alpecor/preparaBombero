export interface ReinforcementPack {
  id: string;
  title: string;
  type: string;
  community: string;
  province: string | null;
  administration: string | null;
  questionCount: number;
  priceCents: number;
  bullets: string[];
}

export interface Territory {
  name: string;
  provinces: { name: string; administrations: string[] }[];
}

export interface PracticeQuestion {
  id: string;
  title: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
