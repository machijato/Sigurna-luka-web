export type AgeGroup = "<18" | "18-25" | "26+";

export interface Helpline {
  id: string;
  name: string;
  category: string;
  counties: string[];
  city: string;
  address: string;
  number: string;
  hours: string;
  web: string;
  description: string;
  services: string[];
  targetAges: AgeGroup[];
  tags: string[];
}

export const ZUPANIJE = [
  "Grad Zagreb", "Zagrebačka", "Splitsko-dalmatinska", "Primorsko-goranska", 
  "Istarska", "Osječko-baranjska", "Varaždinska", "Dubrovačko-neretvanska",
  "Zadarska", "Šibensko-kninska", "Vukovarsko-srijemska", "Sisačko-moslavačka",
  "Karlovačka", "Bjelovarsko-bilogorska", "Koprivničko-križevačka", "Ličko-senjska",
  "Virovitičko-podravska", "Požeško-slavonska", "Brodsko-posavska", "Međimurska"
];

export const HELPLINES: Helpline[] = [
  {
    id: "plavi-telefon",
    name: "Plavi telefon",
    category: "Opća pomoć",
    counties: ["Sve"],
    city: "Zagreb",
    address: "Ilica 36",
    number: "01 4833 888",
    hours: "Radnim danom 09:00 - 20:00",
    web: "https://www.plavi-telefon.hr/",
    description: "Otvorena linija pomoći za sve skupine ljudi i širok spektar životnih problema.",
    services: ["Savjetovanje", "Podrška", "Informiranje"],
    targetAges: ["<18", "18-25", "26+"],
    tags: ["djeca", "mladi", "nasilje", "škola", "obitelj", "depresija", "usamljenost"]
  },
  {
    id: "duga-zagreb",
    name: "Dom DUGA-Zagreb",
    category: "Nasilje",
    counties: ["Grad Zagreb"],
    city: "Zagreb",
    address: "Ozaljska 93",
    number: "0800 8898",
    hours: "0-24h (Smještaj)",
    web: "https://www.duga-zagreb.hr/",
    description: "Siguran smještaj i podrška za žrtve obiteljskog nasilja.",
    services: ["Smještaj", "Savjetovanje", "Pravna pomoć"],
    targetAges: ["<18", "18-25", "26+"],
    tags: ["nasilje", "zlostavljanje", "sklonište", "žene", "djeca", "sigurna kuća"]
  },
  {
    id: "tesa",
    name: "Psihološki centar TESA",
    category: "Mentalno zdravlje",
    counties: ["Sve"],
    city: "Zagreb",
    address: "Trg bana Jelačića 1",
    number: "01 4828 888",
    hours: "Radnim danom 10:00 - 22:00",
    web: "https://www.tesa.hr/",
    description: "Psihološko savjetovanje putem telefona i e-maila.",
    services: ["Savjetovanje", "Terapija"],
    targetAges: ["18-25", "26+"],
    tags: ["anksioznost", "depresija", "psiholog", "stres", "panika", "tuga"]
  }
];