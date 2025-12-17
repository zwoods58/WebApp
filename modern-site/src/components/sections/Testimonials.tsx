'use client'

import { TestimonialsColumn } from '../ui/testimonials-columns-1'
import { motion } from 'motion/react'

const testimonials = [
  {
    text: "AtarWebb delivered exactly what we needed—a beautiful website that actually brings in customers. Worth every penny.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop&q=80",
    name: "Sarah Martinez",
    role: "Owner, Martinez Bakery",
  },
  {
    text: "I was shocked at how fast they built our site. Professional, responsive, and incredibly easy to work with. Highly recommend!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&q=80",
    name: "David Chen",
    role: "Owner, Chen's Auto Repair",
  },
  {
    text: "Finally, a web company that understands small businesses. No jargon, no upsells—just honest work at honest prices.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&q=80",
    name: "Emily Rodriguez",
    role: "Partner, Rodriguez Law Firm",
  },
  {
    text: "The website they built for us has increased our online bookings by 300%. The investment paid for itself in the first month.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&q=80",
    name: "Michael Thompson",
    role: "Manager, Green Landscaping",
  },
  {
    text: "AtarWebb made the entire process stress-free. They listened to our needs and delivered beyond our expectations.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=500&fit=crop&q=80",
    name: "Lisa Anderson",
    role: "Founder, Fitness Studio",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop&q=80",
    name: "James Wilson",
    role: "Business Owner",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop&q=80",
    name: "Robert Brown",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop&q=80",
    name: "Jennifer Davis",
    role: "Sales Manager",
  },
  {
    text: "Using AtarWebb, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop&q=80",
    name: "Thomas Miller",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function Testimonials() {
  return (
    <section className="bg-background my-20 relative" style={{
      background: 'linear-gradient(to bottom, white 0%, #f8f9fa 100%)',
      paddingTop: '80px',
      paddingBottom: '80px',
    }}>
      <div className="container z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
              </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
      </div>
    </section>
  );
}
