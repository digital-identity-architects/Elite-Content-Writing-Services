# Building the Play Store app (TWA)

This site is configured as a **Trusted Web Activity** — a thin Android app that opens your site fullscreen via Chrome Custom Tabs. Google explicitly supports TWAs on Play Store and this is the recommended path for content-style apps.

## What you get

- One codebase. The Android app *is* the website. Update content → app updates automatically.
- No webview-only Play policy issues (TWAs are an officially supported product).
- Installable PWA fallback for users who don't install the Play Store version.

## Prerequisites (one-time)

1. **Deploy the site to HTTPS.** Any of: Cloudflare Pages, Netlify, Vercel, GitHub Pages with a custom domain. The TWA verifies your domain at install; HTTP and `*.netlify.app` subdomains work for testing but you'll want a real domain for launch.
2. **Google Play Console account** — one-time $25. Sign up at <https://play.google.com/console>.
3. **Local tooling:**
   - Node.js 18+ (you already have it if you can run the site)
   - JDK 17 (`brew install openjdk@17` on macOS, or via your package manager)
   - Android SDK / Android Studio (Bubblewrap downloads tools on first run, but it helps to have Android Studio for the keystore screen)

## Step 1 — Deploy the site

Pick one. Cloudflare Pages is the simplest:

```bash
# from the repo root
npx wrangler pages deploy . --project-name elite-content
```

Or Netlify:

```bash
npx netlify deploy --dir=. --prod
```

Or push to a `main` branch on GitHub and turn on Pages with a custom domain.

After deploying, point `elitecontent.studio` (or whichever domain you own) at it and confirm it loads over HTTPS.

> **Test the PWA before continuing.** Open Chrome on Android, visit the live URL, tap "Install app." If it installs and runs standalone, you're TWA-ready.

## Step 2 — Edit `twa-manifest.json`

Open `twa-manifest.json` and update at minimum:

- `host` — your real domain (e.g. `elitecontent.studio`)
- `iconUrl`, `maskableIconUrl`, `webManifestUrl`, `fullScopeUrl`, `shortcuts[].chosenIconUrl` — replace the example domain
- `packageId` — must be globally unique. `studio.elitecontent.app` is reasonable; change if you've already used it.

## Step 3 — Build with Bubblewrap

Install Bubblewrap once globally:

```bash
npm install -g @bubblewrap/cli
```

From the repo root:

```bash
# Initialize the Android project from twa-manifest.json
bubblewrap init --manifest=./twa-manifest.json

# It will ask:
#  - JDK location (point to JDK 17)
#  - Android SDK location (Bubblewrap can download it)
#  - Keystore details — create a NEW keystore named ./android.keystore
#    alias: android
#    REMEMBER the passwords. You cannot publish updates without them.

# Build the release artifacts
bubblewrap build
```

When `bubblewrap build` finishes you'll have, in the project folder it created:

- `app-release-signed.apk` — for sideloading / internal testing
- `app-release-bundle.aab` — **this is what you upload to Play Console**

## Step 4 — Get your Play app signing fingerprint

When you upload the AAB to Play Console, Google takes over signing for production. You need their SHA-256 fingerprint to prove ownership of the website.

1. Upload your AAB to Play Console → Release → Internal testing → Create release → Upload
2. Go to **Setup → App integrity → App signing** in the Play Console
3. Copy the **SHA-256 certificate fingerprint** (looks like `AB:CD:EF:01:23:…`)

Open `.well-known/assetlinks.json` and paste it in, replacing `REPLACE_ME_WITH_YOUR_PLAY_APP_SIGNING_FINGERPRINT`. Redeploy the site.

Verify it's live:

```bash
curl -s https://elitecontent.studio/.well-known/assetlinks.json | jq
```

You can also run Google's verifier:
<https://developers.google.com/digital-asset-links/tools/generator>

## Step 5 — Fill in the Play Store listing

In Play Console:

- **App details** — name, short description, full description
- **Graphics** — feature graphic (1024×500), 2–8 phone screenshots (use a real device or Android Studio emulator)
- **Categorization** — Business or Productivity
- **Content rating** — fill out the IARC questionnaire (a content writing app will be "Everyone")
- **Target audience** — 18+
- **Privacy Policy URL** — `https://elitecontent.studio/privacy.html` ✓ (already shipped)
- **Data safety** — declare contact-form data collection honestly

## Step 6 — Submit

Push to Internal testing first, smoke-test on your own device, then promote to Production. First review typically takes 1–7 days.

## Updating later

For pure content changes (copy, blog posts, services) — just redeploy the website. The TWA pulls updates live.

For changes that need a new app version (different package id, new icon, new shortcuts):

```bash
bubblewrap update
bubblewrap build
```

Then upload the new AAB. Remember to bump `appVersionCode` in `twa-manifest.json` first.

## Common gotchas

- **"Site opened in Chrome with URL bar visible."** Either assetlinks.json is wrong, your fingerprint doesn't match, or the SW isn't installed. Check `chrome://flags/#enable-twa-debugging` on the device.
- **Play rejects the listing as "WebView only."** This shouldn't happen for a TWA — TWAs use Custom Tabs, not WebView. If it does, mention "Trusted Web Activity" in your appeal.
- **Splash screen looks low-res.** Replace `icons/splash-2048.png` and re-run `bubblewrap update && bubblewrap build`.

## Alternative: Capacitor

If you ever need native features (push, contacts, offline DB), the second-fastest path is Capacitor. It wraps the same web build in a WebView with a JS bridge. Run `npm i -g @capacitor/cli && cap init && cap add android` from the repo root. You'd then have a real Android project to publish — but more maintenance than a TWA.
