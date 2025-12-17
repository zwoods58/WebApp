/**
 * Inject SEO meta tags into generated HTML
 */

import { generateSEOHead, SEOData } from '../seo/generate-meta'

export function injectSEOIntoHTML(html: string, seoData: SEOData): string {
  // Generate SEO head section
  const seoHead = generateSEOHead(seoData)

  // Check if HTML has a <head> tag
  if (html.includes('<head>')) {
    // Insert SEO tags after <head> tag
    return html.replace('<head>', `<head>\n    ${seoHead}`)
  } else if (html.includes('<!DOCTYPE html>')) {
    // Insert <head> section after DOCTYPE if missing
    return html.replace(
      '<!DOCTYPE html>',
      `<!DOCTYPE html>\n<html lang="en">\n<head>\n    ${seoHead}\n  </head>\n<body>`
    ).replace('</body>', '</body>\n</html>')
  } else {
    // Prepend head section if no structure exists
    return `<!DOCTYPE html>
<html lang="en">
<head>
    ${seoHead}
  </head>
<body>
${html}
</body>
</html>`
  }
}

export function injectAnalyticsIntoHTML(html: string, googleAnalyticsId?: string): string {
  if (!googleAnalyticsId) {
    return html
  }

  const analyticsScript = `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsId}');
    </script>
  `.trim()

  // Insert before closing </head> tag
  if (html.includes('</head>')) {
    return html.replace('</head>', `    ${analyticsScript}\n  </head>`)
  } else if (html.includes('</body>')) {
    // Insert before closing </body> if no </head>
    return html.replace('</body>', `    ${analyticsScript}\n  </body>`)
  } else {
    // Append at end
    return `${html}\n${analyticsScript}`
  }
}

export function injectFormSubmissionIntoHTML(html: string, projectId?: string): string {
  // Find contact forms and add form submission handler
  const formSubmissionScript = `
    <script>
      // Form submission handler
      document.addEventListener('DOMContentLoaded', function() {
        const forms = document.querySelectorAll('form[data-contact-form]');
        forms.forEach(form => {
          form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
              const response = await fetch('/api/forms/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...data,
                  projectId: '${projectId || ''}'
                })
              });
              
              const result = await response.json();
              
              if (result.success) {
                form.innerHTML = '<div style="padding: 20px; text-align: center; color: green;"><h3>Thank you!</h3><p>Your message has been sent successfully.</p></div>';
              } else {
                alert('Error: ' + (result.message || 'Failed to submit form'));
              }
            } catch (error) {
              alert('Error submitting form. Please try again.');
            }
          });
        });
      });
    </script>
  `.trim()

  // Insert before closing </body> tag
  if (html.includes('</body>')) {
    return html.replace('</body>', `    ${formSubmissionScript}\n  </body>`)
  } else {
    return `${html}\n${formSubmissionScript}`
  }
}



