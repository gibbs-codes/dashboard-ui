# Future Components TODO

## Missing Projector Canvas Components

These components were referenced in profiles but don't exist yet. Create them to enable the commented-out profiles (morning, focus, work).

### High Priority

| Component | Description | Data Required |
|-----------|-------------|---------------|
| `Calendar` | Full calendar view for left/right canvas | `calendar: true` |
| `Tasks` | Task list display | `tasks: true` |
| `NextEventLarge` | Large countdown to next calendar event | `nextEvent: true` |

### Medium Priority

| Component | Description | Data Required |
|-----------|-------------|---------------|
| `NextEventClock` | Clock with next event countdown | `nextEvent: true` |
| `ClockDate` | Clock with date display | None |
| `WeatherTransit` | Combined weather + transit view | `weather: true`, `transit: true` |
| `CalendarTasks` | Combined calendar + tasks view | `calendar: true`, `tasks: true` |

---

## Profiles to Re-enable

Once components are created, add these profiles back to `src/config/profiles.js`:

### Morning Profile
```javascript
morning: {
  id: 'morning',
  name: 'Morning Briefing',
  description: 'Complete morning briefing with schedule and tasks',
  data: {
    weather: true,
    transit: true,
    calendar: true,
    tasks: true,
    nextEvent: true,
  },
  displays: {
    tv: 'TVMorning',
    projector: {
      left: 'WeatherTransit',
      center: 'ClockDate',
      right: 'CalendarTasks',
    },
  },
},
```

### Focus Profile
```javascript
focus: {
  id: 'focus',
  name: 'Focus Mode',
  description: 'Minimal distraction - next event only',
  data: {
    weather: false,
    transit: false,
    calendar: false,
    tasks: false,
    nextEvent: true,
  },
  displays: {
    tv: 'TVFocus',
    projector: {
      left: 'ArtCanvas',
      center: 'NextEventLarge',
      right: 'ArtCanvas',
    },
  },
},
```

### Work Profile
```javascript
work: {
  id: 'work',
  name: 'Work Mode',
  description: 'Productivity mode with calendar and tasks',
  data: {
    weather: false,
    transit: false,
    calendar: true,
    tasks: true,
    nextEvent: true,
  },
  displays: {
    tv: 'TVArt',
    projector: {
      left: 'Calendar',
      center: 'NextEventClock',
      right: 'Tasks',
    },
  },
},
```

---

## Implementation Notes

1. All new components should be created in `src/components/projector/`
2. Add to `COMPONENT_MAP` in `src/layouts/ProjectorLayout.jsx`
3. Follow existing component patterns (see `TransitCanvas.jsx`, `ArtCanvas.jsx`)
4. Canvas dimensions are fixed:
   - Left: 415x1030px
   - Center: 535x803px
   - Right: 814x540px
