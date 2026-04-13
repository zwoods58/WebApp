import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { UnifiedAuthProvider } from '@/contexts/UnifiedAuthContext';
import { BusinessProfileProvider } from '@/contexts/BusinessProfileContext';
import { IndustryProvider } from '@/contexts/IndustryContext';
import { ToastProvider } from '@/providers/ToastProvider';
import LayoutWrapper from './LayoutWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ backgroundColor: '#1e3c72', margin: 0, padding: 0 }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        
        {/* CRITICAL: Set theme color to match background immediately */}
        <meta name="theme-color" content="#1e3c72" />
        <meta name="msapplication-navbutton-color" content="#1e3c72" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* CRITICAL: Inline CSS that executes before anything else */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset everything - no margins, no padding, no white background */
            * {
              margin: 0 !important;
              padding: 0 !important;
              box-sizing: border-box !important;
            }
            
            /* Force background color immediately - no white flash possible */
            html, body, #__next, #root, main, div:first-child {
              background: #1e3c72 !important;
              background-color: #1e3c72 !important;
              min-height: 100vh !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Completely hide any browser-generated splash elements */
            body::before,
            body::after,
            html::before,
            html::after,
            [class*="splash"],
            [class*="loading"],
            [class*="spinner"],
            [id*="splash"],
            [id*="loading"],
            [id*="spinner"],
            div[class*="load"],
            div[id*="load"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
              position: absolute !important;
              width: 0 !important;
              height: 0 !important;
              overflow: hidden !important;
            }
            
            /* Hide any white background elements */
            body > div:not(#__next):not(#root) {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
          `
        }} />
        
        {/* CRITICAL: JavaScript to remove any remaining splash elements */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Immediate execution - remove any splash before DOM is ready
              const destroyAllSplashElements = () => {
                // Remove by selectors
                const selectors = [
                  '.splash', '.loading', '.spinner',
                  '[class*="splash"]', '[class*="loading"]', '[class*="spinner"]',
                  '[id*="splash"]', '[id*="loading"]', '[id*="spinner"]',
                  '.native-splash', '.browser-splash', '.default-splash'
                ];
                
                selectors.forEach(selector => {
                  document.querySelectorAll(selector).forEach(el => {
                    if (el && el.parentNode) {
                      el.parentNode.removeChild(el);
                    }
                  });
                });
                
                // Remove any text nodes that might contain loading text
                const walker = document.createTreeWalker(
                  document.body,
                  NodeFilter.SHOW_TEXT,
                  {
                    acceptNode: function(node) {
                      if (node.textContent && 
                          (node.textContent.toLowerCase().includes('loading') ||
                           node.textContent.toLowerCase().includes('splash'))) {
                        return NodeFilter.FILTER_ACCEPT;
                      }
                      return NodeFilter.FILTER_REJECT;
                    }
                  }
                );
                
                while(walker.nextNode()) {
                  const node = walker.currentNode;
                  if (node.parentNode) {
                    node.parentNode.removeChild(node);
                  }
                }
              };
              
              // Run immediately
              if (document.body) {
                destroyAllSplashElements();
              }
              
              // Run again when DOM is ready
              document.addEventListener('DOMContentLoaded', destroyAllSplashElements);
              
              // Run again after load
              window.addEventListener('load', destroyAllSplashElements);
              
              // Mutation observer to catch dynamically added splash elements
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.addedNodes.length) {
                    destroyAllSplashElements();
                  }
                });
              });
              
              if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
              }
              
              // Stop observing after 2 seconds (splash would have shown by then)
              setTimeout(function() {
                observer.disconnect();
              }, 2000);
            })();
          `
        }} />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#1e3c72' }}>
        <QueryProvider>
          <UnifiedAuthProvider>
            <BusinessProfileProvider>
              <IndustryProvider>
                <ToastProvider>
                  <LayoutWrapper>
                    {children}
                  </LayoutWrapper>
                </ToastProvider>
              </IndustryProvider>
            </BusinessProfileProvider>
          </UnifiedAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
