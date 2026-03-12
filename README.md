# Dashboard UI

A multi-page React application built with Vite, featuring separate displays for TV and Projector interfaces with real-time data integration.

## Overview

This project provides two distinct display interfaces:
- **TV Display**: Optimized interface for television screens (1920x1080, normal scale)
- **Projector Display**: Optimized interface for wall projection (1920x1080, 0.6x scale)

Both displays support multiple profiles for different use cases (morning briefing, focus mode, work mode, etc.) and receive real-time updates via WebSocket.

## Tech Stack

- React 18.2
- Vite 5.0
- Tailwind CSS 3.4
- Lucide React (icons)
- WebSocket (real-time updates)
- Native Fetch API (no axios)

## Quick Start

### Installation

```bash
npm install
```

### Run TV Display

```bash
npm run dev:tv
```

Opens TV display at `http://localhost:5173/tv.html`

### Run Projector Display

```bash
npm run dev:projector
```

Opens Projector display at `http://localhost:5173/projector.html`

### Run Both Simultaneously

```bash
npm run dev
```

Then navigate to:
- TV: `http://localhost:5173/tv.html`
- Projector: `http://localhost:5173/projector.html`

## Environment Setup

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Configure environment variables:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001/ws
```

**Default values:**
- API URL: `http://localhost:3001` (dashboard-api backend)
- WebSocket URL: `ws://localhost:3001/ws`

The dashboard-ui connects to a separate backend service (dashboard-api) that provides weather, transit, calendar, and task data.

## Profile System

The dashboard supports **5 profiles** that determine which data is displayed and how it's laid out:

### 1. Default Profile (`default`)
**TV Display:** 2x2 grid with Weather, Next Event, Transit, and Clock
**Projector Display:** Transit | Clock+Weather | Art
**Data:** Weather, Transit

### 2. Morning Briefing (`morning`)
**TV Display:** Greeting header, stats cards, events list, tasks list, transit strip
**Projector Display:** Weather+Transit | Clock+Date | Calendar+Tasks
**Data:** Weather, Transit, Calendar, Tasks, Next Event

### 3. Focus Mode (`focus`)
**TV Display:** Centered large next event with countdown
**Projector Display:** Art | Large Next Event | Art
**Data:** Next Event only

### 4. Work Mode (`work`)
**TV Display:** Reuses default layout
**Projector Display:** Calendar | Next Event+Clock | Tasks
**Data:** Calendar, Tasks, Next Event

### 5. Relax Mode (`relax`)
**TV Display:** Time-based gradient with large clock
**Projector Display:** Art | Clock Only | Art
**Data:** None (minimal mode)

### Changing Profiles

Profiles are controlled by the dashboard-api backend. To change profiles:

```bash
curl -X POST http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -d '{"mode":"morning"}'
```

The display will automatically switch when the profile update is received via WebSocket.

## Project Structure

```
dashboard-ui/
├── src/
│   ├── core/
│   │   └── App.jsx              # Root application component
│   ├── displays/
│   │   ├── TVDisplay.jsx        # TV display wrapper
│   │   ├── ProjectorDisplay.jsx # Projector display wrapper
│   │   └── tv/
│   │       ├── TVDefault.jsx    # Default TV layout
│   │       ├── TVMorning.jsx    # Morning briefing layout
│   │       └── TVFocus.jsx      # Focus mode layout
│   ├── layouts/
│   │   ├── TVLayout.jsx         # TV layout wrapper
│   │   └── ProjectorLayout.jsx  # Projector layout wrapper
│   ├── components/
│   │   ├── shared/              # Shared components (Clock, Weather, etc.)
│   │   ├── tv/                  # TV-specific components
│   │   └── projector/           # Projector-specific components
│   │       ├── TransitCanvas.jsx
│   │       ├── ClockWeatherCanvas.jsx
│   │       ├── ArtCanvas.jsx
│   │       └── CalendarTimelineCanvas.jsx
│   ├── hooks/
│   │   ├── useDashboardData.js  # Data fetching with WebSocket
│   │   ├── useProfile.js        # Profile management
│   │   ├── useWebSocket.js      # WebSocket connection
│   │   └── usePolling.js        # Polling fallback
│   ├── services/
│   │   ├── api.js               # API client
│   │   ├── websocket.js         # WebSocket client
│   │   └── storage.js           # localStorage caching
│   ├── config/
│   │   ├── api.js               # API endpoints
│   │   ├── profiles.js          # Profile definitions
│   │   └── displays.js          # Display configurations
│   ├── utils/
│   │   ├── dateTime.js          # Date/time utilities
│   │   └── connectionStatus.js  # Connection status utilities
│   ├── styles/
│   │   ├── index.css            # Global styles + Tailwind
│   │   ├── tv.css               # TV-specific styles
│   │   └── projector.css        # Projector-specific styles
│   ├── tv-main.jsx              # TV display entry point
│   └── projector-main.jsx       # Projector display entry point
├── public/
│   ├── tv.html                  # TV HTML entry point
│   └── projector.html           # Projector HTML entry point
└── vite.config.js               # Multi-page Vite config
```

## Development

### Adding New Canvas Components

