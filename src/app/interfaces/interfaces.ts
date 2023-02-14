export interface ISpecialist {
  name: string;
  email: string;
  phone: string;
  city: string;
  canMove: boolean;
  degree: string;
  skill: string;
  interests: string[];
  available_from: string;
  notice: number;
  latitude: number;
  longitude: number;
}

export interface IClient {
  name: string;
  city: string;
  logo?: string;
  website: string;
  remoteOption: boolean;
  lookFor: string[];
  level: string[];
  available_from: string;
  notice: number;
  latitude: number;
  longitude: number;
}

export interface ISFilter {
  name: string | null;
  city: string | null;
  canMove: boolean | null;
  degree: string[] | null;
  skill: string[] | null;
  interests: string[] | null;
  available_from: string[] | null;
  notice: number | null;
}

export interface ICFilter {
  name: string;
}

export interface ICities {
  'Codice Regione': number;
  'Codice Città Metropolitana': number;
  'Codice Provincia (1)': number;
  'Progressivo del Comune (2)': number;
  'Codice Comune formato alfanumerico': number;
  'Denominazione in italiano': string;
  'Denominazione in tedesco': string;
  'Codice Ripartizione Geografica': number;
  'Ripartizione geografica': string;
  'Denominazione regione': string;
  'Denominazione Città metropolitana': string;
  'Denominazione provincia': string;
  'Flag Comune capoluogo di provincia': number;
  'Sigla automobilistica': string;
  'Codice Comune formato numerico': number;
  'Codice Comune numerico con 107 province (dal 2006 al 2009)': number;
  'Codice Comune numerico con 103 province (dal 1995 al 2005)': number;
  'Codice Catastale del comune': string;
  'Popolazione legale 2011 (09/10/2011)': number;
  'Codice NUTS1 2010': string;
  'Codice NUTS2 2010 (3)': string;
  'Codice NUTS3 2010': string;
  'Codice NUTS1 2006': string;
  'Codice NUTS2 2006 (3)': string;
  'Codice NUTS3 2006': string;
}

export interface ICity {
  name: string;
  region: string;
  country: string;
}
