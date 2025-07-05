# Sticky Notes

A beautiful, real-time collaborative sticky notes application built with React Router, Airstate, and shadcn/ui.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/sticky-notes)

## Features

- 🚀 **Real-time Collaboration** - Multiple users can create and edit notes simultaneously
- 🎨 **Beautiful UI** - Modern design with shadcn/ui components and Lucide icons
- 🖱️ **Drag & Drop** - Intuitive note positioning with smooth animations
- 🎨 **Color Palettes** - 8 beautiful color schemes for organizing notes
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡️ **Server-side Rendering** - Fast initial page loads
- 🔒 **TypeScript** - Full type safety throughout the application

## Tech Stack

- **React Router 7** - Full-stack React framework with SSR
- **Airstate** - Real-time state synchronization
- **shadcn/ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **TypeScript** - Type safety and better DX

## Getting Started

### Prerequisites

- Node.js 18+
- yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/sticky-notes.git
cd sticky-notes
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy your app is to use [Vercel](https://vercel.com/):

1. **Automatic Deployment:**

   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically deploy your app

2. **Manual Deployment:**

   ```bash
   yarn global add vercel
   vercel
   ```

3. **Using the Deploy Button:**
   - Click the "Deploy with Vercel" button above
   - Connect your GitHub account
   - Your app will be deployed automatically

### Environment Variables

No environment variables are required for basic functionality. The Airstate configuration is included in the codebase.

### Custom Domain

To use a custom domain with Vercel:

1. Go to your project settings in Vercel dashboard
2. Navigate to "Domains"
3. Add your custom domain

## Configuration

The app is configured with the following key files:

- `vercel.json` - Vercel deployment configuration
- `react-router.config.ts` - React Router configuration with SSR enabled
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Project Structure

```
app/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── sticky-notes/       # Sticky notes components
│       ├── StickyNotesApp.tsx
│       ├── StickyNotesHeader.tsx
│       ├── StickyNote.tsx
│       └── EmptyState.tsx
├── routes/
│   └── home.tsx           # Main application route
├── lib/
│   └── utils.ts           # Utility functions
└── root.tsx               # App root with Airstate config

config/
└── airstate.ts            # Airstate configuration
```

## Features Overview

### Real-time Collaboration

- Multiple users can simultaneously create, edit, and move sticky notes
- Changes are instantly synchronized across all connected clients
- No signup required - just share the URL

### Note Management

- **Create Notes:** Click "Add Note" or the empty state button
- **Edit Text:** Click on any note to start typing
- **Change Colors:** Use the color palette in each note header
- **Move Notes:** Drag notes around the canvas
- **Delete Notes:** Click the trash icon on individual notes
- **Clear All:** Remove all notes with the "Clear All" button

### Responsive Design

- Optimized for desktop and mobile devices
- Touch-friendly interface on mobile
- Smooth animations and transitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or need help, please open an issue on GitHub.

## Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t sticky-notes .

# Run the container
docker run -p 3000:3000 sticky-notes
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `yarn build`

```
├── package.json
├── yarn.lock
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