1. Create component in `src/components/projector/` or `src/components/tv/`:

```jsx
// src/components/projector/MyCanvas.jsx
export const MyCanvas = ({ data }) => {
  return (
    <div className="h-full bg-black text-white p-6">
      {/* Your component */}
    </div>
  );
};
```

2. Register in layout component map:

```jsx
// src/layouts/ProjectorLayout.jsx
const COMPONENT_MAP = {
  MyCanvas: MyCanvas,
  // ... other components
};
```

3. Update profile configuration:

```javascript
// src/config/profiles.js
projector: {
  left: 'Transit',
  center: 'MyCanvas',
  right: 'ArtCanvas',
}
```

### Adding New Profiles

1. Add profile to `src/config/profiles.js`:

```javascript
export const PROFILES = {
  myProfile: {
    id: 'myProfile',
    name: 'My Profile',
    description: 'Custom profile description',
    data: {
      weather: true,
      transit: false,
      // ... data requirements
    },
    displays: {
      tv: 'TVDefault',
      projector: {
        left: 'Transit',
        center: 'ClockWeather',
        right: 'ArtCanvas',
      },
    },
  },
};
```

2. Optionally create custom TV layout in `src/displays/tv/`.

3. Update `DISPLAY_MAP` in `src/layouts/TVLayout.jsx`.

### Modifying Layouts

**TV Layouts** are found in `src/displays/tv/`:
- Receive `data` prop with dashboard data
- Use shared components from `src/components/shared/`
- Apply Tailwind classes with `bg-white/10 backdrop-blur` for glass-morphism

**Projector Layouts** are column-based:
- Modify column configuration in `src/layouts/ProjectorLayout.jsx`
- Each column component receives specific data props
- Use high-contrast styling (black background, white text, enhanced shadows)

## Deployment

### Build

```bash
npm run build
```

Output: `dist/` directory with separate TV and Projector builds.

### Preview Production Build

```bash
npm run preview
```

### Serve Static Files

Serve the `dist/` folder with any static server:

```bash
# Example with serve
npx serve dist

# Example with http-server
npx http-server dist
```

### Kiosk Mode Setup

For full-screen signage displays:

**Chrome/Chromium:**
```bash
chromium-browser --kiosk --app=http://localhost:3000/tv.html
```

**Firefox:**
```bash
firefox --kiosk http://localhost:3000/tv.html
```

**Auto-start on Boot (Linux):**

Create a systemd service or add to `~/.config/autostart/`:

```desktop
[Desktop Entry]
Type=Application
Name=Dashboard TV
Exec=chromium-browser --kiosk --app=http://localhost:3000/tv.html
```

## Troubleshooting

### Black Screen on Load

**This is normal.** The display shows a black screen while waiting for initial data from the dashboard-api backend. Once data is received, the display will render.

**Check:**
- Dashboard-api is running at the configured `VITE_API_URL`
- Network connectivity between dashboard-ui and dashboard-api
- Browser console for errors

### Connection Indicator

The connection indicator appears in the bottom-right corner when there are connection issues:

- **Green (Live)**: WebSocket connected, data is fresh (< 60 seconds old)
- **Yellow (Stale)**: Data is older than 60 seconds, but WebSocket is connected
- **Red (Disconnected)**: WebSocket disconnected or data is very stale

**No indicator** = Everything is working correctly.

### WebSocket Connection Issues

**Symptoms:**
- Red/yellow connection indicator
- Data not updating
- Console errors: `WebSocket connection failed`

**Diagnosis:**

1. Check WebSocket URL in `.env`:
   ```env
   VITE_WS_URL=ws://localhost:3001/ws
   ```

2. Verify dashboard-api WebSocket server is running:
   ```bash
   curl http://localhost:3001/health
   ```

3. Check browser console for WebSocket errors

4. Test WebSocket connection:
   ```javascript
   // In browser console
   const ws = new WebSocket('ws://localhost:3001/ws');
   ws.onopen = () => console.log('Connected');
   ws.onerror = (e) => console.error('Error', e);
   ```

**Solution:**
- Ensure dashboard-api is running
- Check firewall settings
- Verify CORS/WebSocket configuration on backend
- WebSocket will auto-reconnect with exponential backoff

### Data Not Updating

**Possible causes:**

1. **WebSocket disconnected**: Check connection indicator
2. **Polling fallback disabled**: WebSocket is primary, polling is fallback
3. **Backend not sending updates**: Check dashboard-api logs
4. **Cached data**: Clear localStorage in browser DevTools

**Force refresh:**
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Projector Display Too Small/Large

**Adjust viewport scaling:**

Edit `public/projector.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=0.6" />
```

Change `initial-scale` value:
- `0.6` = Default (60% zoom)
- `0.5` = Smaller (50% zoom)
- `0.8` = Larger (80% zoom)

Or adjust CSS in `src/styles/projector.css`:
```css
:root {
  --projector-scale: 0.6; /* Change this value */
}
```

### Time-based Gradient Not Updating (TV)

The TV background gradient updates every 5 minutes. If it seems stuck:

1. Check current time period (morning/afternoon/evening/night)
2. Verify transition windows (30 minutes before/after boundaries)
3. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

## License

Private
