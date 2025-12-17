/**
 * Pricing Component
 * Display pricing plans for services or products.
 */

// Helper functions for Tailwind class names
function getPrimaryColorClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'blue-600': 'bg-blue-600',
    'teal-600': 'bg-teal-600',
    'purple-600': 'bg-purple-600',
    'indigo-600': 'bg-indigo-600',
    'pink-600': 'bg-pink-600',
    'red-600': 'bg-red-600',
    'green-600': 'bg-green-600',
    'orange-600': 'bg-orange-600',
  };
  return colorMap[color] || 'bg-blue-600';
}

function getPrimaryBorderClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    'blue-600': 'border-blue-600',
    'teal-600': 'border-teal-600',
    'purple-600': 'border-purple-600',
    'indigo-600': 'border-indigo-600',
    'pink-600': 'border-pink-600',
    'red-600': 'border-red-600',
    'green-600': 'border-green-600',
    'orange-600': 'border-orange-600',
  };
  return colorMap[color] || 'border-blue-600';
}

export interface PricingPlan {
  planName: string;
  price: string;
  billingPeriod?: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
}

export interface PricingProps {
  sectionTitle?: string;
  plans: PricingPlan[];
  primaryColor?: string;
}

export default function Pricing({
  sectionTitle = "Pricing Plans",
  plans,
  primaryColor = "blue-600",
}: PricingProps) {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-xl shadow-lg ${
                plan.isPopular
                  ? `border-2 ${getPrimaryBorderClass(primaryColor)} relative`
                  : "border border-gray-200"
              }`}
            >
              {plan.isPopular && (
                <div
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${getPrimaryColorClass(primaryColor)} text-white px-4 py-1 rounded-full text-sm font-semibold`}
                >
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {plan.planName}
              </h3>
              {plan.description && (
                <p className="text-gray-600 mb-6">{plan.description}</p>
              )}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                {plan.billingPeriod && (
                  <span className="text-gray-600">/{plan.billingPeriod}</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block w-full text-center ${
                  plan.isPopular
                    ? `${getPrimaryColorClass(primaryColor)} text-white`
                    : "bg-gray-900 text-white"
                } px-6 py-3 rounded-lg hover:opacity-90 transition font-semibold`}
              >
                {plan.ctaText || "Get Started"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

