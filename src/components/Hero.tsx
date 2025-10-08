import { CheckCircle, Shield, Target, Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start lg:items-center" style={{ minHeight: 'calc(100vh - 5rem)' }}>
          
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-fade-in-up">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <span data-translate="Professional Web Development">Professional Web Development</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-400 leading-tight font-tech animate-fade-in-up animate-delay-100">
                <span data-translate="Build Your">Build Your</span>
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" data-translate="Digital Future">
                  Digital Future
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg animate-fade-in-up animate-delay-200" data-translate="Transform your business with custom web applications. Professional development services including React, Next.js, and full-stack solutions.">
                We create high-performance web applications using cutting-edge technologies. 
                Fast, secure, and scalable solutions for your business.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 animate-fade-in-up animate-delay-300">
              <div className="px-3 py-1 bg-slate-800/50 border border-blue-500/30 rounded-full text-sm text-blue-400 hover:scale-105 hover:bg-blue-500/20 transition-all duration-300">
                React
              </div>
              <div className="px-3 py-1 bg-slate-800/50 border border-blue-500/30 rounded-full text-sm text-blue-400 hover:scale-105 hover:bg-blue-500/20 transition-all duration-300">
                Next.js
              </div>
              <div className="px-3 py-1 bg-slate-800/50 border border-blue-500/30 rounded-full text-sm text-blue-400 hover:scale-105 hover:bg-blue-500/20 transition-all duration-300">
                TypeScript
              </div>
              <div className="px-3 py-1 bg-slate-800/50 border border-blue-500/30 rounded-full text-sm text-blue-400 hover:scale-105 hover:bg-blue-500/20 transition-all duration-300">
                WebGL
              </div>
              <div className="px-3 py-1 bg-slate-800/50 border border-blue-500/30 rounded-full text-sm text-blue-400 hover:scale-105 hover:bg-blue-500/20 transition-all duration-300">
                Three.js
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-400">
              <button className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25" data-translate="Start Your Project">
                Start Your Project
              </button>
              <button className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25" data-translate="View Portfolio">
                View Portfolio
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 animate-fade-in-up animate-delay-500">
              <div className="text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-gray-400">50+</div>
                <div className="text-sm text-gray-400" data-translate="Projects">Projects</div>
              </div>
              <div className="text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-gray-400">100%</div>
                <div className="text-sm text-gray-400" data-translate="Success Rate">Success Rate</div>
              </div>
              <div className="text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-gray-400">100%</div>
                <div className="text-sm text-gray-400" data-translate="Quality">Quality</div>
              </div>
              <div className="text-center hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-gray-400">5★</div>
                <div className="text-sm text-gray-400" data-translate="Rating">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative lg:mt-8 animate-fade-in-right">
            <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-400">index.tsx</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-mono text-sm">const</span>
                  <span className="text-gray-400 font-mono text-sm">App</span>
                  <span className="text-gray-400 font-mono text-sm">= () =&gt; {`{`}</span>
                </div>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-mono text-sm">return</span>
                    <span className="text-gray-400 font-mono text-sm">(</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="text-gray-400 font-mono text-sm">&lt;div className=&quot;hero&quot;&gt;</div>
                    <div className="ml-4 text-gray-400 font-mono text-sm">
                      &lt;h1&gt;Your Dream App&lt;/h1&gt;
                    </div>
                    <div className="text-gray-400 font-mono text-sm">&lt;/div&gt;</div>
                  </div>
                  <div className="text-gray-400 font-mono text-sm">);</div>
                </div>
                <div className="text-gray-400 font-mono text-sm">&#125;;</div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400" data-translate="Lightning Fast Performance">Lightning Fast Performance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400" data-translate="Scalable Architecture">Scalable Architecture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400" data-translate="Mobile Responsive">Mobile Responsive</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Rocket className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400" data-translate="SEO Optimized">SEO Optimized</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div className="absolute top-1/2 -left-6 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center animate-ping">
              <Rocket className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}