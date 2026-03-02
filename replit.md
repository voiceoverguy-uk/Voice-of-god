# Voice of God - Guy Harris Website

## Overview
Premium single-page portfolio website for Guy Harris, the UK's leading Voice of God announcer. Built with React, Express, and Tailwind CSS featuring Apple-style scroll animations.

## Architecture
- **Frontend**: React SPA with Framer Motion animations, Tailwind CSS
- **Backend**: Express.js with contact form API
- **Styling**: White background with deep red (#CC0000) brand accent
- **Fonts**: Ubuntu (body), Montserrat (headings)

## Key Features
- Apple-style scroll animations (fade in/up/left/right as elements enter viewport)
- Sticky navigation with transparent-to-white scroll transition
- Hero section with dramatic dark background
- YouTube video embeds (The Masked Singer, Ant & Dec's Saturday Night Takeaway)
- 3 custom audio players for MP3 demo uploads
- Client logo grid (30+ major brands)
- 5-star Google Reviews banner
- Contact form with validation
- Comprehensive SEO (meta tags, Open Graph, Twitter Cards, JSON-LD Schema)
- Mobile-responsive with hamburger menu

## File Structure
- `client/src/pages/home.tsx` - Main single-page layout with all sections
- `client/src/components/scroll-animation.tsx` - Framer Motion scroll animation wrappers
- `client/src/components/audio-player.tsx` - Custom HTML5 audio player component
- `shared/schema.ts` - Contact form Zod validation schema
- `server/routes.ts` - Contact form POST endpoint (/api/contact)
- `server/storage.ts` - In-memory contact submission storage

## Brand Colors
- Primary red: #CC0000 (HSL: 0 100% 40%)
- Background: White (#FFFFFF)
- Dark sections: Gray-950 (#0a0a0a)
- Text: Gray-900 for headings, Gray-600 for body

## Contact Details
- Email: guy@voiceoverguy.co.uk
- Phone: +44 (0)7973 350 178
- Domain: voiceoverguy.co.uk