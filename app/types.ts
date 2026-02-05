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
  number: string;
  category: CategoryType;
  description: string;
  hours: string;
  counties: string[];
  targetAges: string[];
}

export interface AIAnalysisResponse {
  priorityNumbers: string[];
  exercise: string;
  empatheticMessage: string;
}