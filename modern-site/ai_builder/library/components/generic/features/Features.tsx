/**
 * Features Component
 * Display features, services, or benefits in a grid layout. Universal block for any industry.
 */

// Helper functions for Tailwind class names
function getPrimaryColorClass(color: string): string {
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

function getPrimaryHoverClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'teal-600': 'hover:text-teal-700',
    'blue-600': 'hover:text-blue-700',
    'purple-600': 'hover:text-purple-700',
    'indigo-600': 'hover:text-indigo-700',
    'pink-600': 'hover:text-pink-700',
    'red-600': 'hover:text-red-700',
    'green-600': 'hover:text-green-700',
    'orange-600': 'hover:text-orange-700',
  };
  return colorMap[color] || 'hover:text-teal-700';
}

function getPrimaryBgLightClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'teal-600': 'bg-teal-100',
    'blue-600': 'bg-blue-100',
    'purple-600': 'bg-purple-100',
    'indigo-600': 'bg-indigo-100',
    'pink-600': 'bg-pink-100',
    'red-600': 'bg-red-100',
    'green-600': 'bg-green-100',
    'orange-600': 'bg-orange-100',
  };
  return colorMap[color] || 'bg-teal-100';
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  link?: string;
}

export interface FeaturesProps {
  sectionTitle?: string;
  sectionDescription?: string;
  features: FeatureItem[];
  columns?: string;
  primaryColor?: string;
}

export default function Features({
  sectionTitle = "Our Services",
  sectionDescription,
  features,
  columns = "md:grid-cols-3",
  primaryColor = "teal-600",
}: FeaturesProps) {
  const defaultIcon = (
    <svg
      className={`w-8 h-8 ${getPrimaryColorClass(primaryColor)}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {sectionDescription}
            </p>
          )}
        </div>
        <div className={`grid ${columns} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition"
            >
              {feature.image ? (
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-16 h-16 rounded-lg mb-6 object-cover"
                />
              ) : (
                <div
                  className={`w-16 h-16 ${getPrimaryBgLightClass(primaryColor)} rounded-lg flex items-center justify-center mb-6`}
                >
                  {feature.icon || defaultIcon}
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              {feature.link && (
                <a
                  href={feature.link}
                  className={`${getPrimaryColorClass(primaryColor)} ${getPrimaryHoverClass(primaryColor)} font-semibold`}
                >
                  Learn More →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

