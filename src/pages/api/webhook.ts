// Example webhook endpoint
// This would need to be EXCLUDED from CSRF protection

export async function POST({ request }) {
	// Webhooks use signature verification, not CSRF tokens
	// Example: Stripe, GitHub, etc.
	
	// Verify webhook signature (not CSRF token)
	const signature = request.headers.get('x-webhook-signature');
	// ... verify signature logic
	
	const payload = await request.json();
	
	return new Response(JSON.stringify({ received: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
