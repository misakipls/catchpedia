# Catchpedia - Your Complete Fishing Resource

A modern, Wikipedia-style fishing encyclopedia built with Next.js, featuring clean routing, SEO optimization, and a responsive design optimized for long reading sessions.

## Features

- **Clean URL Structure**: Each category has its own route (e.g., `/locations`, `/fish`, `/fishing-rods`)
- **Article Pages**: Full article content with unique URLs (e.g., `/fish/bluefin-tuna`)
- **Wikipedia-Style Design**: Clean, minimal styling optimized for reading
- **SEO-Friendly**: Proper meta tags, structured data, and indexable routes
- **Responsive Design**: Works perfectly on all devices
- **Fast Performance**: Built with Next.js for optimal speed

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Typography plugin
- **Fonts**: Inter (Google Fonts)
- **Icons**: Heroicons (SVG)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd catchpedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
catchpedia/
├── app/                          # Next.js App Router
│   ├── components/               # Reusable components
│   │   ├── Header.tsx           # Navigation header
│   │   └── Footer.tsx           # Site footer
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── locations/                # Locations category
│   │   ├── page.tsx             # Category page (article list)
│   │   └── [slug]/              # Dynamic article routes
│   │       └── page.tsx         # Individual article page
│   ├── fish/                     # Fish category
│   ├── fishing-rods/             # Fishing rods category
│   ├── reels/                    # Reels category
│   ├── fishing-lines/            # Fishing lines category
│   ├── hooks/                    # Hooks category
│   ├── lures/                    # Lures category
│   ├── knots/                    # Knots category
│   └── tackles/                  # Tackles category
├── public/                       # Static assets
│   └── logo/                     # Site logos
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── next.config.js                # Next.js configuration
```

## URL Structure

### Category Pages
- `/locations` - Fishing locations worldwide
- `/waters` - Different types of fishing waters
- `/fish` - Fish species and identification
- `/fishing-rods` - Types and selection of fishing rods
- `/reels` - Fishing reel types and maintenance
- `/fishing-lines` - Line types and selection
- `/hooks` - Hook types and sizes
- `/lures` - Artificial baits and lures
- `/knots` - Essential fishing knots
- `/tackles` - Fishing accessories and gear

### Article Pages
- `/locations/north-america-fishing` - North America fishing guide
- `/fish/bluefin-tuna` - Bluefin tuna article
- `/knots/palomar-knot` - Palomar knot tutorial

## Adding New Content

### 1. Create a Category Page

Create a new folder in `app/` for your category:

```typescript
// app/fish/page.tsx
export default function FishPage() {
  const articles = [
    {
      id: 'bluefin-tuna',
      title: 'Bluefin Tuna',
      description: 'Complete guide to bluefin tuna fishing',
      category: 'Saltwater Fish',
      date: '2024-01-20',
    },
    // ... more articles
  ]

  return (
    // Your category page JSX
  )
}
```

### 2. Create Article Pages

Create a `[slug]` folder with a `page.tsx` file:

```typescript
// app/fish/[slug]/page.tsx
export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]
  
  if (!article) {
    notFound()
  }

  return (
    // Your article page JSX
  )
}
```

### 3. Update Navigation

Add your new category to the navigation in `Header.tsx`:

```typescript
const navigation = [
  // ... existing categories
  { name: 'Your Category', href: '/your-category' },
]
```

## Styling

The project uses Tailwind CSS with custom components and utilities:

### Custom Components
- `.nav-link` - Navigation links with hover effects
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card container with shadow and border
- `.article-title` - Article title links
- `.breadcrumb` - Breadcrumb navigation

### Typography
The `@tailwindcss/typography` plugin provides beautiful article styling. Use the `prose` class for article content:

```html
<article className="prose prose-lg max-w-none">
  <!-- Your article content -->
</article>
```

## SEO Features

- **Meta Tags**: Each page has proper title, description, and keywords
- **Open Graph**: Social media sharing optimization
- **Structured Data**: Ready for rich snippets
- **Clean URLs**: SEO-friendly routing structure
- **Fast Loading**: Optimized for Core Web Vitals

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Happy Fishing! 🎣**