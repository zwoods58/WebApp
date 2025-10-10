# WebApp Solutions - Client Portal

A professional website for taking client requests for web applications, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### Frontend
- **Modern Design**: Professional, responsive design with Tailwind CSS
- **Portfolio Showcase**: Case studies and project examples
- **Services Pages**: Detailed information about offered services
- **Contact Form**: Project request form with comprehensive fields
- **About Us**: Company information and team details
- **Testimonials**: Client feedback and reviews

### Backend (Supabase)
- **PostgreSQL Database**: Managed by Supabase
- **CRM System**: Custom-built client and lead management
- **Analytics**: Website traffic and user behavior tracking
- **Project Management**: Task and deadline management system
- **Authentication**: Secure user login system
- **Real-time Updates**: Live data synchronization

### Business Features
- **Payment Processing**: Stripe integration for secure payments
- **Project Requests**: Automated lead capture and management
- **Client Portal**: Secure area for project updates
- **Analytics Dashboard**: Business insights and metrics

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webapp-client-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=WebApp Solutions
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL script from `src/lib/database.sql` in your Supabase SQL editor
   - This will create all necessary tables, indexes, and RLS policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **clients**: Client and lead information
- **projects**: Project management and tracking
- **tasks**: Individual project tasks
- **project_requests**: Contact form submissions
- **analytics**: Website usage tracking

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Hero section
│   ├── Services.tsx       # Services showcase
│   ├── Portfolio.tsx      # Portfolio/case studies
│   ├── About.tsx          # About us section
│   ├── Testimonials.tsx   # Client testimonials
│   └── Contact.tsx        # Contact form
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Authentication service
│   ├── analytics.ts       # Analytics tracking
│   ├── project-requests.ts # Project request handling
│   ├── stripe.ts          # Payment processing
│   └── database.sql       # Database schema
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Features Overview

### 1. Portfolio Showcase
- Case studies with project details
- Technology stack display
- Results and metrics
- Live demo and GitHub links

### 2. Services
- Comprehensive service offerings
- Feature lists for each service
- Professional descriptions
- Call-to-action buttons

### 3. Project Request Form
- Detailed form with project information
- Budget and timeline selection
- Requirements and description fields
- Automatic lead capture

### 4. CRM System
- Client management
- Lead tracking
- Project organization
- Task management

### 5. Analytics
- Page view tracking
- Form submission tracking
- User behavior analysis
- Business metrics

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Customization

### Branding
- Update company name in `src/components/Header.tsx`
- Modify colors in `tailwind.config.js`
- Replace logo and images
- Update contact information

### Content
- Edit portfolio projects in `src/components/Portfolio.tsx`
- Update services in `src/components/Services.tsx`
- Modify testimonials in `src/components/Testimonials.tsx`
- Customize about section in `src/components/About.tsx`

### Styling
- Modify `src/app/globals.css` for global styles
- Update component styles in individual files
- Adjust Tailwind configuration as needed

## Support

For support and questions:
- Email: hello@webappsolutions.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## License

This project is licensed under the MIT License - see the LICENSE file for details.
