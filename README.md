# Personal Portfolio Website

A modern, responsive personal portfolio website built with Astro, React, and Tailwind CSS, featuring a beautiful neumorphism (soft UI) design style.

## 🌟 Features

- **Neumorphism Design**: Beautiful soft UI with dual shadows and 3D effects
- **Dark Mode Support**: Full dark mode with inverted neumorphic shadows
- **Masonry grid layout** for beautiful photo arrangements
- **Lazy loading images** for better performance
- **Photo grouping and filtering**
- **Responsive design** that works on all devices
- **Accessibility**: WCAG-compliant contrast ratios
- **Project showcase** with markdown content
- **Blog functionality** for technical articles

## 🛠 Tech Stack

- **Astro** - Static site framework
- **React** - Interactive components
- **Tailwind CSS** - Utility-first CSS framework
- **tailwindcss-neumorphism** - Neumorphic design utilities
- **Masonry Layout** - Photo grid layouts
- **Vanilla-LazyLoad** - Image lazy loading
- **Nano Stores** - State management

## 🎨 Design System

The site uses a cohesive neumorphism design system with:

- Base background color: `#e0e0e0` (light mode) / `#2e2e2e` (dark mode)
- Light shadow: `#ffffff` (light) / `#3a3a3a` (dark)
- Dark shadow: `#c0c0c0` (light) / `#1a1a1a` (dark)
- Reusable neumorphic components: `NeumorphicCard`, `NeumorphicButton`, `NeumorphicInput`

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/J1mL1/J1mL1.github.io.git
cd J1mL1.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 📦 New Dependencies

The following package was added for neumorphism support:
- `tailwindcss-neumorphism` - Tailwind plugin for neumorphic design utilities

## 🎯 Key Changes (Neumorphism Redesign)

### Components Added
- `NeumorphicCard.astro` - Reusable card component with neumorphic styling
- `NeumorphicButton.astro` - Button component with pressed state effects
- `NeumorphicInput.astro` - Input field with inset shadow effects

### Styling Updates
- Updated `tailwind.config.cjs` with neumorphism plugin and custom colors
- Added `neumorphism.css` for custom shadow utilities
- Updated global variables in `variables.css` for neumorphic colors
- Modified navigation and theme toggle to match neumorphic style
- Enhanced dark mode support with inverted shadow colors

### Page Updates
- All pages now use `NeumorphicCard` components for consistent styling
- Improved hover and active states with smooth transitions
- Enhanced accessibility with proper contrast ratios

## 📸 Adding Photos

1. Place your photos in the `src/images` directory
2. Update `src/data/photos.json` with your photo information:
```json
{
  "photoGroups": {
    "group-name": [
      {
        "src": "/path/to/image.webp",
        "alt": "Image description",
        "caption": "Optional caption",
        "date": "2023-12-25"
      }
    ]
  }
}
```

## 🔧 Configuration

- Image lazy loading threshold can be adjusted in `PhotoStream.jsx`
- Masonry grid settings can be modified in `PhotoStream.jsx`

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebP support with fallback to original formats
- Responsive design for mobile and desktop

## 📄 License

MIT License - feel free to use this project for your own photo blog!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
