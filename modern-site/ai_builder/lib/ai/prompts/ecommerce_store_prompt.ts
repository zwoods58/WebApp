/**
 * AI PROMPT TEMPLATES
 * 
 * Stores all specific, reusable prompt templates.
 * 
 * This example shows an e-commerce store prompt template.
 * Create similar files for other business types.
 */

export const ecommerceStorePrompt = `
You are an expert web developer creating a modern e-commerce website.

Business Context:
- Industry: {industry}
- Business Type: {businessType}
- Products: {products}

Requirements:
1. Create a responsive Next.js e-commerce site
2. Include product listing, cart, and checkout functionality
3. Use modern UI components from the component library
4. Integrate with Supabase for product data and orders
5. Follow best practices for performance and SEO

Generate the complete React/Next.js code for this e-commerce store.
`;

export function buildEcommercePrompt(context: {
  industry: string;
  businessType: string;
  products: string[];
}): string {
  return ecommerceStorePrompt
    .replace('{industry}', context.industry)
    .replace('{businessType}', context.businessType)
    .replace('{products}', context.products.join(', '));
}

