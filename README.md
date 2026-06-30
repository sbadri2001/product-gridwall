# 1. Project Overview & Concept

Essentials.studio is a highly polished, high-fidelity e-commerce catalog application designed for curating premium workspace peripherals, lifestyle accessories, and creative tools.

Adhering to a minimalist Swiss-Modernist design system, the platform uses a high-contrast grayscale palette, generous negative space, strict typography scale, and fluid micro-animations to deliver a retail experience that feels tactile and editorial.

<img width="861" height="864" alt="image" src="https://github.com/user-attachments/assets/99f431bd-51a6-4e22-8e16-4c6f262a91ed" />


# 2. Core Functional Modules

## Dynamic Filtering & Search:

**Interactive Search:** Instantly filters products based on names, descriptions, categories, or technical specs.

**Categorized Collections:** Real-time category-badge switching for quick browsing of product segments.

**Price Capping:** A responsive slider dynamically constraining displayed items based on real-time price limits.

## Tactile Product Cards:

Includes lazy-loaded images, pre-loader skeleton states, high-contrast discount badges, and a "Quick View" hover portal.
Direct-to-cart actions with automatic validation of inventory constraints (e.g., Sold Out state).

## Interactive Product Detail Drawer:

**Media Gallery Picker:** Swaps between high-resolution product thumbnails seamlessly.

**Technical Spec Sheet:** Structured key-value specs displaying hardware details.

**Purchase Promises:** Dynamic shipping thresholds and official warranty badges.

## State-Synchronized Cart Drawer:

Fluid increment/decrement item controls with automatic price tallies.

Progress indicator highlighting how much more is needed to reach the **Free Shipping threshold ($150.00)**.

Detailed tax calculations and a custom animated mock checkout state.

# 3. Architecture & Technology Stack

**Next.js App Router Structure:** Created the layout framework (src/app/layout.tsx) and migrated the core workspace catalog page directly into the page entry point (src/app/page.tsx).

**Tailwind CSS v4 Integration:** Re-anchored the typography pairings and customized smooth scrollbars into the global stylesheet (src/app/globals.css) using the PostCSS pipeline for Next.js.

**Client Directives ("use client"):** Added explicit client directives to interactive drawers, filter panels, and product grid components to support seamless state transitions and smooth framerate spring physics.

**Clean Build pipeline:** Updated the package configurations to build via next build with a static export setup into dist/ to remain fully optimized for fast Cloud Run container performance.

# 4. Interactive Data-flow architecture 

<img width="1055" height="559" alt="image" src="https://github.com/user-attachments/assets/264dbe20-5451-4e95-abe4-eb33a0376c9a" />

