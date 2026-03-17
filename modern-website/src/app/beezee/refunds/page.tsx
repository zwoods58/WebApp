import LegalLayout from "@/components/ui/LegalLayout";

export default function BeezeeRefundPage() {
    return (
        <LegalLayout
            title="Refund and Cancellation Policy"
            lastUpdated="January 22, 2026"
            homeLink="/beezee"
            brandName="BEEZEE"
        >
            <section>
                <h2>1. Subscription Model</h2>
                <p>Beezee operates on a subscription basis (e.g., R49/month or 100 KES/week). By subscribing, you agree to recurring billing through our Merchant of Record, dLocal.</p>
            </section>

            <section>
                <h2>2. Cancellation Policy</h2>
                <p>You may cancel your Beezee subscription at any time. To cancel:</p>
                <ul>
                    <li>Open the Beezee App settings.</li>
                    <li>Navigate to the "Subscription" section.</li>
                    <li>Select "Cancel Subscription" and follow the prompts.</li>
                </ul>
                <p>Upon cancellation, your access to premium features will continue until the end of your current billing period.</p>
            </section>

            <section>
                <h2>3. Refund Policy</h2>
                <p>As a SaaS provider, we generally do not offer refunds for partial subscription periods. However, we may issue refunds in the following cases:</p>
                <ul>
                    <li>Technical errors resulting in double charging.</li>
                    <li>Verified account access issues preventing use of the service for more than 48 consecutive hours.</li>
                    <li>Legal requirements in specific jurisdictions.</li>
                </ul>
            </section>

            <section>
                <h2>4. Trial Period</h2>
                <p>All new users are eligible for a 7-day free trial. If you do not cancel within the trial period, your selected payment method will be charged the standard subscription fee.</p>
            </section>

            <section>
                <h2>5. Contact for Billing Issues</h2>
                <p>If you believe there has been a billing error, please contact us immediately at billing@beezee.app or through the in-app support channel.</p>
            </section>
        </LegalLayout>
    );
}
