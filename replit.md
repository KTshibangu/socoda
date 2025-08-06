# Overview

This is a full-stack web application designed for a Performing Rights Organization (P.R.O). The application manages song registrations, contributor royalty tracking, business license management, and usage reporting. It provides a comprehensive platform for composers, authors, vocalists, businesses, and administrators to interact with the music licensing ecosystem.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Language**: React with TypeScript, using Vite as the build tool and development server. The application follows a modern component-based architecture with functional components and hooks.

**Styling & UI Components**: TailwindCSS for styling with shadcn/ui component library built on Radix UI primitives. This provides a consistent design system with accessible, customizable components using CSS variables for theming.

**State Management**: React Query (@tanstack/react-query) for server state management, caching, and synchronization. Local component state is managed with React's built-in useState and useContext hooks.

**Routing**: Wouter for lightweight client-side routing, providing a simple alternative to React Router with a smaller bundle size.

**Form Handling**: React Hook Form with Zod validation for type-safe form validation and submission. This combination provides excellent developer experience with minimal re-renders.

## Backend Architecture

**Runtime & Framework**: Node.js with Express.js providing a RESTful API. The server uses TypeScript for type safety and better development experience.

**API Design**: RESTful endpoints following conventional HTTP methods and status codes. The API provides endpoints for dashboard statistics, works management, business licenses, usage reports, and royalty distributions.

**Authentication**: JWT (JSON Web Tokens) for stateless authentication with bcryptjs for password hashing. The system implements role-based access control with different permission levels.

**Data Validation**: Zod schemas shared between client and server for consistent validation across the full stack.

## Database Architecture

**ORM & Database**: Drizzle ORM with PostgreSQL, specifically configured for Neon serverless database. Drizzle provides type-safe database queries and excellent TypeScript integration.

**Schema Design**: The database schema includes users with role-based access (composer, author, vocalist, business, admin), works table for song registrations with ISWC/ISRC tracking, contributors table for percentage splits, business licenses for venue licensing, usage reports for tracking plays, and royalty distributions for payment tracking.

**Connection Management**: Uses @neondatabase/serverless with WebSocket support and connection pooling for optimal performance in serverless environments.

**Migrations**: Drizzle Kit handles schema migrations with the configuration pointing to ./migrations directory and shared schema definitions.

## External Dependencies

**UI Component Library**: Radix UI primitives providing unstyled, accessible components that are then styled with TailwindCSS through shadcn/ui.

**Database Provider**: Neon serverless PostgreSQL database with WebSocket connections for real-time capabilities.

**Development Tools**: Vite for fast development and building, with special Replit integration for the development environment including runtime error overlays and cartographer plugin.

**Validation Library**: Zod for runtime type validation shared between client and server, ensuring data integrity across the application boundary.

**Utility Libraries**: class-variance-authority for component variant management, clsx for conditional class name joining, and various Radix UI components for complex UI patterns like dialogs, dropdowns, and form elements.