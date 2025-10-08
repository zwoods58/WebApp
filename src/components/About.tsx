import { Heart, Target, Code, Shield } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Passion-Driven Excellence',
    description: 'We genuinely love what we do. Every project is approached with enthusiasm and a commitment to creating something exceptional that we can be proud of.',
    color: 'from-red-500 to-pink-600'
  },
  {
    icon: Target,
    title: 'Results-Focused',
    description: 'We measure success by the impact we create. Every decision is made with your business goals in mind, ensuring our solutions drive real value.',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Code,
    title: 'Technical Integrity',
    description: 'We write clean, maintainable code that stands the test of time. Our solutions are built to scale and adapt as your business grows.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Shield,
    title: 'Reliable Partnership',
    description: 'We believe in long-term relationships. Our commitment extends beyond project delivery to continuous improvement and quality work.',
    color: 'from-purple-500 to-indigo-600'
  }
]

const mission = {
  title: 'Our Mission',
  description: 'To provide professional websites that maintain budget-friendly pricing and fast turnaround times, with a laser focus on empowering small to medium companies to compete in the digital marketplace.',
  impact: 'We believe that every small business owner should have the opportunity to establish a powerful digital presence without breaking the bank or waiting months for results. Your success is our success.'
}

const approach = [
  {
    step: '01',
    title: 'Deep Understanding',
    description: 'We start by immersing ourselves in your business context, challenges, and goals to ensure our solutions align perfectly with your needs.'
  },
  {
    step: '02',
    title: 'Strategic Planning',
    description: 'Every project begins with a comprehensive strategy that balances technical excellence with business objectives and user experience.'
  },
  {
    step: '03',
    title: 'Collaborative Development',
    description: 'We work as an extension of your team, maintaining transparent communication and involving you in key decisions throughout the process.'
  },
  {
    step: '04',
    title: 'Continuous Optimization',
    description: 'Our relationship doesn\'t end at launch. We provide continuous optimization to ensure your solution continues to deliver value.'
  }
]


export default function About() {
  return (
    <section className="section-padding">
      <div className="container-max">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-6 font-tech" data-translate="About AtarWebb">
            About AtarWebb
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed" data-translate="We are independent developers who came together with a shared vision: to empower everyday business owners with the digital tools they need to thrive in today's world. Born from the belief that every entrepreneur deserves access to professional web solutions, we've built a collective that transforms small dreams into big digital footprints.">
            We are independent developers who came together with a shared vision: to empower everyday business owners 
            with the digital tools they need to thrive in today's world. Born from the belief that every entrepreneur 
            deserves access to professional web solutions, we've built a collective that transforms small dreams into 
            big digital footprints.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-12 mb-20 animate-fade-in-scale">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6" data-translate="Our Mission">{mission.title}</h3>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed" data-translate="To provide professional websites that maintain budget-friendly pricing and fast turnaround times, with a laser focus on empowering small to medium companies to compete in the digital marketplace.">
              {mission.description}
            </p>
            <p className="text-base text-gray-400 italic" data-translate="We believe that every small business owner should have the opportunity to establish a powerful digital presence without breaking the bank or waiting months for results. Your success is our success.">
              {mission.impact}
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12 animate-fade-in-up" data-translate="Our Values">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-left" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-4" data-translate={value.title}>{value.title}</h4>
                  <p className="text-gray-400 leading-relaxed" data-translate={value.description}>{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Our Approach Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12 font-tech animate-fade-in-up" data-translate="Our Approach">Our Approach</h3>
          <div className="space-y-8">
            {approach.map((step, index) => (
              <div key={index} className="flex items-start gap-6 animate-fade-in-right" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-3 font-tech" data-translate={step.title}>{step.title}</h4>
                  <p className="text-white leading-relaxed" data-translate={step.description}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
