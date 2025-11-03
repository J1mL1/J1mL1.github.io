# Personal Photo Blog

A modern, responsive photo blog built with React, featuring masonry layout and lazy loading for optimal performance.

## 🌟 Features

- Masonry grid layout for beautiful photo arrangements
- Lazy loading images for better performance
- WebP image support with fallback
- Photo grouping and filtering
- Responsive design
- Modern image optimization

## 🛠 Tech Stack

- React
- Masonry Layout
- Vanilla-LazyLoad
- ImagesLoaded
- Nano Stores for state management

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MyBlog.git
cd MyBlog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

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
