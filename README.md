# zsurf.tech — Tech Blog

A clean, fast, AdSense-friendly tech blog. Pure HTML + CSS + vanilla JS — no framework, no build step.

## Structure
```
zsurf.tech/
├── index.html              # Homepage
├── articles/
│   ├── index.html          # All articles
│   ├── ai-tools-2026.html
│   ├── zero-trust-security.html
│   ├── best-laptops-developers.html
│   ├── web-performance-tips.html
│   ├── cloud-cost-optimization.html
│   └── rust-vs-go.html
├── about/index.html
├── contact/index.html
├── privacy/index.html
├── disclaimer/index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/favicon.svg
├── robots.txt
└── sitemap.xml
```

## AdSense readiness checklist
- ✅ Original content
- ✅ Privacy Policy + Disclaimer + About + Contact pages
- ✅ Cookie consent banner
- ✅ Responsive design (mobile-first)
- ✅ Sitemap.xml + robots.txt
- ✅ Semantic HTML with proper headings
- ✅ Article structured data (JSON-LD)
- ✅ Meta tags (description, canonical, OG)
- ✅ Fast load (no framework, ~50KB total assets)

## To add AdSense
1. Sign up at https://www.google.com/adsense
2. After approval, paste the AdSense code into the `.ad-placeholder` divs in `index.html` (in-feed and sidebar slots).
3. Replace newsletter form with Mailchimp/ConvertKit/Buttondown embed.

## Hosting
Drop on any static host: Cloudflare Pages, Netlify, Vercel, GitHub Pages.
For custom domain zsurf.tech — point DNS A record to host, add CNAME.
