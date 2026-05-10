# RUET Medical Frontend

This is the frontend application for the RUET Medical Center, built with modern web technologies. It provides an intuitive interface for students, medical staff, and administration to manage appointments, access medical records, and oversee center operations.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ✨ Key Features

- **Public Patient Portal**: A modern, responsive landing page providing public access to center information, available doctors, medical staff profiles, and available medical tests.
- **Appointment Booking System**: Allows students and patients to browse available doctors, seamlessly request appointments, and track the status of their requests (accepted/rejected).
- **Interactive Dashboards**: Role-specific dashboards (e.g., Student Dashboard) for personalized experiences and quick access to medical history and scheduled appointments.
- **Modern User Interface**: Designed with a sleek, vibrant layout using Tailwind CSS, featuring smooth navigation and micro-animations for an engaging user experience.
- **Secure Authentication**: Dedicated login routes separating the public frontend from secure dashboard areas.

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd ruet-medical-frontend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

The compiled assets will be placed in the `dist` directory. To preview the production build locally:

```bash
npm run preview
```

## 🏗️ Project Architecture

The project follows a modular, scalable architecture within the `src/` directory:

- **`assets/`**: Static files including images, icons, and global stylesheets (`index.css`).
- **`components/`**: Reusable, presentation-level UI components shared across the application.
- **`data/`**: Static and mock data definitions used for configuration and testing.
- **`features/`**: Domain-specific modules grouping logic, components, and state related to specific features (e.g., authentication, appointments).
- **`hooks/`**: Custom React hooks encapsulating reusable UI logic and side-effects.
- **`layouts/`**: High-level structural wrappers (e.g., PublicLayout, DashboardLayout) defining the UI shell for different application areas.
- **`pages/`**: Main route-level components that assemble features and layouts to render specific views.
- **`services/`**: API integration layer for communicating with backend endpoints.
- **`store/`**: Global state management implementations using Zustand.
- **`types/`**: Global TypeScript interfaces and type definitions ensuring robust type safety.
- **`App.tsx` & `main.tsx`**: Application entry points and top-level routing setup.

## 📝 Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles TypeScript and builds the application for production.
- `npm run lint`: Runs ESLint to find and fix styling/syntax issues.
- `npm run preview`: Previews the production build locally.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
