# Astro 6 CSRF Protection - Video Script Outline (7-10 min)

## Hook: The Silent Security Risk (1 min)

**Story to tell:**
"Imagine this: A user logs into their banking website. Everything seems fine. They're authenticated, their session is active. Then they click a link in an email - maybe it's a funny cat video, maybe it's a news article. When that page loads, without them knowing, $10,000 gets transferred out of their account. They didn't click 'send money.' They didn't approve anything. But their browser did it for them. This is CSRF - Cross-Site Request Forgery - and it's been a problem for decades."

**The pain:**
- 💸 **Financial fraud** - unauthorized transfers, purchases
- 🔓 **Account hijacking** - password changes, email changes
- 🗑️ **Data manipulation** - deleted posts, changed settings
- 📧 **Spam and abuse** - posting from your account

**The transition:**
"For years, developers had to implement CSRF protection manually. And when you have to do it manually, you forget. Or you do it wrong. Astro 6 changes that. Let me show you how."

---

## 1. Understanding the Vulnerability (2-3 min)

### The Attack Explained

**The scenario:**
1. **User logs in** to your-bank.com
   - Gets a session cookie
   - Cookie is valid for hours

2. **User visits** evil-site.com (while still logged in)
   - Could be via email link
   - Could be a compromised ad
   - Could be any website

3. **Evil site contains**:
```html
<form action="https://your-bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker@evil.com">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>
```

4. **Browser automatically sends cookies**
   - Same-origin policy doesn't stop this!
   - Cookies go with EVERY request to that domain
   - Your server sees a "legitimate" authenticated request

5. **Money transferred**
   - Server can't tell the user didn't intend this
   - All authentication checks pass
   - Transaction goes through

### Demo: The Vulnerable Form

**Show `/vulnerable` page:**
- Point out: "This looks like a normal form"
- Show the code: "No CSRF protection"
- Explain: "If this was real, an attacker could exploit it"

**Key insight:**
"The fundamental problem: Cookies are sent automatically. Your server can't tell if the request came from YOUR form or an attacker's hidden form."

### Real-World Impact

**Examples to mention:**
- Netflix CSRF vulnerability (2006) - changed account details
- YouTube CSRF (2008) - performed actions as logged-in users
- ING Direct (2008) - transferred money between accounts
- Gmail CSRF (2007) - filter manipulation

**The pattern:**
"This isn't theoretical. Major sites have been vulnerable. The attack is simple. The impact is severe."

---

## 2. The Old Way: Manual CSRF Protection (1-2 min)

### How We Used To Do It

**Show the manual approach:**
```javascript
// 1. Generate token
const token = crypto.randomUUID();
session.set('csrf_token', token);

// 2. Add to every form
<input type="hidden" name="_csrf" value={token}>

// 3. Validate on every POST
const submitted = formData.get('_csrf');
const stored = session.get('csrf_token');
if (submitted !== stored) {
  throw new Error('Invalid CSRF token');
}
```

**The problems:**
- ❌ **Easy to forget** - one form without protection = vulnerability
- ❌ **Easy to implement wrong** - timing issues, storage issues
- ❌ **Requires session management** - more complexity
- ❌ **Must remember everywhere** - every form, every endpoint
- ❌ **Maintenance burden** - changes in auth = changes everywhere

**Key message:**
"Security that depends on developers remembering to do something... fails. We needed something automatic."

---

## 3. Astro 6: Automatic Protection (3-4 min)

### The Right Way

**Show `/protected` page:**
"Same exact form. Same functionality. But now it's protected. Watch this..."

**Demonstrate:**
1. Show the form HTML (no visible difference)
2. Inspect element → show hidden CSRF field
3. Submit the form → show it works
4. Explain: "Astro added that token automatically"

### How It Works

**The 5-step process:**
1. **Page load** → Astro generates unique token
2. **Form render** → Token automatically injected as hidden field
3. **User submits** → Browser sends form + token
4. **Before your code runs** → Astro validates token
5. **Invalid token?** → 403 Forbidden (your code never runs)

**Key benefits:**
- ✅ **Automatic** - works on every form, every time
- ✅ **Can't forget** - enabled by default
- ✅ **Can't implement wrong** - Astro handles it
- ✅ **Zero configuration** - just works
- ✅ **Works everywhere** - forms AND API endpoints

### Code Comparison

**Old way:**
```javascript
// 20+ lines of token generation and validation
// Must remember for every form
// Easy to get wrong
```

