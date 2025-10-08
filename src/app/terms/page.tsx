import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - AtarWebb',
  description: 'Terms of Service for AtarWebb professional web development services.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using AtarWebb's services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our web development services, website, and any related services provided by AtarWebb.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services Description</h2>
              <p className="text-gray-700 mb-4">
                AtarWebb provides professional web development services including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Custom website design and development (starting at $150)</li>
                <li>E-commerce integration and solutions</li>
                <li>API development and integration</li>
                <li>SEO optimization and performance tuning</li>
                <li>Domain and hosting setup</li>
                <li>SSL certificate setup</li>
                <li>Basic analytics integration</li>
                <li>12 months free support for all projects</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We serve various industries including E-commerce, Healthcare, Education, Real Estate, Restaurants, Professional Services, Non-Profit, and Technology sectors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Project Terms and Conditions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">3.1 Project Scope</h3>
                  <p className="text-gray-700">
                    All project details, deliverables, timelines, and pricing will be clearly defined in a written agreement or proposal before work begins. Any changes to the project scope must be agreed upon in writing by both parties.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">3.2 Payment Terms</h3>
                  <p className="text-gray-700">
                    Payment terms will be specified in your project agreement. Our service plans start at $150 for Basic Launchpad, $250 for Standard Optimizer, and $600 for Premium Accelerator. We require a deposit before work begins, with the remaining balance due upon project completion. All prices are in USD unless otherwise specified.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">3.3 Timeline</h3>
                  <p className="text-gray-700">
                    Our standard project timeline is 7 days for most web development projects. Project timelines are estimates based on the scope of work and client responsiveness. Delays in client feedback or content provision may extend project timelines accordingly.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Client Responsibilities</h2>
              <p className="text-gray-700 mb-4">As our client, you agree to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate and complete information necessary for project completion</li>
                <li>Respond to requests for feedback and approvals in a timely manner</li>
                <li>Provide all necessary content, images, and materials for your project</li>
                <li>Ensure you have the rights to all content and materials provided</li>
                <li>Make payments according to the agreed schedule</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">5.1 Client Content</h3>
                  <p className="text-gray-700">
                    You retain ownership of all content, materials, and intellectual property you provide to us. You grant us a license to use this content solely for the purpose of completing your project.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">5.2 Work Product</h3>
                  <p className="text-gray-700">
                    Upon full payment, you will own the final work product created specifically for your project. We retain the right to use general knowledge, skills, and techniques developed during the project.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Support and Maintenance</h2>
              <p className="text-gray-700 mb-4">
                We provide 12 months of free support for all completed projects, covering bug fixes and minor updates. Additional features, major changes, or ongoing maintenance beyond this period may incur additional charges.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                AtarWebb's liability for any damages arising from our services shall not exceed the total amount paid by you for the specific project in question. We are not liable for any indirect, incidental, or consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate a project agreement with written notice. In case of termination, you will be charged for work completed up to the termination date, and you will receive all work product completed to that point.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> admin@atarwebb.com</p>
                <p className="text-gray-700"><strong>Company:</strong> AtarWebb</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
