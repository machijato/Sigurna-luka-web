export enum CategoryType {
  CHILDREN = 'Djeca i mladi',
  MENTAL_HEALTH = 'Mentalno zdravlje',
  VIOLENCE = 'Nasilje',
  PEER_VIOLENCE = 'Vršnjačko nasilje',
  FAMILY_VIOLENCE = 'Nasilje u obitelji',
  RELATIONSHIPS = 'Partnerski odnosi',
  PTSD = 'PTSP',
  ANXIETY = 'Anksioznost',
  DEPRESSION = 'Depresija',
  EMERGENCY = 'Hitne službe',
  LEGAL = 'Pravna pomoć',
  ADDICTION = 'Ovisnosti'
}

export type AgeGroup = string;

export interface Helpline {
  id: string;
  name: string;
  category: string; // Promijenjeno u string radi lakšeg nadopunjavanja
  counties: string[];
  city: string;
  address: string;
  number: string;
  hours: string;
  web: string;
  description: string;
  services: string[];
  targetAges: string[];
  tags: string[];
}

export interface AIAnalysisResponse {
  priorityNumbers: string[];
  exercise: string;
  empatheticMessage: string;
}