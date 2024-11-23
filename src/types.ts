export interface User {
  id: string;
  email: string;
  role: 'admin' | 'agent' | 'pending';
}

export interface Client {
  id: string;
  name: string;
  birthDate: string;
  cedula: string;
  address: string;
  city: string;
  neighborhood: string;
  workAddress: string;
  workNeighborhood: string;
  workCity: string;
  workplace: string;
  workPhone: string;
  creditAmount: number;
  returnAmount: number;
  companyProfit: number;
  agentProfit: number;
  createdAt: Date;
  createdBy: string;
}