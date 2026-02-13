# Code Blue: Design DNA & Philosophy

This document serves as the "Source of Truth" for the design language, technical architecture, and aesthetic principles of the Code Blue project. It provides immediate context for contributors and AI assistants to maintain a consistent digital identity.

## 1. Core Philosophy: "Premium Modernity"
The Code Blue aesthetic is a blend of **Sophisticated Glassmorphism** and **Bold Brutalism**. It prioritizes a premium, high-end feel while maintaining a strong, authoritative digital presence.

- **Clean over Cluttered**: Favor negative space and deliberate layout choices.
- **Tactile Interactivity**: Every interaction should feel physical (blur, depth, inertia).
- **Subdued but Striking**: Avoid "eye-poppy" neon; favor deep, professional tones with sharp accents.

## 2. Visual Identity (The "Code Blue" Palette)
- **Primary Background**: Deep Navy (`rgba(10, 20, 40, ...)` or `#000a14`).
- **Accent Color**: Vibrant "Code Blue" (`#5eb8ff`). Used for highlights, titles, and active states.
- **Typography Colors**: 
    - Titles: Vibrant Blue (`#5eb8ff`).
    - Body: Light Gray (`#aaa`) or White (`#fff`).
    - High-Contrast Areas: Pure Black (`#000`) on light glass layers.

## 3. UI Components & Elements
### Glassmorphism
- **Blur**: Standard `20px` backdrop filter.
- **Borders**: Subtle `1px` translucent borders (`rgba(255, 255, 255, 0.1)`).
- **Depth**: Use `box-shadow` to create a stackable, layered physical feel rather than flat boxes.

### Typography (Brutalism vs. Elegance)
- **Headers (Brutalist)**: Usage of `font-black` (900 weight), `uppercase`, and tight letter-spacing for main page headers.
- **Body/UI**: Clean, original font weights for components like `ProfileCard` to avoid visual fatigue.

## 4. Motion & Animation DNA
- **Technology**: GSAP (Timeline/Ease) and OGL (WebGL) for 3D rendering.
- **Movement Rules**:
    - **Inertia**: Dragging actions (galleries) must have smooth deceleration.
    - **Drift**: Idle components (like the Circular Gallery) should have a subtle, continuous "autoplay" movement.
    - **Stagger**: Menus and items should enter sequentially rather than all at once.

## 5. Responsive Design Principles
- **Tablet Optimization**: 
    - Compress wide forms to a `max-width` (e.g., `550px`) to prevent "oversizing".
    - Increase touch target sizes (Menu toggles, buttons).
    - Bring 3D cameras closer (Dynamic FOV) to fill the screen effectively.
- **Mobile optimization**: 
    - `touch-action: none` on horizontal galleries to prevent accidental page scrolls.
    - Higher touch sensitivity for finger interactions vs. mouse wheels.

## 6. Technical Stack Context
- **Framework**: React.
- **Animations**: GSAP, WebGL (via OGL).
- **Styling**: Vanilla CSS with modern properties (clamp, backdrop-filter, variables).
- **Graphics**: High-performance WebGL for the "wow" factor components.
