export interface ReinforcementPack {
  id: number;
  name: string;
  description: string | null;
  priceCents: number;
  numQuestions: number;
  purchased: boolean;
  createdAt: string;
}
