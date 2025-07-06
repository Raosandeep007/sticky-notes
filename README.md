# Sticky Notes

A modern, feature-rich sticky notes application with infinite canvas, multi-user support, and beautiful animations. Built with React Router v7, Airstate, and shadcn/ui.

## Features Overview

### Infinite Canvas

- **Pan & Zoom:** Mouse wheel, trackpad, or touch gestures
- **Momentum:** Natural scrolling with physics-based momentum
- **Grid System:** Dynamic grid that scales with zoom level
- **Minimap:** Interactive overview for easy navigation
- **Mobile Support:** Pinch-to-zoom and touch panning

### Note Management

- **Create Notes:** Click anywhere on canvas or use "Add Note" button
- **Edit Text:** Click on any note to start typing
- **Change Colors:** Use the color palette in note headers
- **Move Notes:** Drag notes around with smooth animations
- **Delete Notes:** Click trash icon or use "Clear All"
- **Random Colors:** Toggle between fixed and random note colors
- **Search & filter** - Find notes quickly in the notes list
- **Focus navigation** - Click notes in list to pan/zoom to them

### Navigation & UI

- **Dynamic Routing:** Each canvas has a unique shareable URL (`/:id`)
- **Settings Panel:** Customize app behavior and preferences
- **Notes List:** Search, filter, and navigate to specific notes
- **Share Button:** Copy current canvas URL to clipboard
- **Responsive:** Works perfectly on all device sizes

### Real-time Features

- **Live Sync:** Changes appear instantly across all connected clients
- **Collaborative:** Multiple users can work simultaneously
- **Persistent:** Notes are automatically saved

### � **Developer Experience**

- **TypeScript** - Full type safety throughout
- **Modular architecture** - Clean, maintainable codebase
- **Custom hooks** - Reusable logic for canvas, notes, and user management
- **SPA deployment** - Optimized for Vercel and static hosting

## 🛠 Tech Stack

- **React Router v7** - Modern React framework with SPA mode
- **Airstate** - Real-time state synchronization
- **Framer Motion** - Smooth animations and physics
- **shadcn/ui** - Beautiful and accessible UI components
- **Sonner** - Elegant toast notifications
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **TypeScript** - Type safety and better DX
- **Vite** - Fast development and build tooling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Raosandeep007/sticky-notes.git
cd sticky-notes
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Your application will be available at `http://localhost:5173`.

## 📦 Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

This app is optimized for Vercel deployment in SPA mode:

1. **Automatic Deployment:**

   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically deploy your app

2. **Manual Deployment:**

   ```bash
   npm install -g vercel
   vercel
   ```

### Environment Variables

No environment variables are required for basic functionality. All configuration is included in the codebase.

## ⚙️ Configuration

The app is configured with the following key files:

- `vercel.json` - Vercel deployment configuration (SPA mode)
- `react-router.config.ts` - React Router configuration with SPA enabled
- `vite.config.ts` - Vite build configuration
- `components.json` - shadcn/ui configuration

## 📁 Project Structure

```
app/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── textarea.tsx
│   │   └── sonner.tsx         # Toast notifications
│   └── sticky-board/          # Main application components
│       ├── sticky-board.tsx   # Main app component
│       ├── header.tsx         # App header with controls
│       ├── note.tsx          # Individual sticky note
│       ├── canvas-controls.tsx # Zoom/pan controls
│       ├── minimap.tsx       # Canvas minimap
│       ├── settings-page.tsx  # Settings panel
│       ├── notes-list-page.tsx # Notes list drawer
│       ├── user-manager.tsx   # User authentication
│       ├── canvas-switcher.tsx # Canvas management
│       ├── drawer.tsx         # Reusable drawer component
│       ├── loading-state.tsx  # Beautiful loading screen
│       └── hooks/             # Custom hooks
│           ├── use-note-management.ts
│           ├── use-canvas-management.ts
│           ├── use-canvas-transform.ts
│           ├── use-drag-management.ts
│           ├── use-event-handlers.ts
│           ├── use-settings.ts
│           ├── use-user.ts
│           └── use-device.ts
├── routes/
│   ├── home.tsx              # Home route (redirects to random ID)
│   └── $id.tsx              # Dynamic route for each canvas
├── hooks/
│   └── use-crypto-id.ts      # ID generation utilities
├── lib/
│   └── utils.ts              # Utility functions
└── root.tsx                  # App root with providers

config/
└── airstate.ts               # Airstate configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💬 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using React Router v7.
