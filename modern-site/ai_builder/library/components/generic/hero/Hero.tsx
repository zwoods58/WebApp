/**
 * Hero Component
 * Universal hero section for any website. Place at top of page.
 */

// Helper functions for Tailwind class names (must be full class names, not template literals)
function getPrimaryColorClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'teal-600': 'bg-teal-600',
    'blue-600': 'bg-blue-600',
    'purple-600': 'bg-purple-600',
    'indigo-600': 'bg-indigo-600',
    'pink-600': 'bg-pink-600',
    'red-600': 'bg-red-600',
    'green-600': 'bg-green-600',
    'orange-600': 'bg-orange-600',
  };
  return colorMap[color] || 'bg-teal-600';
}

function getPrimaryHoverClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'teal-600': 'hover:bg-teal-700',
    'blue-600': 'hover:bg-blue-700',
    'purple-600': 'hover:bg-purple-700',
    'indigo-600': 'hover:bg-indigo-700',
    'pink-600': 'hover:bg-pink-700',
    'red-600': 'hover:bg-red-700',
    'green-600': 'hover:bg-green-700',
    'orange-600': 'hover:bg-orange-700',
  };
  return colorMap[color] || 'hover:bg-teal-700';
}

function getPrimaryTextClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'teal-600': 'text-teal-600',
    'blue-600': 'text-blue-600',
    'purple-600': 'text-purple-600',
    'indigo-600': 'text-indigo-600',
    'pink-600': 'text-pink-600',
    'red-600': 'text-red-600',
    'green-600': 'text-green-600',
    'orange-600': 'text-orange-600',
  };
  return colorMap[color] || 'text-teal-600';
}

function getPrimaryBorderClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'teal-600': 'border-teal-600',
    'blue-600': 'border-blue-600',
    'purple-600': 'border-purple-600',
    'indigo-600': 'border-indigo-600',
    'pink-600': 'border-pink-600',
    'red-600': 'border-red-600',
    'green-600': 'border-green-600',
    'orange-600': 'border-orange-600',
  };
  return colorMap[color] || 'border-teal-600';
}

export interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  backgroundColor?: string;
  primaryColor?: string;
}

export default function Hero({
  heroTitle,
  heroSubtitle,
  ctaPrimaryText = "Get Started",
  ctaPrimaryLink = "#contact",
  ctaSecondaryText = "Learn More",
  ctaSecondaryLink = "#services",
  backgroundColor = "bg-gradient-to-br from-teal-50 to-blue-50",
  primaryColor = "teal-600",
}: HeroProps) {
  return (
    <section className={`${backgroundColor} py-20 px-4`}>
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {heroTitle}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaPrimaryLink}
            className={`${getPrimaryColorClass(primaryColor)} text-white px-8 py-4 rounded-lg text-lg font-semibold ${getPrimaryHoverClass(primaryColor)} transition shadow-lg`}
          >
            {ctaPrimaryText}
          </a>
          <a
            href={ctaSecondaryLink}
            className={`bg-white ${getPrimaryTextClass(primaryColor)} px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 ${getPrimaryBorderClass(primaryColor)}`}
          >
            {ctaSecondaryText}
          </a>
        </div>
      </div>
    </section>
  );
}

