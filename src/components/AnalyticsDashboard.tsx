import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MousePointer, 
  Download, 
  ExternalLink, 
  Clock, 
  MapPin, 
  Globe,
  TrendingUp,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  topReferrers: Array<{ source: string; visits: number }>;
  topCountries: Array<{ country: string; visits: number }>;
  deviceTypes: Array<{ device: string; percentage: number }>;
  userInteractions: Array<{ action: string; count: number; timestamp: string }>;
  fileDownloads: Array<{ file: string; downloads: number }>;
  externalClicks: Array<{ link: string; clicks: number }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    averageTimeOnPage: 0,
    bounceRate: 0,
    topPages: [],
    topReferrers: [],
    topCountries: [],
    deviceTypes: [],
    userInteractions: [],
    fileDownloads: [],
    externalClicks: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - replace with actual Google Analytics API calls
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual Google Analytics data
      setAnalyticsData({
        pageViews: 1247,
        uniqueVisitors: 892,
        averageTimeOnPage: 187,
        bounceRate: 34.2,
        topPages: [
          { page: '/', views: 456 },
          { page: '/cfo', views: 234 },
          { page: '/cpo', views: 189 },
          { page: '/strategy', views: 156 },
          { page: '/technology', views: 123 }
        ],
        topReferrers: [
          { source: 'Direct', visits: 567 },
          { source: 'LinkedIn', visits: 234 },
          { source: 'Google', visits: 189 },
          { source: 'GitHub', visits: 123 },
          { source: 'Twitter', visits: 78 }
        ],
        topCountries: [
          { country: 'United States', visits: 456 },
          { country: 'United Kingdom', visits: 123 },
          { country: 'Canada', visits: 89 },
          { country: 'Germany', visits: 67 },
          { country: 'Australia', visits: 45 }
        ],
        deviceTypes: [
          { device: 'Desktop', percentage: 68 },
          { device: 'Mobile', percentage: 28 },
          { device: 'Tablet', percentage: 4 }
        ],
        userInteractions: [
          { action: 'Resume Downloaded', count: 45, timestamp: '2024-01-15' },
          { action: 'Calendar Link Clicked', count: 23, timestamp: '2024-01-15' },
          { action: 'Contact Section Clicked', count: 34, timestamp: '2024-01-15' },
          { action: 'Role Page Visited (CFO)', count: 67, timestamp: '2024-01-15' },
          { action: 'Role Page Visited (CPO)', count: 45, timestamp: '2024-01-15' }
        ],
        fileDownloads: [
          { file: 'Kaminski_Resume.pdf', downloads: 45 },
          { file: 'Financial_Performance.pdf', downloads: 23 },
          { file: 'Strategy_Overview.pdf', downloads: 12 }
        ],
        externalClicks: [
          { link: 'LinkedIn Profile', clicks: 89 },
          { link: 'GitHub Profile', clicks: 67 },
          { link: 'Calendly Booking', clicks: 34 },
          { link: 'Email Contact', clicks: 23 }
        ]
      });
      
      setIsLoading(false);
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    trend?: string;
    color?: string;
  }> = ({ title, value, icon, trend, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const DataTable: React.FC<{ 
    title: string; 
    data: Array<{ [key: string]: any }>; 
    columns: string[];
  }> = ({ title, data, columns }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th key={column} className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100">
                {columns.map((column) => (
                  <td key={column} className="py-2 px-4 text-sm text-gray-900">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive visitor insights and user behavior analysis</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Page Views"
            value={analyticsData.pageViews.toLocaleString()}
            icon={<Eye className="w-6 h-6 text-blue-600" />}
            trend="+12.5%"
            color="blue"
          />
          <StatCard
            title="Unique Visitors"
            value={analyticsData.uniqueVisitors.toLocaleString()}
            icon={<Users className="w-6 h-6 text-green-600" />}
            trend="+8.3%"
            color="green"
          />
          <StatCard
            title="Avg. Time on Page"
            value={`${Math.floor(analyticsData.averageTimeOnPage / 60)}m ${analyticsData.averageTimeOnPage % 60}s`}
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            trend="+5.2%"
            color="purple"
          />
          <StatCard
            title="Bounce Rate"
            value={`${analyticsData.bounceRate}%`}
            icon={<Target className="w-6 h-6 text-orange-600" />}
            trend="-2.1%"
            color="orange"
          />
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <DataTable
            title="Top Pages"
            data={analyticsData.topPages}
            columns={['page', 'views']}
          />

          {/* Top Referrers */}
          <DataTable
            title="Traffic Sources"
            data={analyticsData.topReferrers}
            columns={['source', 'visits']}
          />

          {/* User Interactions */}
          <DataTable
            title="User Interactions"
            data={analyticsData.userInteractions}
            columns={['action', 'count', 'timestamp']}
          />

          {/* File Downloads */}
          <DataTable
            title="File Downloads"
            data={analyticsData.fileDownloads}
            columns={['file', 'downloads']}
          />

          {/* External Clicks */}
          <DataTable
            title="External Link Clicks"
            data={analyticsData.externalClicks}
            columns={['link', 'clicks']}
          />

          {/* Geographic Data */}
          <DataTable
            title="Top Countries"
            data={analyticsData.topCountries}
            columns={['country', 'visits']}
          />
        </div>

        {/* Device Distribution */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsData.deviceTypes.map((device) => (
                <div key={device.device} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{device.percentage}%</div>
                  <div className="text-sm text-gray-600">{device.device}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 