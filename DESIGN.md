```markdown
# Design System Document: The Authoritative Union

## 1. Overview & Creative North Star

### Creative North Star: "The Modern Fortress"
This design system moves away from the "agitprop" aesthetics of the past to embrace a "Modern Fortress" philosophy. It is designed to feel unshakeable, sophisticated, and deeply rooted in the regional identity of Midi-Pyrénées and Haute-Garonne. We reject the "standard web template" look in favor of high-end editorial layouts that mirror the gravitas of a legal institution while maintaining the fire of a workers' union.

The experience is defined by **Intentional Asymmetry** and **Tonal Depth**. Instead of centering everything, we use the `epilogue` typeface to create strong, left-aligned anchors that suggest forward momentum. We break the grid with overlapping elements—such as a `headline-lg` title partially bleeding into a `primary-container` surface—to suggest the "Force" in Force Ouvrière.

---

## 2. Colors: Tonal Authority

The palette is a sophisticated evolution of the union's historic red and black. We use high-contrast blacks and deep reds to command attention, while leveraging a nuanced range of "warm grays" for the UI architecture.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be created via **Background Shifts**. For example, a `surface-container-low` section should sit directly against a `surface` background. The change in tone is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine stationery. 
- **Base:** `surface` (#fcf8f9)
- **Sections:** `surface-container-low` (#f6f3f4)
- **In-Section Cards:** `surface-container-lowest` (#ffffff)
- **Nested Detail:** `surface-container-highest` (#e5e2e3)

### The "Glass & Signature" Rule
To add professional polish, utilize **Glassmorphism** for navigation bars and floating action buttons (FABs). Use `surface` at 80% opacity with a `20px` backdrop-blur. 
- **Signature Texture:** For primary headers, use a subtle linear gradient from `primary` (#b40011) to `primary_container` (#de171f) at a 135-degree angle. This prevents the red from looking "flat" or "digital," giving it a woven, textile-like depth.

---

## 3. Typography: The Authoritative Voice

Typography is our primary tool for expressing "Solidarity" and "Strength."

*   **Display & Headlines (Epilogue):** This is our "Force." Epilogue’s geometric weight provides an architectural foundation. Use `display-lg` for regional slogans. Use tight letter-spacing (-0.02em) on headlines to create a "block" of text that feels like a solid wall.
*   **Body & Titles (Work Sans):** This is our "Reliability." Work Sans provides excellent legibility for complex labor laws and union updates. 
*   **The Regional Signature:** Use `title-md` in `tertiary` (#005a9b) for mentions of Midi-Pyrénées or Haute-Garonne. The blue provides a subtle nod to regional flags and the Occitan cross without clashing with the primary red.

---

## 4. Elevation & Depth: Tonal Layering

We do not use shadows to create "pop"; we use them to create "atmosphere."

*   **The Layering Principle:** A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural, soft lift. This is our default state for information modules.
*   **Ambient Shadows:** If an element must float (e.g., a critical Alert or FAB), use a custom shadow: `0 20px 40px rgba(94, 63, 59, 0.06)`. Note the use of `on-surface-variant` (#5e3f3b) as the shadow tint—never use pure black for shadows.
*   **The Ghost Border Fallback:** If accessibility requires a border, use `outline-variant` (#e8bcb7) at **15% opacity**. It should be felt, not seen.
*   **Solidarity Overlap:** Elements (like images of regional landmarks or union members) should frequently overlap container edges by `spacing-8`, suggesting that the movement cannot be contained by boxes.

---

## 5. Components

### Buttons: The Call to Action
*   **Primary:** Solid `primary` background with `on-primary` text. Use `rounded-sm` (0.125rem) for a sharp, industrial feel. No rounded pills—strength is angular.
*   **Secondary:** `surface-container-highest` background with `on-surface` text.
*   **Tertiary:** No background. Bold `primary` text with a `spacing-1` underline using `primary-fixed-dim`.

### Cards & Lists: The Editorial Feed
*   **Rule:** Forbid divider lines. Use `spacing-6` of vertical white space or a shift to `surface-container-low` to separate items.
*   **Regional Badge:** A small chip using `tertiary-container` with `on-tertiary-container` text, labeled with the department (e.g., "31 - Haute-Garonne").

### Input Fields: The Document Style
*   **State:** Fields should use a `surface-container-lowest` fill and a thick `2px` bottom border of `outline` (#936e6a). On focus, the bottom border transitions to `primary`.

### Interaction Highlights
*   **State Changes:** When hovering over a card, do not move it up. Instead, shift the background color from `surface-container-low` to `primary-fixed`. The subtle color "warm-up" is more sophisticated than a physical hop.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme high-contrast typography (e.g., `display-lg` next to `body-sm`) to create an editorial, magazine-like hierarchy.
*   **Do** use "Bleed" layouts where images or red accent blocks touch the very edge of the screen.
*   **Do** use `spacing-12` and `spacing-16` for section margins. Breathing room is a sign of authority.

### Don’t:
*   **Don't** use standard 1px borders or "card-on-gray-background" patterns.
*   **Don't** use `rounded-full` (pills) for buttons. It undermines the "Strong/Authoritative" brand.
*   **Don't** use pure black (#000000). Use `on-background` (#1b1b1c) to keep the look premium and "ink-like" rather than "default digital."
*   **Don't** use drop shadows on text. If the contrast is low, change the background color or overlay a `surface-dim` scrim.

---

## 7. Regional Integration
Incorporate the identity of **Midi-Pyrénées** through the use of "Structural Accents." Use `spacing-px` vertical lines in `tertiary-fixed-dim` to represent the precision of the aerospace industry (Toulouse/Haute-Garonne), juxtaposed against the heavy, organic Epilogue headlines representing the strength of the collective workforce.```