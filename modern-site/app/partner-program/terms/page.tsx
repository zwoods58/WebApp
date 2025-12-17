import { PageHeader } from '../../../src/components/sections/PageHeader'

export default function PartnerProgramTerms() {
  return (
    <div className="min-h-screen bg-white text-black">
      <PageHeader />
      <div className="pt-24">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Partner Program Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-12">
            Please review the following terms and conditions for the AtarWebb Partner Program.
          </p>

          <div className="prose prose-lg max-w-none space-y-12">
            {/* I. Partner Responsibilities */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">I. Partner Responsibilities</h2>
              <p className="text-lg text-gray-700 mb-4">
                The Partner shall adhere to the following professional and ethical standards when participating in the AtarWebb Partner Program:
              </p>
              <ul className="space-y-4 list-disc list-inside text-gray-700">
                <li>
                  <strong>Account Accuracy:</strong> Provide accurate and verifiable information during the sign-up process that precisely matches the details of the designated PayPal account.
                </li>
                <li>
                  <strong>Professional Conduct:</strong> Act professionally and ethically at all times when promoting AtarWebb services.
                </li>
                <li>
                  <strong>Marketing Material Compliance:</strong> Utilize only the marketing materials officially approved and provided by AtarWebb.
                </li>
                <li>
                  <strong>Agreement Adherence:</strong> Refrain from engaging in any activity that constitutes a violation of the stipulations outlined in this partnership agreement.
                </li>
                <li>
                  <strong>Referral Legitimacy:</strong> Ensure all referrals are legitimate and have provided explicit consent to be contacted by AtarWebb.
                </li>
              </ul>
            </section>

            {/* II. Program Terms and Conditions */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">II. Program Terms and Conditions</h2>
              <p className="text-lg text-gray-700 mb-6">
                The following conditions govern the operational and financial aspects of the partnership:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                        Term
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                        Requirement / Policy
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Eligibility
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Participants must reside in a country where PayPal permits the receipt of payments.
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Commission Rate
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        The commission shall be fixed at 20% of the total client payment received by AtarWebb.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Payment Timing
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Commission payments will be processed within 48 hours following the receipt of the full payment from the referred client.
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Refund Policy
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        No commission shall be paid to the Partner for clients who request and receive a refund.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Compliance & Prohibited Actions
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Partners must not engage in any actions that contravene the spirit or terms of this program, including, but not limited to, false advertising, spamming, or misrepresentation of AtarWebb services.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* III. Term and Termination */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">III. Term and Termination</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Term:</p>
                  <p>
                    This agreement shall commence upon the Partner&apos;s successful sign-up and shall continue until terminated as provided herein.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Termination:</p>
                  <p>
                    AtarWebb reserves the right to terminate this Agreement immediately and without prior notice if the Partner is found to be in violation of any of the terms and conditions outlined in this document.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <a
              href="/partner-program"
              className="inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              ← Back to Partner Program
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

