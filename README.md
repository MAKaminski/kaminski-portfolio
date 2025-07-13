# Executive Portfolio Website

A modern, responsive portfolio website built for an executive professional specializing in CXO/CSTO roles with expertise in Strategy, Finance, Product, and Analytics.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Fully responsive across all devices
- **Interactive**: Smooth scrolling navigation and hover effects
- **Performance**: Optimized for fast loading and smooth interactions
- **Accessible**: Built with accessibility best practices

## Sections

1. **Hero**: Executive summary and target profile
2. **Experience**: Leadership experience and education
3. **Skills**: Comprehensive software and technology expertise
4. **Transactions**: Detailed transaction history and deal experience
5. **Highlights**: Career highlights and key accomplishments
6. **Contact**: Professional contact information and call-to-action

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kaminski-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── Experience.tsx  # Experience section
│   ├── Skills.tsx      # Skills section
│   ├── Transactions.tsx # Transactions section
│   ├── Highlights.tsx  # Highlights section
│   ├── Contact.tsx     # Contact section
│   └── Footer.tsx      # Footer
├── App.tsx             # Main app component
├── index.tsx           # React entry point
└── index.css           # Global styles
```

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js` under the `colors.primary` section.

### Content
Update the content in each component file to match your specific information.

### Styling
Modify the Tailwind classes in each component to adjust the styling.

## Deployment

The site can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the build folder
- **GitHub Pages**: Use the gh-pages package
- **AWS S3**: Upload the build folder

## Performance

- Optimized images and assets
- Lazy loading for better performance
- Minimal bundle size
- Fast loading times

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or support, please reach out through the contact information provided in the portfolio. 

## Pinecone Vector DB Integration

This project includes a scaffold for integrating with Pinecone for semantic search and vector storage. You can use Pinecone to store and search information about your experience, skills, and even past conversations.

### Example API Endpoint (Node.js/Express)

```
// backend/pinecone.js
const { PineconeClient } = require('@pinecone-database/pinecone');
const express = require('express');
const router = express.Router();

const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

router.post('/upsert', async (req, res) => {
  const { id, values, metadata } = req.body;
  await pinecone.upsert({
    indexName: 'portfolio',
    upsertRequest: {
      vectors: [{ id, values, metadata }],
    },
  });
  res.json({ success: true });
});

router.post('/query', async (req, res) => {
  const { values, topK } = req.body;
  const result = await pinecone.query({
    indexName: 'portfolio',
    queryRequest: {
      vector: values,
      topK: topK || 5,
      includeMetadata: true,
    },
  });
  res.json(result.matches);
});

module.exports = router;
```

### Porting Data/Conversation
- Extract your experience, skills, and conversation data as text chunks.
- Use an embedding model (e.g., OpenAI, Cohere) to convert text to vectors.
- Upsert these vectors into Pinecone using the `/upsert` endpoint.
- Query Pinecone for semantic search using the `/query` endpoint.

This scaffold can be extended for production use, including authentication, advanced metadata filtering, and integration with your AI chatbot. 