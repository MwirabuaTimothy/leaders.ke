// Manually re-triggers an email verification code for a user, for accounts
// stuck unverified because delivery was broken at signup time (once fixed,
// new signups self-serve via the "Resend code" button, this covers the
// backlog created before the fix).
//
// Usage: bun run scripts/resend-email-otp.ts <userId> <email> <firstName>
//
// Mirrors $lib/server/otp.ts's sendOtp (email branch) rather than importing
// it (that file reads $env/dynamic/*, which only resolves inside SvelteKit's
// runtime). Keep the two in step if the OTP or email logic changes.
import { randomInt, randomBytes, createHash } from 'node:crypto';
import postgres from 'postgres';

const [userIdRaw, email, firstName] = process.argv.slice(2);
if (!userIdRaw || !email) {
	console.error('Usage: bun run scripts/resend-email-otp.ts <userId> <email> [firstName]');
	process.exit(1);
}
const userId = Number(userIdRaw);
if (!Number.isInteger(userId)) {
	console.error(`"${userIdRaw}" is not a valid user id.`);
	process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
const emailToken = process.env.EMAIL_TOKEN;
const emailFrom = process.env.EMAIL_FROM || 'noreply@vote.ke';
const baseUrl = process.env.PUBLIC_BASE_URL || 'https://vote.ke';
if (!databaseUrl) {
	console.error('DATABASE_URL must be set.');
	process.exit(1);
}
if (!emailToken) {
	console.error('EMAIL_TOKEN must be set (Brevo API key), otherwise the code only logs to console.');
	process.exit(1);
}

const sql = postgres(databaseUrl);

const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
const codeHash = createHash('sha256').update(code).digest('hex');
const linkToken = randomBytes(16).toString('hex');
const expiresAt = new Date(Date.now() + 10 * 60_000);

await sql`
	INSERT INTO otps (user_id, channel, destination, code_hash, link_token, expires_at)
	VALUES (${userId}, 'email', ${email}, ${codeHash}, ${linkToken}, ${expiresAt})
`;

const link = `${baseUrl}/verify/email?linkToken=${linkToken}`;
const text = `Hi ${firstName || 'there'},\n\nVerify your email using the code ${code} or by clicking the link below:\n${link}\n\nThey expire in 10 minutes.\nDidn't sign up? Ignore this email.`;

const res = await fetch('https://api.brevo.com/v3/smtp/email', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'api-key': emailToken
	},
	body: JSON.stringify({
		sender: { email: emailFrom },
		to: [{ email }],
		subject: 'Your vote.ke verification',
		textContent: text
	})
});

if (!res.ok) {
	console.error(`FAILED (HTTP ${res.status}): ${await res.text()}`);
	process.exit(1);
}

console.log(`OK   sent to ${email} (user ${userId}), code ${code}, link ${link}`);
await sql.end();
