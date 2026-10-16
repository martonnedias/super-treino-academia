---
name: Super Treino Academia
description: "One brand, three pinned worlds (A Ingresso de festa, C Noite, D Contraste) for a three-unit neighbourhood gym in Teresina."
colors:
  royal-blue: "#1E3FA8"
  golden-yellow: "#FFC400"
  ink: "#0B0B0F"
  party-orange: "#FF7A1A"
  white: "#FFFFFF"
  slate-text: "#464C63"
  night-soft: "#15151D"
  night-mute: "#B7BCCC"
  contrast-black: "#050507"
  contrast-soft: "#121216"
  contrast-mute: "#A3A6B4"
typography:
  a-display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(72px, 24cqw, 96px)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "0.005em"
  a-body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  c-display:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(76px, 24cqw, 104px)"
    fontWeight: 900
    lineHeight: 0.97
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 62"
  c-body:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  d-display:
    fontFamily: "Teko, Arial Narrow, sans-serif"
    fontSize: "clamp(48px, 8cqw, 80px)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "0.01em"
  d-body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  a-button:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    letterSpacing: "0.03em"
rounded:
  a-button: "12px"
  a-ticket: "22px"
  a-gallery: "20px"
  a-print: "6px"
  c-button: "6px"
  c-card: "10px"
  d-glass: "16px"
  pill: "999px"
spacing:
  gutter-mobile: "24px"
  gutter-a: "40px"
  gutter-c: "56px"
  gutter-d: "48px"
  control-height: "54px"
  touch-min: "44px"
components:
  a-button-primary:
    backgroundColor: "{colors.golden-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.a-button}"
    rounded: "{rounded.a-button}"
    height: "54px"
    padding: "0 24px"
  a-button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.golden-yellow}"
    rounded: "{rounded.a-button}"
  a-ticket:
    backgroundColor: "{colors.golden-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.a-ticket}"
    padding: "26px 24px 24px"
  a-pill:
    textColor: "{colors.golden-yellow}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 22px"
  c-button-primary:
    backgroundColor: "{colors.golden-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.c-button}"
    height: "56px"
    padding: "0 28px"
  c-button-primary-hover:
    backgroundColor: "{colors.white}"
  c-unit-cell-hover:
    backgroundColor: "{colors.golden-yellow}"
    textColor: "{colors.ink}"
  c-card:
    backgroundColor: "{colors.night-soft}"
    textColor: "{colors.white}"
    rounded: "{rounded.c-card}"
  d-button-primary:
    backgroundColor: "{colors.golden-yellow}"
    textColor: "{colors.contrast-black}"
    rounded: "{rounded.pill}"
    height: "54px"
    padding: "0 26px"
  d-button-outline-hover:
    backgroundColor: "{colors.golden-yellow}"
    textColor: "{colors.contrast-black}"
  d-row-hover:
    backgroundColor: "{colors.contrast-soft}"
  d-glass:
    backgroundColor: "{colors.contrast-soft}"
    textColor: "{colors.white}"
    rounded: "{rounded.d-glass}"
---

# Design System: Super Treino Academia

## Overview

**Creative North Star: "One Brand, Three Rooms"**

The site ships three pinned layouts of the same gym. The client picks one, so each is a complete world. What does not change: the dumbbell logo mark with "Super Treino" over "ACADEMIA" in yellow, the royal blue and golden yellow pair, heavy condensed uppercase headlines, a direct, upbeat, local voice, and one job per screen: choose a unit and tap its WhatsApp. What changes is the material. A is a party ticket on blue. C is a lit night room with full-bleed photography. D is a black poster whose photos turn to colour.

Each world owns exactly one signature interaction, and every motion effect is gated by `prefers-reduced-motion` (the shared script exits early under reduce, and the layout CSS also zeroes its keyframe animations). Pointer-only effects additionally require `(hover: hover) and (pointer: fine)`.

Where the contract and the build differ: the "Ingresso" tilt, lantern and magnet are mouse-only, so on touch the worlds read as static layouts with scroll reveals. Photography is provisional AI imagery and unconfirmed facts render as "a confirmar" chips; neither is part of the system.

**Key Characteristics:**
- Shared yellow `#FFC400` as the action colour in all three worlds
- Condensed uppercase display faces, humanist or geometric sans for body
- Container-query layout (`cqw` type, `@container` breakpoints), mobile nav under about 880-1000px
- Flat colour fields; depth only from soft drop shadows and photography
- Unconfirmed data shown as solid yellow chips, never hidden or invented

