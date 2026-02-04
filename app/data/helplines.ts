import { Helpline, CategoryType, AgeGroup } from '../types';

const ALL_AGES: AgeGroup[] = ['<18', '18-25', '26-35', '36-45', '46-65', '65+'];

export const ZUPANIJE = [
  "Bjelovarsko-bilogorska", "Brodsko-posavska", "Dubrovačko-neretvanska", "Istarska", 
  "Karlovačka", "Koprivničko-križevačka", "Krapinsko-zagorska", "Ličko-senjska", 
  "Međimurska", "Osječko-baranjska", "Požeško-slavonska", "Primorsko-goranska", 
  "Sisačko-moslavačka", "Splitsko-dalmatinska", "Varaždinska", "Virovitičko-podravska", 
  "Vukovarsko-srijemska", "Zadarska", "Šibensko-kninska", "Zagrebačka", "Grad Zagreb"
];

export const HELPLINES: Helpline[] = [
  {
    id: '1',
    name: 'Hrabri telefon',
    number: '116 111',
    category: CategoryType.CHILDREN,
    description: 'Savjetodavna linija za djecu i mlade dostupna u bilo koje vrijeme.',
    hours: '24/7',
    counties: ["Sve"],
    targetAges: ['<18', '18-25']
  },
  {
    id: '2',
    name: 'Plavi telefon',
    number: '01 4833 888',
    category: CategoryType.MENTAL_HEALTH,
    description: 'Linija za pomoć djeci, mladima i odraslima u krizi.',
    hours: 'Pon-Pet 09:00 - 20:00',
    counties: ["Sve"],
    targetAges: ALL_AGES
  },
  {
    id: '3',
    name: 'Autonomna ženska kuća',
    number: '0800 55 44',
    category: CategoryType.VIOLENCE,
    description: 'Savjetovanje i podrška za žene žrtve nasilja.',
    hours: '24/7',
    counties: ["Sve"],
    targetAges: ['18-25', '26-35', '36-45', '46-65', '65+']
  },
  {
    id: '4',
    name: 'TESA - Psiho-pomoć',
    number: '01 4828 888',
    category: CategoryType.MENTAL_HEALTH,
    description: 'Telefonsko psihološko savjetovalište za sve generacije.',
    hours: 'Svaki dan 10:00 - 22:00',
    counties: ["Sve"],
    targetAges: ALL_AGES
  },
  {
    id: '5',
    name: 'Hitna pomoć',
    number: '194',
    category: CategoryType.EMERGENCY,
    description: 'Hitne medicinske intervencije u životno ugrožavajućim stanjima.',
    hours: '24/7',
    counties: ["Sve"],
    targetAges: ALL_AGES
  },
  {
    id: '6',
    name: 'Centar za ženska prava',
    number: '0800 200 008',
    category: CategoryType.LEGAL,
    description: 'Besplatna pravna pomoć i savjetovanje za žene žrtve nasilja.',
    hours: 'Pon-Pet 08:00 - 16:00',
    counties: ["Sve"],
    targetAges: ['18-25', '26-35', '36-45', '46-65', '65+']
  },
  {
    id: '7',
    name: 'Zajedno protiv ovisnosti',
    number: '0800 200 005',
    category: CategoryType.ADDICTION,
    description: 'Pomoć osobama s problemima ovisnosti i njihovim obiteljima.',
    hours: '24/7',
    counties: ["Sve"],
    targetAges: ALL_AGES
  },
  {
    id: '8',
    name: 'Savjetovalište Luka Ritz',
    number: '01 645 4000',
    category: CategoryType.VIOLENCE,
    description: 'Centar za pružanje pomoći djeci i mladima, žrtvama vršnjačkog nasilja.',
    hours: 'Radnim danom 08:00 - 20:00',
    counties: ["Sve"],
    targetAges: ['<18', '18-25']
  }
];