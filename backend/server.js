const express = require('express');
const cors = require('cors');
const { PineconeClient } = require('@pinecone-database/pinecone');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Pinecone
const pinecone = new PineconeClient();
pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

// Pinecone endpoints
app.post('/api/pinecone/upsert', async (req, res) => {
  try {
    const { id, values, metadata } = req.body;
    
    if (!id || !values || !metadata) {
      return res.status(400).json({ error: 'Missing required fields: id, values, metadata' });
    }

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME || 'portfolio');
    
    await index.upsert({
      upsertRequest: {
        vectors: [{ id, values, metadata }],
      },
    });

    res.json({ success: true, message: 'Vector upserted successfully' });
  } catch (error) {
    console.error('Pinecone upsert error:', error);
    res.status(500).json({ error: 'Failed to upsert vector' });
  }
});

app.post('/api/pinecone/query', async (req, res) => {
  try {
    const { values, topK = 5, filter } = req.body;
    
    if (!values) {
      return res.status(400).json({ error: 'Missing required field: values' });
    }

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME || 'portfolio');
    
    const queryResponse = await index.query({
      queryRequest: {
        vector: values,
        topK: topK,
        includeMetadata: true,
        filter: filter,
      },
    });

    res.json({ 
      success: true, 
      matches: queryResponse.matches,
      totalResults: queryResponse.matches.length
    });
  } catch (error) {
    console.error('Pinecone query error:', error);
    res.status(500).json({ error: 'Failed to query vectors' });
  }
});

// Sample data endpoint for testing
app.get('/api/sample-data', (req, res) => {
  const sampleData = [
    {
      id: 'experience-1',
      text: 'Led $10.8B+ in complex financial transactions including IPOs, debt facilities, and M&A deals',
      category: 'experience',
      metadata: {
        type: 'transaction',
        value: '10.8B',
        companies: ['GreenSky', 'HD Supply', 'Home Depot']
      }
    },
    {
      id: 'skills-1',
      text: 'Expert in ERP systems including SAP, NetSuite, Microsoft Dynamics',
      category: 'skills',
      metadata: {
        type: 'technology',
        proficiency: 'expert',
        systems: ['SAP', 'NetSuite', 'Microsoft Dynamics']
      }
    },
    {
      id: 'leadership-1',
      text: 'Led organizational transformation of 2,500+ FTEs from San Diego to Atlanta',
      category: 'leadership',
      metadata: {
        type: 'transformation',
        scope: '2500+ FTEs',
        location: 'San Diego to Atlanta'
      }
    }
  ];
  
  res.json(sampleData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Sample data: http://localhost:${PORT}/api/sample-data`);
}); 