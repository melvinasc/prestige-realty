# 🏠 Prestige Realty — Luxury Real Estate Website

A luxury real estate company website built with vanilla HTML, CSS, and JavaScript. Features full-page snap scrolling, scroll-driven animations, a Coming Soon waitlist, and a dual-channel contact form (Email + WhatsApp) — all with zero backend required.

---

## 📁 Project Structure

```
prestige-realty/
├── index.html     # All markup and page structure
├── style.css      # All styles, animations, and responsive rules
├── main.js        # All interactivity, snap scroll, EmailJS, WhatsApp
└── README.md      # This file
```

---

## ✨ Features

- **Full-page snap scrolling** — each section occupies the full viewport; scroll or swipe to navigate between them
- **Keyboard navigation** — `↑ ↓` / `PageUp` `PageDown` to move between panels
- **Dot navigation** — fixed side dots show which panel you're on and let you jump to any section
- **Scroll reveal animations** — elements fade and slide in as each panel comes into view, and reverse when scrolled away
- **Hero parallax** — background orbs and pattern shift with mouse movement
- **Custom gold cursor** — replaces the system cursor with a gold dot + trailing ring
- **Scroll progress bar** — thin gold line at the top tracks scroll progress
- **Coming Soon panel** — waitlist form that emails you signups via EmailJS
- **Contact form** — dual submit: sends via EmailJS **or** opens a pre-filled WhatsApp message
- **Fully responsive** — mobile-friendly layout with touch swipe support

---

## 🚀 Getting Started

### 1. Clone or download

```bash
git clone https://github.com/YOUR_USERNAME/prestige-realty.git
cd prestige-realty
```

### 2. Open locally

No build tools or server needed. Just open `index.html` in your browser:

```bash
# macOS
open index.html

# Windows
start index.html

# Or drag the file into any browser
```

### 3. Configure EmailJS and WhatsApp

Open `main.js` and fill in the `CONFIG` block at the very top:

```js
const CONFIG = {
  emailjs: {
    publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId:  'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
  },
  whatsappNumber: 'YOUR_WHATSAPP_NUMBER', // digits only, e.g. '61412345678'
};
```

See the **Setup Guides** section below for step-by-step instructions.

---

## ⚙️ Setup Guides

### 📧 EmailJS (free — no backend needed)

EmailJS lets the contact form and waitlist send emails directly from the browser.

**Free tier:** 200 emails/month

1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Go to **Email Services** → **Add New Service** → connect Gmail, Outlook, or any SMTP
3. Copy your **Service ID**
4. Go to **Email Templates** → **Create New Template**
5. Use these variables in your template body:

   ```
   Name:         {{from_name}}
   Email:        {{from_email}}
   Phone:        {{phone}}
   Interested:   {{interest}}
   Message:      {{message}}
   Subject:      {{subject}}
   ```

6. Copy your **Template ID**
7. Go to **Account → General** → copy your **Public Key**
8. Paste all three into the `CONFIG` object in `main.js`

> **Tip:** Use the same Service ID and Template ID for both the waitlist and contact form — the template variables cover both.

---

### 💬 WhatsApp

No account setup needed. Just add your WhatsApp number to `CONFIG.whatsappNumber` in **international format, digits only**:

| Country | Number | Config value |
|---------|--------|--------------|
| Australia | +61 412 345 678 | `'61412345678'` |
| Indonesia | +62 812 345 6789 | `'628123456789'` |
| UK | +44 7700 123456 | `'447700123456'` |

When a visitor clicks **Send via WhatsApp**, it opens WhatsApp (app or web) with their form details pre-filled as a message to you.

---

## 🌐 Deploying to GitHub Pages

1. Push the project to a GitHub repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Prestige Realty website"
   git remote add origin https://github.com/YOUR_USERNAME/prestige-realty.git
   git push -u origin main
   ```

2. In your GitHub repository, go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Your site will be live at: `https://YOUR_USERNAME.github.io/prestige-realty`

> **Note:** GitHub Pages may take 1–2 minutes to build on first deploy.

---

## 🎨 Customisation Guide

### Colours

All colours are defined as CSS variables at the top of `style.css`:

```css
:root {
  --gold:        #C9A84C;   /* Primary gold accent */
  --gold-light:  #E8D5A3;   /* Lighter gold for gradients */
  --cream:       #FAF8F4;   /* Page background */
  --charcoal:    #1A1A1A;   /* Dark backgrounds and text */
  --mid:         #4A4A4A;   /* Secondary text */
  --soft:        #8A8A8A;   /* Muted text */
}
```

### Company name

Search and replace `Prestige Realty` in `index.html` with your friend's company name.

### Contact details

In `index.html`, find the contact panel (`id="p-contact"`) and update:
- Office address
- Phone number
- Email address
- Business hours

### Team members

In `index.html`, find the team panel (`id="p-team"`) and update each `.team-card` with real names, roles, and bios. Replace the emoji avatars with `<img>` tags once you have real photos.

### Stats

In `index.html`, find the stats panel (`id="p-stats"`) and update the numbers to reflect real figures — or remove this panel entirely until you have data to show.

### Navigation panels

The panel order is controlled by `PANELS` array in `main.js` and the matching `data-panel` attributes in `index.html`. Both must stay in sync if you add or reorder panels.

---

## 📱 Browser & Device Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

> Scroll snap and `backdrop-filter` (blur) require modern browsers. Older browsers gracefully degrade — the site remains usable but without blur effects.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic) |
| Styles | CSS3 (custom properties, scroll-snap, IntersectionObserver) |
| Scripts | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Cormorant Garamond + Montserrat |
| Email | [EmailJS](https://www.emailjs.com) (free CDN SDK) |
| Hosting | GitHub Pages (free) |

No npm, no bundler, no framework — just three files.

---

## 🗺️ Roadmap

When the business grows, here are natural next steps:

- [ ] Add real property photos once listings go live
- [ ] Replace Coming Soon panel with a proper listings grid
- [ ] Connect to a CMS (e.g. Contentful or Sanity) for managing properties
- [ ] Add Google Maps embed to the contact panel
- [ ] Migrate contact form to a proper backend (Node.js / Supabase) for higher volume
- [ ] Add a blog or market insights section

---

## 📄 License

This project was built as a personal gift for a friend's new real estate business. Feel free to adapt it for your own use.

---

*Built with ❤️ for Prestige Realty — 2026*
