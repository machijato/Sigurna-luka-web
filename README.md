# sigurna-luka-web
# Sigurna Luka - AI platforma za pružanje pomoći

## 1. Opis projekta
"Sigurna Luka" je web aplikacija namijenjena pružanju brze, anonimne i empatične pomoći građanima u Hrvatskoj. Aplikacija služi kao inteligentni posrednik između korisnika u krizi i službi za pomoć (Hrabri telefon, Plavi telefon, hitne službe itd.).

## 2. Tech Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **AI:** Gemini 1.5 (putem Vercel AI SDK ili Google AI Studio API-ja)
- **Deployment:** Vercel

## 3. Ključne funkcionalnosti (Roadmap)

### A. Napredni sustav filtriranja (MVP Update)
Korisnik na početnoj stranici mora imati mogućnost filtriranja službi prema:
- **Dobi:** (<18, 18-65, 65+)
- **Lokaciji:** (Odabir županije u Hrvatskoj)
- **Vrsti problema:** (Mentalno zdravlje, Nasilje, Ovisnosti, Pravna pomoć, Hitna stanja)

### B. AI Triage & Support (AI Savjetnik)
Implementirati centralni boks za unos teksta gdje korisnik opisuje svoj problem.
- **Input:** Slobodan tekst (npr. "Osjećam se jako usamljeno i ne znam s kim razgovarati").
- **Output:** AI mora generirati:
  1. Preporuku specifičnog broja telefona iz baze koji najbolje odgovara upitu.
  2. Kratku vježbu samopomoći (npr. tehnika disanja 4-7-8 ili tehnika uzemljenja).
  3. Empatičnu poruku podrške.

### C. Sustav povratne informacije (Email Logika)
- Ako korisnik ostavi e-mail i označi privolu, sustav treba simulirati prosljeđivanje upita stručnoj službi.
- Implementirati formu s poljima: Email, Opis problema, Checkbox za privolu.

### D. Sigurnosni protokoli
- **BRZI IZLAZ (Quick Exit):** Gumb koji je uvijek vidljiv i koji na klik odmah preusmjerava korisnika na neutralnu stranicu (npr. google.com).
- **Anonimnost:** Ne prikupljati osobne podatke osim e-maila uz izričitu privolu.

## 4. Struktura podataka (`services.json`)
Službe se učitavaju iz JSON datoteke koja sadrži:
- Naziv, broj telefona, radno vrijeme, kategoriju, dobnu skupinu i regiju pokrivenosti.

## 5. Upute za AI asistenta (Instructions for AI)
Kada radiš na ovom kodu:
1. Koristi umirujuće boje (soft blues, greens, neutrals).
2. Osiguraj da je sučelje potpuno responzivno (Mobile-first).
3. Kod mora biti čist, modularan i podijeljen u komponente (`Header`, `Filters`, `AICard`, `ServiceGrid`).
