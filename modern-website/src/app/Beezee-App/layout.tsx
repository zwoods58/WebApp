import { metadata } from './metadata';
import BeezeeLayoutClient from './layout-client';

// Inline critical CSS for faster initial render
const criticalCSS = `
  .loader {
    width: 32px;
    height: 32px;
    border: 4px solid #e2e8f0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .min-h-screen { min-height: 100vh; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
  .from-blue-50 { --tw-gradient-from: #eff6ff; --tw-gradient-to: rgb(239 246 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
  .to-white { --tw-gradient-to: #ffffff; }
`;

export default function BeezeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </head>
      <body>
        <BeezeeLayoutClient>{children}</BeezeeLayoutClient>
      </body>
    </html>
  );
}

export { metadata };
