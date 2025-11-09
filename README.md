# Fleurish Frontend

A React + TypeScript + Tailwind CSS frontend with an organized app structure.

## Links

- Backend repository: [`fleurish-backend`](https://github.com/fion-lei/fleurish-backend)
- Hardware repository: [`fleurish-hardware`](https://github.com/ryanwoong/fleurish-hardware)

## Project Structure

```
fleurish/
├── app/
│   ├── api/
│   │   └── gardens.ts                 # Typed API client
│   ├── components/
│   │   ├── GardenFooter.tsx           # Footer with currency/backpack/community
│   │   ├── GardenGrid.tsx             # Grid rendering, tile sizing, plant logic
│   │   ├── InventoryPanel.tsx         # Inventory & Shop (hover to Select/Buy/Sell)
│   │   └── VisitGardenModal.tsx       # Visit another garden, search/filter
│   ├── routes/
│   │   ├── garden.tsx                 # Main garden page and state
│   │   └── my-tasks.tsx               # Example route (tasks page)
│   └── app.css                        # Global styles, pixelation
├── public/
│   └── sprites/                       # Terrain/plant sprite assets
├── .gitignore
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables for API access (example for Vite):
```bash
# .env.local
VITE_API_BASE_URL=https://api.fleurish.app
```

### Running the Application

Development (fast refresh):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Local preview of production build:
```bash
npm run preview
```

## Example Usage

1. Run `npm run dev` and open the app in your browser.
2. Go to `/garden`.
3. Open the inventory (backpack) and hover items to Select/Buy/Sell.
4. Click the community icon to visit another user’s garden; click “Return Home” to go back.

## License

ISC
