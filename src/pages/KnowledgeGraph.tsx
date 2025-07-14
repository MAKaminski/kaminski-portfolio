import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Map, Building, Code, TrendingUp, Target, Award, Filter, X, Search, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Node {
  id: string;
  label: string;
  type: 'skill' | 'experience' | 'company' | 'expertise' | 'project' | 'education';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  description?: string;
  connections: string[];
  category: string;
}

interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

const KnowledgeGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState<Node | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan] = useState({ x: 0, y: 0 });

  // Knowledge graph data
  const nodes: Node[] = [
    // Core Skills
    { id: 'leadership', label: 'Executive Leadership', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 80, color: '#3B82F6', description: 'CXO/CTO level leadership across multiple industries', connections: ['strategy', 'finance', 'product', 'technology'], category: 'Leadership' },
    { id: 'strategy', label: 'Strategic Planning', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 70, color: '#10B981', description: 'Corporate strategy, M&A, market positioning', connections: ['leadership', 'finance', 'product'], category: 'Strategy' },
    { id: 'finance', label: 'Financial Management', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 75, color: '#F59E0B', description: 'CFO-level financial operations, PE reporting', connections: ['leadership', 'strategy', 'greensky', 'abs144a'], category: 'Finance' },
    { id: 'product', label: 'Product Strategy', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 65, color: '#8B5CF6', description: 'Product development, market analysis, user experience', connections: ['leadership', 'strategy', 'technology'], category: 'Product' },
    { id: 'technology', label: 'Technology Leadership', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 70, color: '#EF4444', description: 'CTO-level technology strategy and implementation', connections: ['leadership', 'product', 'ai-ml'], category: 'Technology' },
    { id: 'ai-ml', label: 'AI/ML', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 60, color: '#EC4899', description: 'Machine learning, data science, AI implementation', connections: ['technology', 'analytics'], category: 'Technology' },
    { id: 'analytics', label: 'Data Analytics', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 55, color: '#06B6D4', description: 'Business intelligence, KPI development, reporting', connections: ['finance', 'ai-ml', 'strategy'], category: 'Analytics' },

    // Companies
    { id: 'greensky', label: 'GreenSky', type: 'company', x: 0, y: 0, vx: 0, vy: 0, size: 60, color: '#059669', description: 'Fintech lending platform, $4B+ portfolio', connections: ['finance', 'technology', 'fintech'], category: 'Companies' },
    { id: 'abs144a', label: 'ABS 144A', type: 'company', x: 0, y: 0, vx: 0, vy: 0, size: 50, color: '#DC2626', description: 'Securitization platform, $2B+ transactions', connections: ['finance', 'securitization'], category: 'Companies' },
    { id: 'fintech', label: 'Fintech', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 45, color: '#7C3AED', description: 'Financial technology platforms and solutions', connections: ['greensky', 'finance', 'technology'], category: 'Industries' },
    { id: 'securitization', label: 'Securitization', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 40, color: '#EA580C', description: 'Asset-backed securities and structured finance', connections: ['abs144a', 'finance'], category: 'Finance' },

    // Specialized Expertise
    { id: 'pe-reporting', label: 'PE Reporting', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 55, color: '#0891B2', description: 'Private equity portfolio reporting and analytics', connections: ['finance', 'analytics'], category: 'Finance' },
    { id: 'm-a', label: 'M&A', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 50, color: '#BE185D', description: 'Mergers and acquisitions strategy and execution', connections: ['strategy', 'finance'], category: 'Strategy' },
    { id: 'revenue-ops', label: 'Revenue Operations', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 45, color: '#65A30D', description: 'Revenue optimization and operational efficiency', connections: ['finance', 'analytics', 'strategy'], category: 'Operations' },

    // Target Industries
    { id: 'saas', label: 'SaaS', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 50, color: '#2563EB', description: 'Software-as-a-Service business models', connections: ['product', 'technology', 'revenue-ops'], category: 'Industries' },
    { id: 'fintech-target', label: 'Fintech', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 45, color: '#7C3AED', description: 'Financial technology and digital banking', connections: ['finance', 'technology', 'greensky'], category: 'Industries' },
    { id: 'healthcare', label: 'Healthcare', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 40, color: '#DC2626', description: 'Healthcare technology and digital health', connections: ['product', 'technology'], category: 'Industries' },
    { id: 'ecommerce', label: 'E-commerce', type: 'expertise', x: 0, y: 0, vx: 0, vy: 0, size: 40, color: '#EA580C', description: 'Digital commerce and marketplace platforms', connections: ['product', 'revenue-ops'], category: 'Industries' },

    // Tools & Technologies
    { id: 'react', label: 'React', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 35, color: '#61DAFB', description: 'Frontend development framework', connections: ['technology'], category: 'Technologies' },
    { id: 'python', label: 'Python', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 40, color: '#3776AB', description: 'Programming language for data science', connections: ['ai-ml', 'analytics'], category: 'Technologies' },
    { id: 'sql', label: 'SQL', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 35, color: '#336791', description: 'Database querying and management', connections: ['analytics', 'finance'], category: 'Technologies' },
    { id: 'tableau', label: 'Tableau', type: 'skill', x: 0, y: 0, vx: 0, vy: 0, size: 30, color: '#E97627', description: 'Data visualization and BI platform', connections: ['analytics'], category: 'Technologies' },
  ];

  const links: GraphLink[] = [
    // Core connections
    { source: 'leadership', target: 'strategy', strength: 0.9 },
    { source: 'leadership', target: 'finance', strength: 0.8 },
    { source: 'leadership', target: 'product', strength: 0.7 },
    { source: 'leadership', target: 'technology', strength: 0.8 },
    { source: 'strategy', target: 'finance', strength: 0.8 },
    { source: 'strategy', target: 'product', strength: 0.7 },
    { source: 'finance', target: 'greensky', strength: 0.9 },
    { source: 'finance', target: 'abs144a', strength: 0.8 },
    { source: 'technology', target: 'ai-ml', strength: 0.8 },
    { source: 'ai-ml', target: 'analytics', strength: 0.7 },
    { source: 'finance', target: 'analytics', strength: 0.8 },
    { source: 'greensky', target: 'fintech', strength: 0.9 },
    { source: 'abs144a', target: 'securitization', strength: 0.9 },
    { source: 'finance', target: 'pe-reporting', strength: 0.8 },
    { source: 'strategy', target: 'm-a', strength: 0.8 },
    { source: 'finance', target: 'revenue-ops', strength: 0.7 },
    { source: 'product', target: 'saas', strength: 0.8 },
    { source: 'technology', target: 'saas', strength: 0.7 },
    { source: 'technology', target: 'react', strength: 0.6 },
    { source: 'ai-ml', target: 'python', strength: 0.8 },
    { source: 'analytics', target: 'sql', strength: 0.7 },
    { source: 'analytics', target: 'tableau', strength: 0.6 },
  ];

  // Filter and search logic
  const getFilteredNodes = useCallback(() => {
    let filtered = nodes;
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(node => node.type === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(node => 
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [filter, searchTerm]);

  const getFilteredLinks = useCallback(() => {
    const filteredNodes = getFilteredNodes();
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    
    return links.filter(link => 
      filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    );
  }, [getFilteredNodes, links]);

  // Physics simulation
  const simulatePhysics = useCallback((nodes: Node[], links: GraphLink[]) => {
    // const G = 0.1; // Gravitational constant (unused)
    const repulsion = 1000; // Repulsion force
    const attraction = 0.1; // Link attraction force
    const damping = 0.95; // Velocity damping

    // Apply repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = repulsion / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }
    }

    // Apply attraction from links
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      
      if (source && target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = (distance - 150) * attraction * link.strength;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          source.vx += fx;
          source.vy += fy;
          target.vx -= fx;
          target.vy -= fy;
        }
      }
    });

    // Update positions and apply damping
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      node.vx *= damping;
      node.vy *= damping;
    });
  }, []);

  // Mouse interaction handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    const filteredNodes = getFilteredNodes();
    for (const node of filteredNodes) {
      const distance = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
      if (distance <= node.size / 2) {
        setIsDragging(true);
        setDragNode(node);
        break;
      }
    }
  }, [pan, zoom, getFilteredNodes]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    if (isDragging && dragNode) {
      dragNode.x = mouseX;
      dragNode.y = mouseY;
      dragNode.vx = 0;
      dragNode.vy = 0;
    } else {
      // Check hover
      const filteredNodes = getFilteredNodes();
      let foundHover = false;
      for (const node of filteredNodes) {
        const distance = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
        if (distance <= node.size / 2) {
          setHoveredNode(node);
          foundHover = true;
          break;
        }
      }
      if (!foundHover) {
        setHoveredNode(null);
      }
    }
  }, [isDragging, dragNode, pan, zoom, getFilteredNodes]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragNode(null);
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    const filteredNodes = getFilteredNodes();
    for (const node of filteredNodes) {
      const distance = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
      if (distance <= node.size / 2) {
        setSelectedNode(selectedNode?.id === node.id ? null : node);
        break;
      }
    }
  }, [isDragging, pan, zoom, getFilteredNodes, selectedNode]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(2, prev * delta)));
  }, []);

  // Initialize and animate
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize node positions in a circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      node.x = centerX + Math.cos(angle) * radius;
      node.y = centerY + Math.sin(angle) * radius;
      node.vx = 0;
      node.vy = 0;
    });

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('wheel', handleWheel);

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply transformations
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const filteredNodes = getFilteredNodes();
      const filteredLinks = getFilteredLinks();

      // Simulate physics
      simulatePhysics(filteredNodes, filteredLinks);

      // Draw links
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)';
      ctx.lineWidth = 2 / zoom;
      filteredLinks.forEach(link => {
        const sourceNode = filteredNodes.find(n => n.id === link.source);
        const targetNode = filteredNodes.find(n => n.id === link.target);
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      filteredNodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const size = isSelected ? node.size * 1.2 : isHovered ? node.size * 1.1 : node.size;

        // Node shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15 / zoom;
        ctx.shadowOffsetX = 3 / zoom;
        ctx.shadowOffsetY = 3 / zoom;

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Node border
        ctx.strokeStyle = isSelected ? '#1F2937' : '#FFFFFF';
        ctx.lineWidth = isSelected ? 4 / zoom : 2 / zoom;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${Math.max(12, size / 5)}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      });

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationId);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleClick, handleWheel, getFilteredNodes, getFilteredLinks, simulatePhysics, selectedNode, hoveredNode, pan, zoom, nodes]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'skill': return <Code className="w-4 h-4" />;
      case 'experience': return <Building className="w-4 h-4" />;
      case 'company': return <Building className="w-4 h-4" />;
      case 'expertise': return <Target className="w-4 h-4" />;
      case 'project': return <TrendingUp className="w-4 h-4" />;
      case 'education': return <Award className="w-4 h-4" />;
      default: return <Map className="w-4 h-4" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All', count: nodes.length },
    { id: 'skill', label: 'Skills', count: nodes.filter(n => n.type === 'skill').length },
    { id: 'company', label: 'Companies', count: nodes.filter(n => n.type === 'company').length },
    { id: 'expertise', label: 'Expertise', count: nodes.filter(n => n.type === 'expertise').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Portfolio</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Knowledge Graph</h1>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <Map className="w-5 h-5 text-white" />
              <span className="text-white text-sm">Interactive Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="absolute top-20 left-6 z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Filters & Search</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-white hover:text-blue-300 transition-colors"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Search */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search nodes..."
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Filter by Type</label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setFilter(category.id)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
                          filter === category.id 
                            ? 'bg-blue-500 text-white' 
                            : 'text-white hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {getNodeIcon(category.id)}
                          <span>{category.label}</span>
                        </div>
                        <span className="text-xs opacity-75">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Zoom</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setZoom(prev => Math.max(0.5, prev * 0.9))}
                      className="px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-white text-sm">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(prev => Math.min(2, prev * 1.1))}
                      className="px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ background: 'transparent' }}
      />

      {/* Node Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-20 right-6 z-10 w-80"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <h3 className="text-white font-bold text-lg">{selectedNode.label}</h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full capitalize">
                  {selectedNode.type}
                </span>
                <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full ml-2">
                  {selectedNode.category}
                </span>
              </div>

              {selectedNode.description && (
                <p className="text-white/80 text-sm mb-4">{selectedNode.description}</p>
              )}

              <div className="space-y-2">
                <h4 className="text-white font-semibold text-sm flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Connected to:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.connections.map(connectionId => {
                    const connectedNode = nodes.find(n => n.id === connectionId);
                    return connectedNode ? (
                      <button
                        key={connectionId}
                        onClick={() => setSelectedNode(connectedNode)}
                        className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white text-xs px-2 py-1 rounded-full transition-colors"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: connectedNode.color }}
                        />
                        <span>{connectedNode.label}</span>
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-20 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
            style={{
              left: hoveredNode.x * zoom + pan.x + 20,
              top: hoveredNode.y * zoom + pan.y - 20,
            }}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredNode.color }}
              />
              <span className="text-white font-medium">{hoveredNode.label}</span>
            </div>
            <p className="text-white/70 text-xs mt-1 capitalize">{hoveredNode.type}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-white text-sm">Core Skills</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white text-sm">Companies</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-white text-sm">Expertise Areas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-white text-sm">Technologies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-xs">
          <h3 className="text-white font-semibold mb-2">How to Navigate</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Click nodes to see details</li>
            <li>• Drag nodes to move them</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Use filters to focus on specific types</li>
            <li>• Search for specific nodes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraph; 