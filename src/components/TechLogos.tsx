import React from 'react';

interface TechLogoProps {
  name: string;
  className?: string;
}

const TechLogo: React.FC<TechLogoProps> = ({ name, className = "w-8 h-8" }) => {
  const logos: { [key: string]: string } = {
    // Companies
    'Momnt': 'https://momnt.com/favicon.ico',
    'GreenSky': 'https://www.greensky.com/favicon.ico',
    'HD Supply': 'https://www.hdsupply.com/favicon.ico',
    'Home Depot': 'https://www.homedepot.com/favicon.ico',
    
    // Cloud & Infrastructure
    'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
    'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'GCP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
    'Vercel': 'https://assets.vercel.com/image/upload/q_auto/front/assets/design/vercel-triangle-black.svg',
    
    // Programming Languages
    'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    'Rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
    'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    
    // Frontend
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'Tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
    
    // Backend & Databases
    'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    
    // Data & Analytics
    'Snowflake': 'https://cdn.worldvectorlogo.com/logos/snowflake-2.svg',
    'BigQuery': 'https://www.gstatic.com/devrel-devsite/prod/v45f6126e22869ba24f3681953ae0924ecd350933feb899b79b82b3e4bd48e31a/developers/images/logo.svg',
    
    // Tools
    'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    'JIRA': 'https://cdn.worldvectorlogo.com/logos/jira-1.svg',
    'Slack': 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
    'Miro': 'https://cdn.worldvectorlogo.com/logos/miro-1.svg',
    
    // Analytics & BI
    'Tableau': 'https://cdn.worldvectorlogo.com/logos/tableau-software.svg',
    'PowerBI': 'https://cdn.worldvectorlogo.com/logos/power-bi-2.svg',
    
    // ERP & Business
    'SAP': 'https://cdn.worldvectorlogo.com/logos/sap-2015.svg',
    'SAP/4HANA': 'https://cdn.worldvectorlogo.com/logos/sap-2015.svg',
    'NetSuite': 'https://cdn.worldvectorlogo.com/logos/netsuite.svg',
    'Microsoft Dynamics': 'https://cdn.worldvectorlogo.com/logos/microsoft-dynamics-365.svg',
    'Great Plains': 'https://cdn.worldvectorlogo.com/logos/microsoft-dynamics-365.svg',
    'Oracle Hyperion': 'https://cdn.worldvectorlogo.com/logos/oracle-6.svg',
    'Salesforce': 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg',
    'HubSpot': 'https://cdn.worldvectorlogo.com/logos/hubspot-1.svg',
    'QuickBooks': 'https://cdn.worldvectorlogo.com/logos/quickbooks.svg',
    'Ramp': 'https://ramp.com/favicon.ico',
    'Brex': 'https://brex.com/favicon.ico',
    
    // Analytics & BI
    'QlikView': 'https://cdn.worldvectorlogo.com/logos/qlikview.svg',
    'Looker': 'https://cdn.worldvectorlogo.com/logos/looker.svg',
    'Metabase': 'https://metabase.com/favicon.ico',
    'ClickHouse': 'https://clickhouse.com/favicon.ico',
    
    // Product Analytics
    'Mixpanel': 'https://cdn.worldvectorlogo.com/logos/mixpanel.svg',
    'Amplitude': 'https://cdn.worldvectorlogo.com/logos/amplitude.svg',
    'Google Analytics': 'https://cdn.worldvectorlogo.com/logos/google-analytics-3.svg',
    'Segment': 'https://segment.com/favicon.ico',
    'Hotjar': 'https://cdn.worldvectorlogo.com/logos/hotjar.svg',
    
    // Marketing & Growth
    'Marketo': 'https://cdn.worldvectorlogo.com/logos/marketo.svg',
    'Ahrefs': 'https://ahrefs.com/favicon.ico',
    'SEMrush': 'https://cdn.worldvectorlogo.com/logos/semrush.svg',
    'Mailchimp': 'https://cdn.worldvectorlogo.com/logos/mailchimp.svg',
    
    // Programming Languages
    'SQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    'R': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
    'VBA': 'https://cdn.worldvectorlogo.com/logos/microsoft-office-2013.svg',
    
    // Backend & Databases
    'FastAPI': 'https://fastapi.tiangolo.com/img/favicon.png',
    'NeonDB': 'https://neon.tech/favicon.ico',
    'Supabase': 'https://supabase.com/favicon.ico',
    
    // Data & Analytics Platforms
    'Redshift': 'https://cdn.worldvectorlogo.com/logos/amazon-redshift.svg',
    
    // Observability
    'DataDog': 'https://cdn.worldvectorlogo.com/logos/datadog.svg',
    
    // AI & ML
    'OpenAI': 'https://cdn.worldvectorlogo.com/logos/openai-2.svg',
    'ElevenLabs': 'https://elevenlabs.io/favicon.ico',
    'MCP': 'https://modelcontextprotocol.io/favicon.ico',
    
    // General Tools
    'Confluence': 'https://cdn.worldvectorlogo.com/logos/confluence-1.svg',
    'Asana': 'https://cdn.worldvectorlogo.com/logos/asana-1.svg',
    'Trello': 'https://cdn.worldvectorlogo.com/logos/trello.svg',
    'Lucid': 'https://cdn.worldvectorlogo.com/logos/lucidchart.svg',
    
    // Collaboration & Productivity
    'Figma': 'https://cdn.worldvectorlogo.com/logos/figma-1.svg',
    'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    'Notion': 'https://cdn.worldvectorlogo.com/logos/notion-logo-1.svg',
    'Zoom': 'https://cdn.worldvectorlogo.com/logos/zoom-communications.svg',
    'Google Workspace': 'https://cdn.worldvectorlogo.com/logos/google-workspace.svg',
    'Microsoft 365': 'https://cdn.worldvectorlogo.com/logos/microsoft-office-365.svg',
    'Airtable': 'https://cdn.worldvectorlogo.com/logos/airtable.svg',
    'Zapier': 'https://cdn.worldvectorlogo.com/logos/zapier.svg',
    'Monday.com': 'https://cdn.worldvectorlogo.com/logos/monday-1.svg',
    // Vector Databases
    'Milvus': 'https://milvus.io/favicon.ico',
    'Pinecone': 'https://avatars.githubusercontent.com/u/78025208?s=200&v=4',
    'Weaviate': 'https://weaviate.io/favicon.ico',
    'pgvector': 'https://avatars.githubusercontent.com/u/109386126?s=200&v=4',

    // Audio & Video
    'FFmpeg': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/FFmpeg-icon.svg',
    'Audacity': 'https://upload.wikimedia.org/wikipedia/commons/2/21/Audacity_Logo_2018.svg',
    'OBS Studio': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/OBS_Studio_Logo.svg',
    'Adobe Premiere': 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg',
    'DaVinci Resolve': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/DaVinci_Resolve_17_logo.svg',

    // Data Science & ML Libraries
    'SciPy': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scipy/scipy-original.svg',
    'Matplotlib': 'https://matplotlib.org/_static/images/logo2.svg',
    'Seaborn': 'https://seaborn.pydata.org/_static/logo-wide-lightbg.svg',
    'Scikit-learn': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikit-learn/scikit-learn-original.svg',
    'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    'Jupyter': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
    'Plotly': 'https://images.plot.ly/logo/new-branding/plotly-logomark.png',
    'PySpark': 'https://spark.apache.org/images/spark-logo-trademark.png',
    'Hugging Face': 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    'Streamlit': 'https://streamlit.io/images/brand/streamlit-logo-primary-colormark-darktext.png',
    'NLTK': 'https://www.nltk.org/images/nltk-logo.png',
    'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
    'Dask': 'https://docs.dask.org/en/stable/_images/dask_horizontal.svg',

    // ETL & Orchestration
    'Apache Airflow': 'https://airflow.apache.org/images/airflow_logo.png',
    'Apache NiFi': 'https://nifi.apache.org/assets/images/apache-nifi-logo.svg',
    'Fivetran': 'https://fivetran.com/favicon.ico',
    'DBT': 'https://www.getdbt.com/favicon.ico',
    'Foreign Data Wrappers': '',
    'Encryption (PGP/GPG)': '',
    'System Profiling': '',

    // Graph/NoSQL/Other DBs
    'Neo4j': 'https://neo4j.com/wp-content/themes/neo4jweb/favicon.ico',
    'Elasticsearch': 'https://www.elastic.co/favicon.ico',
    'Firebase': 'https://firebase.google.com/favicon.ico',

    // File Transfer
    'SFTP': 'https://img.icons8.com/ios-filled/50/000000/sftp.png',
    'FTP': 'https://img.icons8.com/ios-filled/50/000000/ftp.png',
    'FTPS': 'https://img.icons8.com/ios-filled/50/000000/ftps.png',

    // CI/CD & DevOps
    'YAML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yaml/yaml-original.svg',
    'GitHub Actions': 'https://avatars.githubusercontent.com/u/44036562?s=200&v=4',
  };

  const logoUrl = logos[name];
  
  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt={name} 
        className={`${className} object-contain`}
        onError={(e) => {
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `<span class="text-sm font-medium text-gray-700">${name}</span>`;
          }
        }}
      />
    );
  }

  // Fallback to text for logos not in our list
  return (
    <span className="text-sm font-medium text-gray-700">{name}</span>
  );
};

export default TechLogo; 