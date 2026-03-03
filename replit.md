# Voice of God - Guy Harris Website

## Overview
Premium single-page portfolio website for Guy Harris, the UK's leading Voice of God announcer. Built with React, Express, and Tailwind CSS featuring Apple-style scroll animations.

## Architecture
- **Frontend**: React SPA with Framer Motion animations, Tailwind CSS
- **Backend**: Express.js with contact form API
- **Styling**: White background with brand red (#9C060B) accent
- **Fonts**: Ubuntu (body), Montserrat (headings)

## Key Features
- Apple-style scroll animations (fade in/up/left/right as elements enter viewport)
- Sticky navigation with transparent-to-white scroll transition
- Hero section with dramatic dark background
- 4 YouTube video embeds (The Masked Singer, Ant & Dec's Saturday Night Takeaway, Voice of God Demo, Showreel)
- 3 custom audio players for MP3 demo uploads
- Client logos section: static grid with 35 brand logos (grayscale-to-color hover, name label pops up on hover)
- 5-star Google Reviews banner
- Contact form with validation
- Comprehensive SEO (meta tags, Open Graph, Twitter Cards, JSON-LD Schema)
- Mobile-responsive with hamburger menu

## File Structure
- `client/src/pages/home.tsx` - Main single-page layout with all sections
- `client/src/components/scroll-animation.tsx` - Framer Motion scroll animation wrappers
- `client/src/components/audio-player.tsx` - Custom HTML5 audio player component
- `shared/schema.ts` - Contact form Zod validation schema
- `server/routes.ts` - Contact form POST endpoint (/api/contact) (Express, for Replit dev)
- `server/storage.ts` - In-memory contact submission storage
- `api/contact.ts` - Vercel serverless function for contact form
- `vercel.json` - Vercel deployment configuration

## Deployment
- **Replit**: Runs via `npm run dev` (Express backend + Vite frontend)
- **Vercel**: Deploys as static frontend (Vite build to `dist/public`) + serverless function (`api/contact.ts`) for the contact form API

## Brand Colors
- Primary red: #9C060B (HSL: 358 74% 48%)
- Background: White (#FFFFFF)
- Dark sections: Gray-950 (#0a0a0a)
- Text: Gray-900 for headings, Gray-600 for body

## Contact Details
- Email: guy@voiceoverguy.co.uk
- Phone: +44 (0)7973 350 178
- Domain: voiceoverguy.co.uk