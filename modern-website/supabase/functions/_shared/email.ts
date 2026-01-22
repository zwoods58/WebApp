/**
 * Email Provider Service (Resend)
 */

export async function sendVerificationEmail(
    email: string,
    code: string,
    purpose: 'signup' | 'recovery' | 'email_verify'
): Promise<boolean> {
    const apiKey = Deno.env.get("RESEND_API_KEY");

    if (!apiKey) {
        console.error('Resend API key not configured');
        return false;
    }

    const subjects = {
        signup: 'Welcome to Beezee - Verify your email',
        recovery: 'Beezee Account Recovery Code',
        email_verify: 'Verify your email address'
    };

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Beezee <no-reply@auth.beezee.africa>",
                to: [email],
                subject: subjects[purpose] || 'Beezee Verification Code',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #00F2B8;">Beezee Security</h2>
                        <p>Your verification code is:</p>
                        <h1 style="letter-spacing: 5px; color: #1A1C1E; font-size: 32px;">${code}</h1>
                        <p>This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #888;">&copy; 2026 Beezee Finance. All rights reserved.</p>
                    </div>
                `
            })
        });

        const result = await response.json();
        return response.ok;
    } catch (error) {
        console.error('Resend email send failed:', error);
        return false;
    }
}
