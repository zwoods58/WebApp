/**
 * Header Component
 * Site navigation header with logo and menu items.
 */

// Helper functions for Tailwind class names
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

function getPrimaryTextHoverClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'teal-600': 'hover:text-teal-600',
    'blue-600': 'hover:text-blue-600',
    'purple-600': 'hover:text-purple-600',
    'indigo-600': 'hover:text-indigo-600',
    'pink-600': 'hover:text-pink-600',
    'red-600': 'hover:text-red-600',
    'green-600': 'hover:text-green-600',
    'orange-600': 'hover:text-orange-600',
  };
  return colorMap[color] || 'hover:text-teal-600';
}

export interface HeaderProps {
  businessName: string;
  logoUrl?: string;
  navItems?: Array<{
    label: string;
    href: string;
  }>;
  ctaText?: string;
  ctaLink?: string;
  primaryColor?: string;
}

export default function Header({
  businessName,
  logoUrl,
  navItems = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  ctaText = "Get Started",
  ctaLink = "#contact",
  primaryColor = "teal-600",
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-8 w-8" />
          ) : null}
          <a href="/" className="text-2xl font-bold text-gray-900">
            {businessName}
          </a>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`text-gray-700 ${getPrimaryTextHoverClass(primaryColor)} transition`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={ctaLink}
            className={`${getPrimaryColorClass(primaryColor)} text-white px-6 py-2 rounded-lg ${getPrimaryHoverClass(primaryColor)} transition`}
          >
            {ctaText}
          </a>
        </div>
        <button className="md:hidden text-gray-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}

