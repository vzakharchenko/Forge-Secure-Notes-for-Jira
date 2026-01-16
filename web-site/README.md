# Secure Notes for Jira - Landing Page

Landing page for Secure Notes for Jira marketplace listing.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Responsive design

## Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

The site will be available at `http://localhost:3099`

## Building

Build for production:

```bash
npm run build
```

The output will be in the `site/` directory (or as configured in `.env` BUILD_PATH).

## Adding Screenshots

Place screenshot images in `public/img/` directory:

- `screenshot1.png` - Creating secure note
- `screenshot2.png` - Decrypting secure note
- `screenshot3.png` - Secure note decrypted
- `screenshot4.png` - Secret notes history

If images are not found, placeholders will be displayed automatically.

## Structure

- `src/components/` - React components for landing page sections
- `src/App.tsx` - Main app component
- `public/img/` - Screenshot images
- `tailwind.config.js` - Tailwind CSS configuration
