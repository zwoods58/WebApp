/**
 * Testimonial Component
 * Display customer testimonials and reviews. Builds trust and social proof.
 */

export interface TestimonialItem {
  quote: string;
  name: string;
  rating?: number;
  position?: string;
  company?: string;
  photo?: string;
  initials?: string;
}

export interface TestimonialProps {
  sectionTitle?: string;
  sectionDescription?: string;
  testimonials: TestimonialItem[];
  columns?: string;
  showRating?: boolean;
  backgroundColor?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function Testimonial({
  sectionTitle = "What Our Clients Say",
  sectionDescription,
  testimonials,
  columns = "md:grid-cols-3",
  showRating = true,
  backgroundColor = "bg-teal-50",
}: TestimonialProps) {
  return (
    <section className={`py-20 px-4 ${backgroundColor}`}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          {sectionDescription && (
            <p className="text-xl text-gray-600">{sectionDescription}</p>
          )}
        </div>
        <div className={`grid ${columns} gap-8`}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
              {showRating && testimonial.rating && (
                <div className="flex items-center mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
              )}
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 font-bold">
                      {testimonial.initials || getInitials(testimonial.name)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  {testimonial.position && (
                    <p className="text-sm text-gray-600">
                      {testimonial.position}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

