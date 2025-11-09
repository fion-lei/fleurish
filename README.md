# Fleurish Frontend

## Related Repositories

- [Backend](https://github.com/fion-lei/fleurish-backend)
- [Hardware/Processing](https://github.com/ryanwoong/fleurish-hardware)

## 🚀 Features

### Garden Management

- **Interactive Grid System**: Click tiles to plant and harvest crops
- **Inventory & Shop**: Browse available seeds, purchase plants, and manage your inventory
- **Land Expansion**: Buy additional plots using gems to grow your garden
- **Plant Lifecycle**: Watch your plants grow from seedlings to harvestable crops
- **Pixel Art Sprites**: Retro-style visuals with charming terrain and plant graphics

### Tasks & Progression

- **Personal Tasks**: Individual challenges to earn gems and coins
- **Community Tasks**: Collaborative goals that benefit your entire community
- **Task Tracking**: Monitor in-progress and completed tasks with detailed descriptions

### Community Features

- **Community Hub**: View active community tasks and member rankings in one place
- **Member Leaderboard**: See how you rank against others based on total wealth (coins + gems)
- **Global Leaderboard**: Compare communities worldwide by total points
- **Garden Visiting**: Explore other players' gardens for inspiration

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Authentication**: Secure login and registration system
- **Profile Management**: Track your stats, garden progress, and achievements
- **Real-time Updates**: Currency and task statuses update instantly

---

## 🏗️ Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) (with SSR support)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom pixel-art utilities
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API Integration**: RESTful backend communication

---

## 📁 Project Structure

```
fleurish/
├── app/
│   ├── api/
│   │   ├── gardens.ts              # Garden data API calls
│   │   └── users.ts                # User data API calls
│   ├── components/
│   │   ├── AuthContext.tsx         # Authentication state management
│   │   ├── AuthLayout.tsx          # Auth page wrapper
│   │   ├── GardenFooter.tsx        # Footer with currency display & navigation
│   │   ├── GardenGrid.tsx          # Interactive garden grid renderer
│   │   ├── InventoryPanel.tsx      # Inventory & shop interface
│   │   ├── Navbar.tsx              # Main navigation bar
│   │   ├── TaskList.tsx            # Task list display
│   │   ├── TaskDetails.tsx         # Task detail view
│   │   └── VisitGardenModal.tsx    # Garden visiting interface
│   ├── routes/
│   │   ├── app.tsx                 # Protected app layout
│   │   ├── garden.tsx              # Main garden page (plant, harvest, buy)
│   │   ├── my-tasks.tsx            # Personal tasks page
│   │   ├── community-tasks.tsx     # Community hub (tasks + members)
│   │   ├── leaderboard.tsx         # Global community leaderboard
│   │   ├── profile.tsx             # User profile page
│   │   ├── login.tsx               # Login page
│   │   └── register.tsx            # Registration page
│   ├── lib/
│   │   └── utils.ts                # Utility functions
│   ├── root.tsx                    # App root component
│   ├── routes.ts                   # Route configuration
│   └── app.css                     # Global styles & pixelation effects
├── public/
│   ├── images/                     # UI icons (coin, gem, backpack, etc.)
│   └── sprites/
│       ├── plants/                 # Plant sprite sheets
│       └── terrain/                # Terrain tiles (grass, dirt, etc.)
├── components.json                 # Shadcn/UI configuration
├── tailwind.config.js              # Tailwind customization
├── vite.config.ts                  # Vite configuration
└── package.json
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **pnpm**
- Access to the Fleurish backend API

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/fion-lei/fleurish.git
cd fleurish
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure environment variables**:

Create a `.env.local` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/
```

Replace with your backend API URL.

### Running the Application

**Development mode** (with hot reload):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Build for production**:

```bash
npm run build
```

**Preview production build**:

```bash
npm run preview
```

**Type checking**:

```bash
npm run typecheck
```
