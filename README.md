# Guruji Ka Gyan — Static Website

A responsive, single-page spiritual knowledge and wellness website built with HTML5, CSS3 and vanilla JavaScript.

## Run locally
1. Extract the ZIP file.
2. Open the `Guruji Ka Gyan-Website` folder in VS Code.
3. Open `index.html` in your browser, or use the VS Code Live Server extension.

No build process, package manager or backend is required.

## Project structure
- `index.html` — page content and semantic structure
- `css/style.css` — design system, layout, responsive styles and animations
- `js/main.js` — navigation, reveal effects, program filters and form validation
- `assets/images/` — place your own downloaded/optimized image assets here

## Before publishing — customize these items
1. Replace the sample email `hello@example.com` and location in `index.html`.
2. Replace sample workshop/course titles and descriptions with your real offerings.
3. Replace the social media `href="#"` values with your actual profile URLs.
4. Update the brand mark, logo and any wording to match your brand identity.
5. Replace the remote Unsplash image URLs in `index.html` and `css/style.css` with images you own or are licensed to use. For a fully self-contained deployment, save optimized images under `assets/images/` and update the image paths.
6. Connect the contact form to an email provider or backend before expecting it to deliver messages.

## Contact form note
The contact form currently performs browser-side validation only. It does not send, store or email submissions. The success message explicitly tells visitors that the form is a demo.

## External dependencies
- Google Fonts (Playfair Display and DM Sans)
- Lucide icon library via CDN
- Unsplash-hosted photography

The site requires an internet connection for these external fonts, icons and images. For production, consider self-hosting licensed images and fonts and pinning the icon library to a specific version.

## Brand theme
Warm cream, deep maroon, royal gold, saffron and leaf-green palette inspired by the supplied Guruji Ka Gyan logo. The logo is stored at `assets/images/guruji-ka-gyan-logo.png`.


## Hindi and English
The navigation includes an English / हिन्दी switch. The selected language is remembered in the browser. The first pass translates the main navigation, hero, story, Kashi feature and key calls to action. Add `data-i18n` / `data-i18n-html` attributes and matching entries in `js/main.js` to translate remaining content and form labels.

## Kashi Vishwanath Temple image credit
The Kashi Vishwanath Temple photograph is by AYUSHR697, via Wikimedia Commons, licensed under CC BY 4.0:
https://commons.wikimedia.org/wiki/File:Kashi_vishwanath_temple_varanasi.jpg
The image is loaded from Wikimedia Commons. If you download and self-host it, retain attribution and the license link.
