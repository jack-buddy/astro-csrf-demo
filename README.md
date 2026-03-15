# Astro 6 CSRF Protection Demo

Demonstration of Cross-Site Request Forgery (CSRF) vulnerabilities and Astro 6's built-in protection.

## 🎯 Purpose

This demo project illustrates the CSRF security vulnerability and shows how Astro 6 automatically protects against it.

## ⚠️ Security Notice

The `/vulnerable` page is **intentionally insecure** for educational purposes only. It demonstrates what NOT to do. Never deploy unprotected forms in production!

## 📚 What's Included

### 1. **The Vulnerability** (`/vulnerable`)
- Demonstrates an unprotected form
- Explains how CSRF attacks work
- Shows real-world attack scenarios
- Illustrates the impact of the vulnerability

### 2. **Astro 6 Protection** (`/protected`)
- Same form, now automatically protected
- Shows Astro's automatic token generation
- Demonstrates validation flow
- Compares manual vs automatic approaches

### 3. **Configuration Options** (`/configuration`)
- Configuration examples
- Excluding specific routes
- Custom error handling
- Testing and troubleshooting
- Best practices

### 4. **Video Script** (`VIDEO_SCRIPT.md`)
- Complete outline for 7-10 minute tutorial
- Story arc with hook and conclusion
- Key talking points
- Demo flow suggestions

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/jack-buddy/astro-csrf-demo.git
cd astro-csrf-demo

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit http://localhost:4321 and explore the examples.

## 🛡️ What Is CSRF?

**Cross-Site Request Forgery** is an attack that tricks a user's browser into making unwanted requests to a site where they're authenticated.

### The Attack Flow:

1. User logs into `your-site.com` (gets session cookie)
2. User visits `evil-site.com` (while still logged in)
3. `evil-site.com` contains hidden form submitting to `your-site.com`
4. Browser automatically sends cookies with the request
5. `your-site.com` processes the request (thinks it's legitimate)
6. Attack succeeds! (money transferred, account changed, etc.)

### Why It Works:

- Browsers send cookies automatically with every request
- Your server can't tell if the user intended to make the request
- Same-Origin Policy doesn't prevent form submissions
- The request comes from the user's real browser with real auth cookies

## 🔒 How Astro 6 Protects You

Astro 6 includes built-in CSRF protection that:

- ✅ **Generates unique tokens** for each session
- ✅ **Automatically injects tokens** into forms
- ✅ **Validates tokens** before your code runs
- ✅ **Rejects invalid requests** with 403 Forbidden
- ✅ **Works with forms and API endpoints**
- ✅ **Requires zero configuration**

### Automatic Token Flow:

```
Page Load → Token Generated
     ↓
Form Render → Token Injected (hidden field)
     ↓
User Submit → Browser Sends Token
     ↓
Server Receive → Astro Validates Token
     ↓
Valid? → Your Code Runs
Invalid? → 403 Forbidden
```

## 📖 Key Concepts

### Before Astro 6 (Manual Protection):

```javascript
// Generate token
const token = crypto.randomUUID();
session.set('csrf', token);

// Add to form
<input type="hidden" name="_csrf" value={token}>

// Validate on submit
if (formData.get('_csrf') !== session.get('csrf')) {
  return new Response('Invalid token', { status: 403 });
}
```

**Problems:**
- Easy to forget
- Easy to implement incorrectly
- Must do for every form
- Maintenance burden

### With Astro 6 (Automatic):

```astro
<form method="POST">
  <!-- Astro adds CSRF token automatically -->
  <input name="email" />
  <button>Submit</button>
</form>
```

**Benefits:**
- Can't forget (automatic)
- Can't implement wrong
- Works everywhere
- Zero maintenance

## ⚙️ Configuration

CSRF protection is enabled by default in SSR and hybrid modes. Customize in `astro.config.mjs`:

```javascript
export default defineConfig({
  output: 'server', // or 'hybrid'
  
  security: {
    csrf: {
      enabled: true, // default
      
      // Exclude specific routes
      exclude: [
        '/api/public/*',
        '/webhook/*'
      ],
      
      // Custom error handler
      onInvalidToken: (request) => {
        return new Response('Invalid token', { status: 403 });
      }
    }
  }
});
```

### When to Exclude Routes:

- ✅ Public API endpoints (use API keys instead)
- ✅ Webhook receivers (use signature verification)
- ✅ Third-party integrations
- ❌ User-facing forms
- ❌ Authenticated endpoints

## 🎥 Video Tutorial

See `VIDEO_SCRIPT.md` for a complete outline including:

- Hook: The silent security risk
- Understanding the vulnerability
- Manual vs automatic protection
- Configuration and best practices
- Conclusion and key takeaways

**Target length:** 7-10 minutes

## 🧪 Testing CSRF Protection

### Test 1: Valid Request (Should Succeed)
```bash
# Load form, get token, submit normally
# → Should work
```

### Test 2: Missing Token (Should Fail)
```bash
curl -X POST http://localhost:4321/protected \
  -d "email=test@example.com&amount=100"
# → Should return 403 Forbidden
```

### Test 3: Invalid Token (Should Fail)
```bash
# Load form, edit token in DevTools, submit
# → Should return 403 Forbidden
```

## ✅ Best Practices

- ✅ Keep CSRF protection enabled
- ✅ Use HTTPS in production
- ✅ Set `SameSite=Lax` or `Strict` on cookies
- ✅ Test with automated tools
- ✅ Educate team about CSRF risks
- ❌ Don't disable for authenticated routes
- ❌ Don't put tokens in URLs
- ❌ Don't trust client-side validation only

## 📝 Real-World Examples

Major sites affected by CSRF:

- **Netflix (2006)** - Account details manipulation
- **YouTube (2008)** - Unauthorized actions
- **ING Direct (2008)** - Unauthorized transfers
- **Gmail (2007)** - Filter manipulation

CSRF is a serious, well-documented threat that Astro 6 now protects against automatically.

## 🔗 Resources

- [Astro Security Documentation](https://docs.astro.build/en/guides/security/)
- [OWASP CSRF Guide](https://owasp.org/www-community/attacks/csrf)
- [MDN: CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)

## 🛠️ Tech Stack

- Astro 6
- TypeScript (strict mode)
- Zero additional dependencies for CSRF

---

**Created for CIP (Coding in Public) - Astro 6 CSRF Protection Tutorial**

⚠️ Remember: The `/vulnerable` page is for demonstration only. Never deploy unprotected forms!
