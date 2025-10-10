'use client'



export default function WhatWeDo() {
  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4" data-translate="What We Do">
            What We Do
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8" data-translate="We build digital solutions that drive business growth, enhance user experiences, and solve real-world problems through innovative technology.">
            We build digital solutions that drive business growth, enhance user experiences, 
            and solve real-world problems through innovative technology.
          </p>
          
          {/* Technology Stack Highlight */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4" data-translate="Powered by Modern Technology">Powered by Modern Technology</h3>
            <p className="text-lg text-white mb-4" data-translate="All our projects are built with Supabase backend for secure, scalable, and real-time data management, combined with the latest frontend frameworks for optimal performance.">
              All our projects are built with <strong>Supabase backend</strong> for secure, scalable, and real-time data management, 
              combined with the latest frontend frameworks for optimal performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium" data-translate="Supabase Backend">Supabase Backend</span>
              <span className="bg-green-600 text-white px-4 py-2 rounded-full font-medium" data-translate="React/Next.js">React/Next.js</span>
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium" data-translate="Real-time Database">Real-time Database</span>
              <span className="bg-orange-600 text-white px-4 py-2 rounded-full font-medium" data-translate="Secure Authentication">Secure Authentication</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}


