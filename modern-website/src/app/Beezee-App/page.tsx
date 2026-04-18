import { redirect } from 'next/navigation';

// Server-side redirect — no client-side JS needed
// This ensures PWA users hitting /Beezee-App always get redirected
// to the Get Started page, even before React hydration
export default function BeezeeAppRoot() {
  redirect('/Beezee-App/auth/get-started');
}
