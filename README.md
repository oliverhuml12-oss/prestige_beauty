# Prestige Beauty Salon

Static homepage (design direction A · Len), served by Cloudflare Workers from `public/`.

- `public/index.html`: hero slider (HeadSpa, Pleť, Tělo, Poukazy), service categories, reviews, about and contact
- `public/styles.css`: styles; colours from the brand manual (taupe #C39B7C, linen #FFF1E6)
- `public/main.js`: tab switching for the hero slider

Preview locally: `npx wrangler dev`, or `python3 -m http.server -d public`.

Before launch: replace the sample reviews with real Google reviews, point the "Rezervovat" buttons at the booking system, and remove `noindex`.
