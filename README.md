# SmartTech Website (smarttech.asia)

International-facing SmartTech website positioned as an engineering-driven systems integration company.

## Stack

- Static HTML routes (directory-based)
- Shared CSS: `style.css`
- Shared JS: `script.js`
- GitHub Pages deployment with custom domain via `CNAME`

## Main routes

- `/` (English-first homepage)
- `/solutions/access-control/`
- `/solutions/face-recognition/`
- `/solutions/attendance-analytics/`
- `/industries/universities/`
- `/industries/enterprise/`
- `/capabilities/integration-engineering/`
- `/case-studies/`
- `/case-studies/kazutb/`
- `/case-studies/sports-complex/`
- `/case-studies/dormitory/`
- `/company/`
- `/contact/`
- `/ru/` and `/kz/` (non-English access pages)

## Local run

```bash
cd /Users/yersin/landing/smarttech_landing
python3 -m http.server 4173
```

Open: `http://127.0.0.1:4173`

## Editing guidance

- Keep positioning focused on integration engineering, not SaaS/product claims.
- Keep one `<h1>` per page.
- Keep unique `<title>` and meta description per route.
- Keep WhatsApp CTA number: `+77087262237`.
- Replace marked placeholders in case study metrics with verified values.

## SEO files

- `robots.txt`
- `sitemap.xml`

## Deployment

GitHub Pages root deployment from `main` branch with custom domain from `CNAME`.
