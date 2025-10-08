import Image from 'next/image'

const teamMembers = [
  {
    name: 'John Smith',
    role: 'Lead Developer',
    bio: 'Full-stack developer with 8+ years of experience in React, Node.js, and cloud technologies.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Sarah Johnson',
    role: 'UI/UX Designer',
    bio: 'Creative designer passionate about creating intuitive and beautiful user experiences.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Mike Chen',
    role: 'Backend Developer',
    bio: 'Backend specialist focused on scalable architecture and database optimization.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    skills: ['Python', 'PostgreSQL', 'Docker', 'Kubernetes'],
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Emily Davis',
    role: 'Project Manager',
    bio: 'Experienced project manager ensuring smooth delivery and client satisfaction.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    skills: ['Agile', 'Scrum', 'Client Relations', 'Risk Management'],
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Alex Rodriguez',
    role: 'DevOps Engineer',
    bio: 'DevOps expert ensuring reliable deployment and monitoring of applications.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    skills: ['AWS', 'Docker', 'CI/CD', 'Monitoring'],
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Lisa Wang',
    role: 'Quality Assurance',
    bio: 'QA specialist ensuring the highest quality standards and bug-free delivery.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    skills: ['Testing', 'Automation', 'Bug Tracking', 'Performance Testing'],
    linkedin: '#',
    github: '#'
  }
]

export default function Team() {
  return (
    <section className="section-padding bg-secondary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Our talented team of developers, designers, and project managers work together to deliver exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="card group hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {member.name}
                </h3>
                
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                
                <p className="text-secondary-600 text-sm leading-relaxed mb-6">
                  {member.bio}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center space-x-4">
                  <a
                    href={member.linkedin}
                    className="text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href={member.github}
                    className="text-secondary-400 hover:text-primary-600 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-secondary-600 mb-6">
            Want to join our team? We're always looking for talented individuals.
          </p>
          <a href="/contact" className="btn-primary">
            View Open Positions
          </a>
        </div>
      </div>
    </section>
  )
}
