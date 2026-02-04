export enum CategoryType {
  CHILDREN = 'Djeca i mladi',
  MENTAL_HEALTH = 'Mentalno zdravlje',
  VIOLENCE = 'Nasilje',
  EMERGENCY = 'Hitne službe',
  LEGAL = 'Pravna pomoc',
  ADDICTION = 'Ovisnosti'
}

export type AgeGroup = '<18' | '18-25' | '26-35' | '36-45' | '46-65' | '65+';

export interface Helpline {
  id: string;
  name: string;
  number: string;
  category: CategoryType;
  description: string;
  hours: string;
  counties: string[];
  targetAges: AgeGroup[];
}

export interface AIAnalysisResponse {
  priorityNumbers: string[];
  exercise: string;
  empatheticMessage: string;
}