## Colors

A blue and yellow brand that goes to near-black in C and D, with yellow as the only constant accent.

### Primary
- **Royal Blue** (#1E3FA8): A's page ground, A headline accents, ticket unit numbers, the A header bar. Absent as a surface in C and D.
- **Golden Yellow** (#FFC400): the action colour everywhere. A tickets and primary buttons, C and D primary buttons, focus rings on dark grounds, scrollbars, text selection, the progress bar, the floating WhatsApp button in C and D.

### Secondary
- **Party Orange** (#FF7A1A): A's alt ticket paper and the "&" in "Energia & Diversão"; C's day-column rules. A schedule accent, never a button.

### Neutral
- **Ink** (#0B0B0F): A text and dark sections; C page ground; button text on yellow.
- **Night Soft** (#15151D) and **Night Mute** (#B7BCCC): C raised surfaces and secondary text.
- **Contrast Black** (#050507), **Contrast Soft** (#121216), **Contrast Mute** (#A3A6B4): D ground, hover rows and glass, secondary text.
- **Slate Text** (#464C63): A body copy on light surfaces.
- **White** (#FFFFFF): A paper tickets and prints; hover fill for C and D yellow buttons.

### Named Rules
**The Yellow Is Action Rule.** Yellow marks what you can tap or what is in focus. It is never wallpaper, except A's ticket stock, which is the object being tapped.
**The Pinned Palette Rule.** Hex values come from `src/data/site.mjs` (A) and the layout CSS (C, D). Exact brand codes are still to be received from the client; do not mint new brand hues.

## Typography

**A:** Big Shoulders Display (display, buttons, serials) with Figtree (body).
**C:** Archivo at 62% width, weight 900 (display), 75% width in buttons, with Albert Sans (body).
**D:** Teko 600 (display) with Manrope (body, buttons, labels).

**Character:** Condensed, shouting, uppercase headlines against a calm sans. Each pairing is fixed to its world; never mix them.

### Hierarchy
- **Display** (A 900 / C 900 / D 600, clamp 72-96px A, 76-104px C, 48-80px D, line-height .92-.98): hero and section titles, uppercase. Hero is "Treine como em casa."
- **Headline** (A 40px h3, unit names up to 88px; D 34px): unit names, plan names.
- **Body** (A 17px/1.55, C 17px/1.6, D 16px/1.6): `text-wrap: pretty`; headings `text-wrap: balance`.
- **Label** (A/D buttons 22px at .03em or 13-14px at .08em; C buttons 19px at .06em; all uppercase): buttons, pills, nav links (C 14px at .14em, D 13px at .12em).

### Named Rules
**The Own Face Rule.** Display and body faces never cross worlds. A 12px logo sub-line "Academia" spaced at .5em is part of the logo lockup, not a label style to reuse.
**The Numerals Rule.** Counters and serials use tabular figures.

## Layout

Each page root is a size container (`.st` A, `.nt` C, `.dx` D); type and breakpoints respond to the container, not the viewport. Content wrap is 1200px (A, D) or 1280px (C) with 24px mobile gutters growing to 40 (A), 56 (C) or 48px (D). Section padding is fluid (about 64-140px). Hero grid in A is copy plus ticket stack beside a photo (two columns from 900px); C stacks a full-bleed hero photo with a bar of three unit cells; D leads with a stat row and trial-class chip. Mobile uses a details-based menu and a sticky bottom action bar (`.bar-m`) under 880px (A), 900px (D), 1000px (C). Minimum touch target 44px, primary controls 54-56px.

## Elevation & Depth

Hybrid and restrained. A uses soft blue-tinted drop shadows under tickets (`drop-shadow(0 24px 24px rgba(4,10,48,.38))`), prints (`0 30px 60px rgba(4,10,48,.4)`) and the stamp, plus film grain (overlay PNG at .55 opacity). C uses scrims on photos, a peek photo shadow (`0 30px 60px rgba(0,0,0,.45)`) and tonal surfaces. D is flat black with hairline borders (`rgba(255,255,255,.14)`) and a single blurred glass panel (`backdrop-filter: blur(14px)`). Shared: floating WhatsApp button (`0 16px 34px rgba(0,0,0,.38)`) and menu (`0 26px 56px rgba(0,0,0,.45)`).

### Named Rules
**The Soft Shadow Rule.** Shadows are diffuse and tinted to the ground. No hard offset shadows.

## Shapes

A is round and friendly: 12px buttons, 22px ticket corners with semicircle perforation notches (radial-gradient masks, 14px) and a dashed divider, 20px gallery cells, 6px white prints, a rotated circular stamp. C is squarer: 6px buttons, 10px cards, 1px hairlines. D is pill buttons (999px), 16px glass, hairline rows, circular menu button.

## Components

### Buttons
- **Shape:** A 12px radius, C 6px, D full pill.
- **Primary:** yellow fill, ink text, 54px (A, D) or 56px (C) tall. Dark variant ink fill with yellow text. Outline and white-outline variants for dark grounds.
- **Hover / Focus:** A lifts 2px with a shadow; C yellow goes white and the arrow slides 5px; D yellow goes white and the arrow nudges up-right. Focus: 3px yellow outline, 3px offset (D 2px); on light sections the ring turns blue.
- On under 480px, long labels wrap instead of overflowing.

### Tickets (A)
Yellow (or white, orange) paper in two halves, notched perforation, dashed divider, barcode block and serial text ("Entrada · 1 pessoa"). Each unit row inside is a link with a numbered outline badge and a sliding arrow. Tilts toward the pointer on fine pointers.

### Unit rows and cells
A: dashed-divider ticket rows. C: cells that fill yellow on hover with dark text; outlined headline rows (transparent fill, 2px white stroke) fill yellow on hover with a tilted peek photo. D: hairline rows with three columns on wide screens, lifting to Contrast Soft on hover.

### Pills and chips
A: 44px outlined pills in uppercase display type, coloured per class (yellow Dança, orange Funcional). D: small yellow badge on the best plan. Placeholder chip `.ph`: solid yellow with ink text (forced by the shared layer) for every "a confirmar" value.

### Accordion (FAQ)
Row toggles with `aria-expanded`; the plus icon rotates 135deg when open.

### Floating WhatsApp menu
Pill button, desktop only (from 880px), fades in after the hero; opens a list of the three units with phone sub-labels. A: ink pill with yellow text, white menu. C and D: yellow pill, dark menu. Fonts follow the world.

### Layout switcher (prototype only)
Collapsed fixed pill bottom-left ("Layouts"), expands to A, C, D and "all". Ink with white hairline, yellow current item. Prototype scaffolding; remove when the client picks.

### Motion grammar
- **Scroll reveal:** `.fx-r` fades and rises 32px, staggered by 80ms steps, 0.9-1s expo-out `cubic-bezier(.16,1,.3,1)`.
- **Masked headlines:** words rise 118% out of clipped lines, 55ms stagger. Shared; C leans on it most.
- **Parallax, progress bar, scrolled-header shadow, count-up** on `[data-count]` numerals.
- **A:** pointer tilt on tickets (perspective 900px, about 9deg), confetti burst in yellow, orange, blue and white on WhatsApp taps, slow marquee, drop-in on load.
- **C:** cursor lantern (440px radial yellow glow at 18%) in hero and cards, magnetic yellow and dark buttons (max 10px), hero Ken Burns, nav underline wipe.
- **D:** 36px yellow ring cursor that enlarges over links, grayscale photos (`grayscale(1) contrast(1.12)`) that gain colour at 60% visibility or on hover, slow spinning badge.
- Everything above is off under `prefers-reduced-motion: reduce`; mouse effects also need a fine hover pointer.

## Do's and Don'ts

### Do:
- **Do** keep the logo lockup, yellow action colour and uppercase condensed headlines identical across worlds.
- **Do** give every world its own faces, radius family and one signature interaction, as built.
- **Do** keep 3px (D 2px) yellow focus outlines and 44px minimum targets.
- **Do** mark unconfirmed facts with the yellow `.ph` chip.
- **Do** gate every new animation on `prefers-reduced-motion`.

### Don't:
- **Don't** use blue as a surface in C or D, or mix a world's type pairing into another.
- **Don't** add hard offset shadows or new brand hues.
- **Don't** invent contact data, prices, ratings or testimonials; unknown stays marked.
- **Don't** make the effects layer carry information; every effect is decoration over a working static page.