**New way:**
```javascript
// Nothing! Just use your form normally:
<form method="POST">
  <input name="email" />
  <button>Submit</button>
</form>

// Validation happens automatically
```

**Emphasize:**
"You write ZERO security code. Astro protects you automatically."

### Demo: Blocking the Attack

**Explain:**
"When an attacker tries the same attack now..."

1. Attacker's form submits to your site
2. Browser sends cookies (user authenticated)
3. But no CSRF token (attacker can't get it)
4. Astro: "No token? 403 Forbidden"
5. Attack blocked!

**Why it works:**
- Attacker can't read your cookies (Same-Origin Policy)
- Attacker can't get the token (it's in your HTML)
- Token is unique per session
- Token validates before your code runs

---

## 4. Configuration & Best Practices (1-2 min)

### When You Need Configuration

**Show `/configuration` page briefly:**

**Common scenarios:**
- **Public APIs** - exclude from CSRF (they use API keys)
- **Webhooks** - exclude (GitHub, Stripe use signatures)
- **Custom error handling** - make error messages friendlier

**Example:**
```javascript
// astro.config.mjs
export default defineConfig({
  security: {
    csrf: {
      exclude: ['/api/public/*', '/webhook/*']
    }
  }
});
```

### Best Practices

**Quick checklist:**
- ✅ Keep CSRF enabled (it's on by default)
- ✅ Use HTTPS (prevents token theft)
- ✅ Set SameSite cookies
- ✅ Don't disable for user routes
- ✅ Test with curl (should get 403)

---

## Conclusion: Security by Default (1 min)

### The Big Win

**The transformation:**
"We went from security being something developers had to remember and implement perfectly... to security being automatic. That's huge."

**Benefits recap:**
- 🛡️ **Automatic protection** - every form, every time
- 💪 **Can't mess it up** - Astro handles it
- ⚡ **Zero config** - works out of the box
- 🚀 **Works everywhere** - forms, API routes, everything
- ✅ **Industry standard** - battle-tested approach

### Why This Matters

**Security philosophy:**
"Good security should be the default, not the exception. It should be easier to do the right thing than the wrong thing. Astro 6's CSRF protection embodies that."

**Accessibility angle:**
"When sites get hacked, users lose trust. They lose money. They lose data. Automatic security protects not just your application, but your users."

### Call to Action

"CSRF has been a vulnerability for 20 years. Astro 6 makes it a thing of the past. If you're building with Astro, you're protected automatically. Check out the demo repo below - it shows both the vulnerability and the protection side by side."

---

## Key Messages Throughout

### Security Theme
- CSRF is a serious, real-world threat
- Manual protection fails because humans forget
- Automatic protection eliminates the risk
- Default-secure is the right approach

### Developer Experience Theme
- Security shouldn't be complicated
- Less code = less to maintain
- Automatic = can't forget
- Zero config = easy adoption

### Real-World Impact Theme
- Major sites have had CSRF vulnerabilities
- Financial loss, account hijacking are real
- Users trust you with their data
- Protecting them is your responsibility

---

## Demo Flow

1. **Start with the attack** - show how CSRF works on `/vulnerable`
2. **Explain the manual fix** - show old way (tedious, error-prone)
3. **Show Astro 6** - same form on `/protected`, inspect element, see token
4. **Submit both forms** - vulnerable processes, protected adds security
5. **Quick config mention** - `/configuration` (don't dwell, just show it exists)
6. **End with win** - automatic security is the future

---

## Tone & Style

- **Start serious** - CSRF is a real threat
- **Build empathy** - manual protection is painful
- **Celebrate the win** - Astro makes it effortless
- **Be practical** - show real code, real examples
- **End optimistic** - security is getting better

---

## Things to Avoid

- ❌ Don't minimize the threat (CSRF is serious)
- ❌ Don't overcomplicate (keep it accessible)
- ❌ Don't skip the "why" (explain the attack first)
- ❌ Don't just show code (tell the story)
- ❌ Don't forget to mention it's automatic (key selling point)

---

## Visual Aids

- Show form submissions in Network tab
- Inspect element to reveal hidden token
- Side-by-side comparison (vulnerable vs protected)
- Diagram of attack flow (attacker → user → your site)
- Code snippets (old way vs new way)

---

## Key Timestamps (Suggested)

- 0:00 - Hook: The silent security risk
- 1:00 - Understanding CSRF attacks
- 3:00 - The manual protection problem
- 4:00 - Astro 6 automatic protection
- 7:00 - Configuration & best practices
- 8:30 - Conclusion & call to action
