# Design System Specification: The Empathetic Bento

## 1. Overview & Creative North Star: "The Digital Sanctuary"
This design system departs from the sterile, cold atmosphere of traditional medical interfaces. Our Creative North Star is **"The Digital Sanctuary."** We aim to create a space that feels as safe as a home and as precise as a modern clinic.

To break the "template" look, we utilize an **Asymmetric Bento Box** layout. Instead of a rigid, equal-height grid, we use "weighted" containers—varying the scale of squircles to draw the eye to primary health data while letting secondary information breathe in smaller, nested modules. By overlapping floating elements and using intentional whitespace, we create a sense of organic growth rather than mechanical assembly.

---

## 2. Colors: Tonal Depth & Warmth
Our palette is rooted in medical trust but executed with editorial softness.

### The Color Logic
- **Primary (`#2b667a`):** Used for authoritative moments—active states and primary CTAs.
- **Secondary (`#4a664c`):** Represents growth and stability. Used for "Success" states and wellness tracking.
- **Tertiary (`#755a40`):** Adds a human, "Peach" warmth to the UI, preventing the blue/green from feeling too clinical.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Physical boundaries must be defined solely through background shifts. 
- Use `surface-container-low` for large background sections.
- Place `surface-container-lowest` (pure white) cards on top to create distinction.
- Contrast is achieved through tone, never through a "stroke."

### The "Glass & Gradient" Rule
Standard flat buttons are forbidden for Hero actions. Use a subtle **Signature Gradient** from `primary` to `primary_container` with a 15-degree angle. For floating navigation or over-image overlays, apply **Glassmorphism**: use `surface_variant` at 60% opacity with a `24px` backdrop blur to allow the soft pastel background to bleed through.

---

## 3. Typography: Rounded Authority
We utilize **Plus Jakarta Sans** for its unique balance of geometric precision and "friendly" rounded terminals.

- **Display (3.5rem - 2.25rem):** Set with tight letter-spacing (-0.02em). Use for large, welcoming greetings or primary health metrics.
- **Headlines (2rem - 1.5rem):** The "Editorial" layer. Use `on_surface` to lead the user through the Bento sections.
- **Body (1rem - 0.75rem):** High legibility. Ensure `body-lg` is used for all patient-facing instructions to maintain an approachable "large-print" feel.
- **Labels (0.75rem - 0.6875rem):** Always uppercase with +0.05em tracking when used for categorization to provide a premium, "catalog" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a feeling, not a structure. 

- **The Layering Principle:** Stack `surface_container_lowest` (#ffffff) squircles onto a `surface` (#f6fafe) background. This creates a "lift" that feels like thick, premium cardstock.
- **Ambient Shadows:** For "floating" elements like Modals or FABs, use a shadow with a 40px blur, 0px offset, and 6% opacity. The shadow color must be a tinted `primary_dim` rather than black, creating a natural light-bleed effect.
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input fields), use `outline_variant` at 15% opacity. It should be felt, not seen.
- **The Squircle Factor:** All containers must use the `xl` (3rem) or `lg` (2rem) corner radius. Avoid standard 4px or 8px corners; they are too "tech-standard."

---

## 5. Components: Soft Touchpoints

### Cards (The Bento Base)
Cards are the core of the system.
- **Style:** `surface_container_lowest` fill, `xl` corner radius, no border.
- **Padding:** 2rem (32px) internal padding to ensure "high-end" breathing room.
- **Interaction:** On hover, a card should scale to 101% and transition its shadow opacity to 10%.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `full` (pill) roundedness, white text.
- **Secondary:** `secondary_container` fill with `on_secondary_container` text. No border.
- **Tertiary:** Transparent background, `primary` text, with a soft `primary_fixed_dim` underline on hover.

### Inputs
- **Style:** `surface_container_high` fill, `md` corner radius. 
- **States:** On focus, the background shifts to `surface_container_lowest` with a 2px `primary` ghost-border (20% opacity).

### Specialized Medical Components
- **The Vitality Chip:** A large, pill-shaped badge using `tertiary_container` for displaying patient vitals (e.g., "72 BPM").
- **Tonal Progress Bars:** Thick (12px) bars using `secondary_fixed` as the track and `secondary` as the progress indicator, with `full` rounded caps.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional asymmetry in your Bento layouts. One large card should dominate the visual hierarchy.
- **Do** use `surface_dim` for "inactive" or "past" medical records to push them into the background.
- **Do** maximize whitespace. If it feels like too much, it’s probably just right.

### Don't
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#2a343a).
- **Don't** use dividers or lines to separate list items. Use an 8px vertical gap and a slight `surface_container_low` background shift.
- **Don't** use sharp corners. If a component is smaller than 24px, use `full` rounding; if larger, use the Squircle scale.