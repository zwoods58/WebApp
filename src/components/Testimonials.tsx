'use client'

import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Williams',
    company: 'TechStart Inc.',
    role: 'CEO',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'AtarWebb transformed our business with their exceptional e-commerce platform. The team\'s attention to detail and commitment to quality is unmatched. Our sales increased by 150% in just 6 months.',
    contentKey: 'AtarWebb transformed our business with their exceptional e-commerce platform. The team\'s attention to detail and commitment to quality is unmatched. Our sales increased by 150% in just 6 months.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    company: 'DataFlow Systems',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'The dashboard they built for us is incredible. It\'s intuitive, fast, and has all the features we needed. The team was professional, responsive, and delivered on time. Highly recommended!',
    contentKey: 'The dashboard they built for us is incredible. It\'s intuitive, fast, and has all the features we needed. The team was professional, responsive, and delivered on time. Highly recommended!',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Chen',
    company: 'HealthCare Plus',
    role: 'Operations Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'Working with AtarWebb was a game-changer for our healthcare management system. They understood our compliance requirements and delivered a secure, scalable solution that our team loves to use.',
    contentKey: 'Working with AtarWebb was a game-changer for our healthcare management system. They understood our compliance requirements and delivered a secure, scalable solution that our team loves to use.',
    rating: 5
  },
  {
    id: 4,
    name: 'David Thompson',
    company: 'RetailMax',
    role: 'Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'The e-commerce website they developed for our retail business has been a huge success. Our customers love the user experience, and we\'ve seen a significant increase in online sales.',
    contentKey: 'The e-commerce website they developed for our retail business has been a huge success. Our customers love the user experience, and we\'ve seen a significant increase in online sales.',
    rating: 5
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    company: 'FinanceFirst',
    role: 'VP of Technology',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'Their expertise in financial applications is outstanding. They built us a robust platform that handles complex transactions securely and efficiently. The team\'s technical knowledge is impressive.',
    contentKey: 'Their expertise in financial applications is outstanding. They built us a robust platform that handles complex transactions securely and efficiently. The team\'s technical knowledge is impressive.',
    rating: 5
  },
  {
    id: 6,
    name: 'James Wilson',
    company: 'EduTech Solutions',
    role: 'Product Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    content: 'The learning management system they created has revolutionized how we deliver education. The platform is user-friendly, feature-rich, and scales beautifully with our growing user base.',
    contentKey: 'The learning management system they created has revolutionized how we deliver education. The platform is user-friendly, feature-rich, and scales beautifully with our growing user base.',
    rating: 5
  }
]

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="section-padding bg-primary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4" data-translate="What Our Clients Say">
            What Our Clients Say
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto" data-translate="Don't just take our word for it. Here's what our clients have to say about working with us.">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial */}
            <div className="card bg-white shadow-xl">
              <div className="p-8 md:p-12">
                <div className="flex justify-center mb-6">
                  <Quote className="h-12 w-12 text-primary-200" />
                </div>
                
                <blockquote className="text-lg md:text-xl text-secondary-700 text-center mb-8 leading-relaxed" data-translate={testimonials[currentTestimonial].contentKey}>
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {renderStars(testimonials[currentTestimonial].rating)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-secondary-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-secondary-600">
                        {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial
                      ? 'bg-primary-600'
                      : 'bg-secondary-300 hover:bg-secondary-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="card bg-white">
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                
                <blockquote className="text-secondary-700 text-center mb-4 text-sm leading-relaxed">
                  "{testimonial.content.length > 120 
                    ? `${testimonial.content.substring(0, 120)}...` 
                    : testimonial.content
                  }"
                </blockquote>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-secondary-900 text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-secondary-600 text-xs">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
