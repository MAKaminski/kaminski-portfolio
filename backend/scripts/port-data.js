const { PineconeClient } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
require('dotenv').config();

const pinecone = new PineconeClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone
async function initPinecone() {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
}

// Generate embeddings using OpenAI
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Sample portfolio data to port
const portfolioData = [
  {
    id: 'experience-transactions',
    text: 'Led $10.8B+ in complex financial transactions including IPOs, debt facilities, and M&A deals across GreenSky, HD Supply, and Home Depot',
    category: 'experience',
    metadata: {
      type: 'transaction',
      value: '10.8B',
      companies: ['GreenSky', 'HD Supply', 'Home Depot'],
      dealTypes: ['IPO', 'Debt', 'M&A']
    }
  },
  {
    id: 'experience-transformation',
    text: 'Led organizational transformation of 2,500+ FTEs from San Diego to Atlanta, identifying and resolving $50MM inventory optimization opportunity',
    category: 'experience',
    metadata: {
      type: 'transformation',
      scope: '2500+ FTEs',
      location: 'San Diego to Atlanta',
      value: '50MM',
      focus: 'inventory optimization'
    }
  },
  {
    id: 'skills-erp',
    text: 'Expert in ERP systems including SAP, SAP/4HANA, NetSuite, Microsoft Dynamics, Great Plains, Oracle Hyperion, and Automatica',
    category: 'skills',
    metadata: {
      type: 'technology',
      proficiency: 'expert',
      systems: ['SAP', 'SAP/4HANA', 'NetSuite', 'Microsoft Dynamics', 'Great Plains', 'Oracle Hyperion', 'Automatica']
    }
  },
  {
    id: 'skills-analytics',
    text: 'Proficient in analytics and BI tools including QlikView, Tableau, PowerBI, Looker, Metabase, and ClickHouse',
    category: 'skills',
    metadata: {
      type: 'technology',
      proficiency: 'proficient',
      tools: ['QlikView', 'Tableau', 'PowerBI', 'Looker', 'Metabase', 'ClickHouse']
    }
  },
  {
    id: 'leadership-culture',
    text: 'Led organizational transformation initiatives that resulted in measurable improvements in team productivity and cultural alignment',
    category: 'leadership',
    metadata: {
      type: 'transformation',
      focus: 'culture',
      outcome: 'productivity improvement'
    }
  },
  {
    id: 'expertise-compliance',
    text: 'Expert in SOC 1 & SOC 2 readiness, ASC 606 implementation, SOX compliance, and regulatory frameworks',
    category: 'expertise',
    metadata: {
      type: 'compliance',
      standards: ['SOC 1', 'SOC 2', 'ASC 606', 'SOX'],
      proficiency: 'expert'
    }
  }
];

// Port data to Pinecone
async function portData() {
  try {
    await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME || 'portfolio');
    
    console.log('Starting data port to Pinecone...');
    
    for (const item of portfolioData) {
      console.log(`Processing: ${item.id}`);
      
      // Generate embedding
      const embedding = await generateEmbedding(item.text);
      
      // Upsert to Pinecone
      await index.upsert({
        upsertRequest: {
          vectors: [{
            id: item.id,
            values: embedding,
            metadata: {
              text: item.text,
              category: item.category,
              ...item.metadata
            }
          }]
        }
      });
      
      console.log(`✓ Successfully upserted: ${item.id}`);
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ Data port completed successfully!');
    
  } catch (error) {
    console.error('❌ Error porting data:', error);
  }
}

// Query data from Pinecone
async function queryData(searchText, topK = 5) {
  try {
    await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME || 'portfolio');
    
    console.log(`Searching for: "${searchText}"`);
    
    // Generate embedding for search
    const searchEmbedding = await generateEmbedding(searchText);
    
    // Query Pinecone
    const queryResponse = await index.query({
      queryRequest: {
        vector: searchEmbedding,
        topK: topK,
        includeMetadata: true,
      }
    });
    
    console.log(`Found ${queryResponse.matches.length} results:`);
    queryResponse.matches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.metadata.text} (Score: ${match.score.toFixed(3)})`);
    });
    
    return queryResponse.matches;
    
  } catch (error) {
    console.error('❌ Error querying data:', error);
  }
}

// CLI interface
const command = process.argv[2];

if (command === 'port') {
  portData();
} else if (command === 'query') {
  const searchText = process.argv[3] || 'financial transactions';
  queryData(searchText);
} else {
  console.log('Usage:');
  console.log('  node port-data.js port     - Port data to Pinecone');
  console.log('  node port-data.js query    - Query data from Pinecone');
  console.log('  node port-data.js query "your search text" - Query with custom text');
} 