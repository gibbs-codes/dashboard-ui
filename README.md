# Dashboard UI

A multi-page React application built with Vite, featuring separate displays for TV and Projector interfaces.

## Overview

This project provides two distinct display interfaces:
- **TV Display**: Optimized interface for television screens
- **Projector Display**: Optimized interface for projector output

## Tech Stack

- React 18.2
- Vite 5.0
- Tailwind CSS 3.4
- Lucide React (icons)

## Getting Started

### Installation

```bash
npm install
```

### Development

Run both displays:
```bash
npm run dev
```

Run TV display only:
```bash
npm run dev:tv
```

Run Projector display only:
```bash
npm run dev:projector
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
dashboard-ui/
├── src/              # Source files
│   ├── tv-main.jsx       # TV display entry point
│   └── projector-main.jsx # Projector display entry point
├── public/           # Static assets and HTML entry points
│   ├── tv.html
│   └── projector.html
├── components/       # Shared React components
├── hooks/            # Custom React hooks
├── services/         # API and service utilities
├── styles/           # Global styles
└── config/           # Configuration files
```

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

## License

Private
