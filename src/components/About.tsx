import { Award, Users, Clock, Target, CheckCircle } from 'lucide-react'

const stats = [
  { icon: Award, value: '50+', label: 'Projects Completed' },
  { icon: Users, value: '100+', label: 'Happy Clients' },
  { icon: Clock, value: '5+', label: 'Years Experience' },
  { icon: Target, value: '100%', label: 'Success Rate' }
]

const values = [
  {
    title: 'Quality First',
    description: 'We never compromise on quality. Every line of code is written with precision and attention to detail.'
  },
  {
    title: 'Client-Centric',
    description: 'Your success is our success. We work closely with you to understand your vision and bring it to life.'
  },
  {
    title: 'Innovation',
    description: 'We stay ahead of the curve with the latest technologies and best practices in web development.'
  },
  {
    title: 'Transparency',
    description: 'Clear communication and regular updates keep you informed throughout the entire development process.'
  }
]

const team = [
  {
    name: 'John Smith',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Sarah Johnson',
    role: 'UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Mike Chen',
    role: 'Backend Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Emily Davis',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
]

export default function About() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            About WebApp Solutions
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We are a team of passionate developers and designers dedicated to creating exceptional web applications that drive business growth.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-2">{stat.value}</div>
              <div className="text-secondary-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">Our Story</h3>
            <div className="space-y-4 text-secondary-600">
              <p>
                Founded in 2019, WebApp Solutions started as a small team of developers with a big vision: to create web applications that not only meet business requirements but exceed expectations.
              </p>
              <p>
                Over the years, we've grown into a full-service web development agency, helping businesses of all sizes transform their digital presence. Our commitment to quality, innovation, and client satisfaction has made us a trusted partner for companies worldwide.
              </p>
              <p>
                Today, we continue to push the boundaries of what's possible in web development, using cutting-edge technologies and best practices to deliver solutions that drive real business results.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our team working"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-secondary-900 mb-2">{value.title}</h4>
                <p className="text-secondary-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-2xl font-bold text-secondary-900 text-center mb-12">Meet Our Team</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-secondary-900 mb-1">{member.name}</h4>
                <p className="text-sm text-secondary-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
