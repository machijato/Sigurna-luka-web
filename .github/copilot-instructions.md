# Sigurna Luka - AI Copilot Instructions

## Project Overview
**Sigurna Luka** (Safe Harbor) is a Next.js crisis support platform that connects vulnerable users in Croatia with appropriate mental health and emergency services. The app uses Google's Gemini AI to intelligently triage user crises and recommend specific helplines based on age, location, and problem type.

**Key Context:** This is a bilingual system—UI is Croatian, but code is English. Always maintain this separation and ensure AI prompts correctly instruct Gemini to respond in Croatian.

## Architecture & Data Flow

### Core Components
- **Frontend:** Single-page app in [app/page.tsx](app/page.tsx) with three main sections:
  1. **Filter Section:** Multi-dimensional filtering (age, county, category)
  2. **AI Triage Section:** Text input for crisis description → Gemini analysis
  3. **Email Form Section:** Optional follow-up contact system

- **Service Layer:** [app/services/geminiService.ts](app/services/geminiService.ts) handles all AI communication
  - Uses `GoogleGenerativeAI` with `gemini-1.5-flash` model
  - Enforces JSON schema responses with `SchemaType.OBJECT`
  - Must include safety logic: if self-harm/violence detected, prioritize emergency services (IDs 5 or 6)

- **Data Layer:** [app/data/helplines.ts](app/data/helplines.ts) defines static helpline registry
  - 21 Croatian counties (`ZUPANIJE`)
  - All helplines typed with `Helpline` interface from [app/types.ts](app/types.ts)
  - Key fields: `id`, `category` (enum), `targetAges` (Age Group type), `counties[]`

### State Management
- Component-level only (no Redux/Context API)
- Uses `useMemo` for filtered helplines—**never remove this optimization** as it recalculates only when filter dependencies change
- AI response caching not implemented; consider for future requests

## Critical Patterns & Conventions

### 1. AI Prompt Engineering
The Gemini prompt in [app/services/geminiService.ts](app/services/geminiService.ts#L28-L39) is hardcoded and sensitive:
- Must be in Croatian for user context
- Must reference `HELPLINES` JSON to ensure accurate IDs in response
- **Safety Rule:** Always include the self-harm/violence detection override (prioritize service IDs 5=Hitna Pomoć, 6=Policija)
- Schema fields are **required**: `priorityNumbers[]` (service IDs), `exercise` (self-help technique), `empatheticMessage` (support text)

Example helpline ID mapping: `"1"` = Hrabri telefon, `"2"` = Plavi telefon, etc. (check [app/data/helplines.ts](app/data/helplines.ts#L18-L48))

### 2. TypeScript Conventions
- **CategoryType enum** ([app/types.ts](app/types.ts#L1-L8)): Single source of truth for problem categories. Update here first, then update helpline data.
- **AgeGroup type:** Union of specific age ranges (`'<18' | '18-25' | '26-35' | '36-45' | '46-65' | '65+'`)—not arbitrary strings
- All helplines must have complete metadata; partial/null values break filtering

### 3. Styling & Design System
- **Color Palette:** Primary blue (`blue-600`, `blue-900`), soft neutrals (slate series), semantic colors (emerald for exercises, red for Quick Exit)
- **Border Radius:** Consistent use of `rounded-[2.5rem]` (cards) and `rounded-2xl` (inputs)
- **Background:** App-wide `bg-[#F8FAFC]` with white card sections
- **Font:** Geist font family (already configured in [app/layout.tsx](app/layout.tsx))
- **Mobile-First:** Always use `md:` breakpoints for desktop layouts (e.g., `grid-cols-1 md:grid-cols-3`)

### 4. Safety & Privacy Features
- **Quick Exit Button:** Visible in header, hardcoded to `google.com`. Must remain prominent and implement ESC key listener ([app/page.tsx](app/page.tsx#L24-L31))
- **Anonimity:** Do NOT collect personal data except optional email with explicit consent checkbox
- **No Persistence:** Email data should be simulated as sent to services; no backend storage implemented yet

### 5. Environment Configuration
- **Gemini API Key:** Must be `NEXT_PUBLIC_GEMINI_API_KEY` (public exposure needed for client-side calls)
- **Next.js Config:** See [next.config.ts](next.config.ts) for any custom webpack/build settings
- Build command: `npm run build`, Dev: `npm run dev`

## Common Development Workflows

### Adding a New Helpline
1. Add entry to `HELPLINES` array in [app/data/helplines.ts](app/data/helplines.ts)
2. Ensure `id` is unique string, `category` matches `CategoryType` enum, `targetAges` and `counties` are arrays
3. Test filtering with all three filter combinations
4. Update Gemini prompt if new category needs special handling

### Modifying AI Response Logic
1. Update `responseSchema` in `analyzeCrisisInput()` if response fields change
2. Update `Prompt` text to guide Gemini on new fields
3. Update `AIAnalysisResponse` interface in [app/types.ts](app/types.ts)
4. Test with edge cases: self-harm phrases, non-Croatian input, empty text

### UI/Component Refactoring
Current monolithic structure in [app/page.tsx](app/page.tsx) (219 lines) could benefit from extraction:
- Consider: `<FilterSection />`, `<AITriageCard />`, `<EmailForm />`
- Keep state at page level for now (lift-up if adding routing)
- All styling must follow the design system rules above

## Testing Notes
- No test suite currently exists; `npm run lint` runs ESLint only
- Gemini API calls should be mocked in future tests (use environment variable to detect test mode)
- Key test scenarios: filtering accuracy with multiple criteria, empty/nonsensical AI queries, quick exit functionality

## Known Limitations & Future Work
- Email form doesn't send anywhere (simulated only)
- No error recovery UI for Gemini API failures (currently silent console.error)
- No rate limiting on AI requests
- Design system not fully extracted to reusable component library
