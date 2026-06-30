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

The application is structured as a client-side Single Page Application (SPA), emphasizing fast transitions and optimal component modularity.

<img width="616" height="405" alt="image" src="https://github.com/user-attachments/assets/f0f40b52-6afc-4aa5-a682-7d554a744d28" />

## The Technology Stack:

**Vite + React (TypeScript):** Delivers super-fast bundler response, hot module swapping, and strict type safety across all components and data structures (managed under /src/types.ts).

**Tailwind CSS v4:** Applies direct utilities, responsive screens (sm:, md:, lg:), custom layout tracking, and optimized font styling.

**Motion (motion/react):** Drives smooth physical layouts, drawer sliding spring physics, staggered list entries, and overlay fades.

**Lucide React:** Renders lightweight, scalable line-art vector icons that perfectly align with the clean design aesthetic.

# 4. Interactive Data-flow architecture 

<img width="1055" height="559" alt="image" src="https://github.com/user-attachments/assets/264dbe20-5451-4e95-abe4-eb33a0376c9a" />

