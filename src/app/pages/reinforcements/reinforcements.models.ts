export interface ReinforcementPack {
  id: number;
  nombre: string;
  comunidad: string | null;
  ciudad: string | null;
  administracion: string | null;
  check1: string | null;
  check2: string | null;
  check3: string | null;
  priceCents: number;
  numQuestions: number;
  purchased: boolean;
  createdAt: string;
}
