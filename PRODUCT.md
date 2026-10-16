# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS (confirmed by the user). A small Node build script generates the home and the three unit pages of each layout from one data file. Deploy target: Vercel or Hostinger, as the PRD suggests.

## Users

- Prospective students in Teresina-PI, mostly arriving from mobile through a Google search or the Instagram bio: beginners (18–35) who want a fair price and a welcoming start, people who want dance/functional classes, and advanced lifters who want structure and equipment.
- The academy owner, who is the decision maker for the sale. This first delivery is a prototype for the owner to choose one of three layouts.

## Product Purpose

Super Treino Academia has 3 units in Teresina (Itararé, Parque Jurema, Renascença II) and no site of its own. The site gathers units, prices, class schedule and WhatsApp in one place and takes a visitor from search to the WhatsApp of the closest unit in two taps. Short term: impress the owner with a navigable prototype. Medium term: become the base for Google Business Profile, Instagram and paid traffic, and the entry point of the owner's marketing package.

## Positioning

"The family gym of Teresina": three neighborhood units, fair and visible prices, and "Energia & Diversão" dance classes with their own identity. Students say "me sinto em casa" in Google reviews.

## Operating Context

- Instagram @supertreinoacademia: 22.4k followers, schedules and plans live in stories that expire.
- Google Business Profile: 283 reviews across the three units (4.6 to 4.7).
- The site is delivered as three layout options (A "Ingresso de festa", C "Noite", D "Contraste"); the client picks one.

## Capabilities and Constraints

- Home plus one page per unit, each with address, hours, plans and prices, class grid, map, WhatsApp with a pre-filled message naming the unit, call and route buttons.
- Local SEO per unit page, structured data (HealthClub/LocalBusiness), HTTPS and domain after approval. No database in the MVP.
- Phase 2, out of scope: trial-class form, blog, student area, online payment, real-time booking.
- Contact data comes from the Google captures and is flagged "a confirmar" in `src/data/site.mjs`: Parque Jurema shows DDD (88) and shares the final digits 99442-7681 with Renascença II; the Jurema address differs between Google and Instagram.
- Plans known only for Itararé (monthly 85, bi-monthly 150 in up to 2x, quarterly 210 in up to 3x, semester 420 in up to 6x), from a story of about 38 weeks: confirm they are current. Other units: not shown in the captures.
- Open times for Monday to Friday and Sunday are unknown.

## Brand Commitments

- Royal blue and golden yellow with white; black with yellow and orange on schedule art. Heavy condensed uppercase headlines, logo "Super Treino ACADEMIA" in yellow over blue with a dumbbell.
- Tone: direct, upbeat and local, like the Instagram art.
- Real photos should replace the provisional AI-generated ones before launch. Logo file and exact color codes still to be received.

## Evidence on Hand

- PRD in Claude Docs ("Super Treino — Brainstorm e PRD do Site") with extracted data: addresses, phones, ratings, Itararé plans, dance class days.
- Three approved canvas layouts (A, C, D) with provisional images in `src/img`.
- Absent, never to be invented: review texts and names, other units' prices, opening times, CNPJ, final logo.

## Product Principles

- Contact first: every screen is two taps from the WhatsApp of a specific unit.
- Show prices and schedules openly; unknown facts stay visibly marked, never invented.
- One source of truth for unit data, so the same name, address and phone feed the pages, the structured data and the Google profiles.
- Mobile first, fast on 4G, accessible.

## Accessibility & Inclusion

WCAG 2.1 AA contrast, 44px touch targets, keyboard focus, reduced-motion respected, Brazilian Portuguese.
