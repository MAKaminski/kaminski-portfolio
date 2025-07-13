# Portfolio Backend API

This backend provides Pinecone vector database integration for the portfolio website, enabling semantic search of experience, skills, and conversation data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp env.example .env
```

3. Configure your environment variables in `.env`:
- `PINECONE_API_KEY`: Your Pinecone API key
- `PINECONE_ENVIRONMENT`: Your Pinecone environment (e.g., us-west1-gcp)
- `PINECONE_INDEX_NAME`: Your Pinecone index name (default: portfolio)
- `OPENAI_API_KEY`: Your OpenAI API key (for embeddings)

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on port 5000 by default.

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### Pinecone Operations
- `POST /api/pinecone/upsert` - Insert or update vectors
- `POST /api/pinecone/query` - Search vectors semantically

### Sample Data
- `GET /api/sample-data` - Get sample portfolio data for testing

## Usage Examples

### Upsert a vector:
```bash
curl -X POST http://localhost:5000/api/pinecone/upsert \
  -H "Content-Type: application/json" \
  -d '{
    "id": "experience-1",
    "values": [0.1, 0.2, 0.3, ...],
    "metadata": {
      "text": "Led $10.8B+ in transactions",
      "category": "experience",
      "type": "transaction"
    }
  }'
```

### Query vectors:
```bash
curl -X POST http://localhost:5000/api/pinecone/query \
  -H "Content-Type: application/json" \
  -d '{
    "values": [0.1, 0.2, 0.3, ...],
    "topK": 5
  }'
```

## Data Porting

To port your conversation and experience data:

1. Extract text chunks from your data
2. Use OpenAI embeddings to convert text to vectors
3. Upsert vectors with relevant metadata
4. Query for semantic search

See the main README for more details on data porting strategies. 