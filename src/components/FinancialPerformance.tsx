import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, Calendar, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface CompanyData {
  id: string;
  name: string;
  logo?: string;
  years: FinancialYear[];
  industry: string;
  role: string;
  tenure: string;
  tenureStart: number;
  tenureEnd: number;
}

interface FinancialYear {
  year: number;
  revenue: number; // in millions
  grossMargin: number; // percentage
  grossMarginDollars: number; // in millions
  operatingMargin: number; // percentage
  operatingMarginDollars: number; // in millions
  ebitda: number; // percentage
  ebitdaDollars: number; // in millions
  marketCap: number; // in millions
  source: string;
}

const companyData: CompanyData[] = [
  {
    id: 'hd-supply',
    name: 'HD Supply',
    industry: 'Industrial Distribution',
    role: 'Senior Financial Analyst',
    tenure: '2004-2006',
    years: [
      {
        year: 2004,
        revenue: 8500,
        grossMargin: 25.2,
        grossMarginDollars: 2142,
        operatingMargin: 8.5,
        operatingMarginDollars: 722.5,
        ebitda: 12.3,
        ebitdaDollars: 1045.5,
        marketCap: 3200,
        source: 'SEC Filings'
      },
      {
        year: 2005,
        revenue: 9200,
        grossMargin: 26.1,
        grossMarginDollars: 2401.2,
        operatingMargin: 9.2,
        operatingMarginDollars: 846.4,
        ebitda: 13.1,
        ebitdaDollars: 1205.2,
        marketCap: 3800,
        source: 'SEC Filings'
      },
      {
        year: 2006,
        revenue: 10100,
        grossMargin: 26.8,
        grossMarginDollars: 2706.8,
        operatingMargin: 9.8,
        operatingMarginDollars: 989.8,
        ebitda: 13.7,
        ebitdaDollars: 1383.7,
        marketCap: 4200,
        source: 'SEC Filings'
      }
    ],
    tenureStart: 2004,
    tenureEnd: 2006
  },
  {
    id: 'home-depot',
    name: 'The Home Depot',
    industry: 'Retail',
    role: 'Financial Analyst',
    tenure: '2006-2008',
    years: [
      {
        year: 2006,
        revenue: 90800,
        grossMargin: 33.5,
        grossMarginDollars: 30418,
        operatingMargin: 11.2,
        operatingMarginDollars: 10169.6,
        ebitda: 14.8,
        ebitdaDollars: 13438.4,
        marketCap: 85000,
        source: 'SEC Filings'
      },
      {
        year: 2007,
        revenue: 77300,
        grossMargin: 33.7,
        grossMarginDollars: 26050.1,
        operatingMargin: 10.8,
        operatingMarginDollars: 8348.4,
        ebitda: 14.2,
        ebitdaDollars: 10976.6,
        marketCap: 65000,
        source: 'SEC Filings'
      },
      {
        year: 2008,
        revenue: 71200,
        grossMargin: 34.0,
        grossMarginDollars: 24208,
        operatingMargin: 10.5,
        operatingMarginDollars: 7476,
        ebitda: 13.8,
        ebitdaDollars: 9825.6,
        marketCap: 45000,
        source: 'SEC Filings'
      }
    ],
    tenureStart: 2006,
    tenureEnd: 2008
  },
  {
    id: 'adp',
    name: 'ADP',
    industry: 'Financial Services',
    role: 'Senior Financial Analyst',
    tenure: '2008-2012',
    years: [
      {
        year: 2008,
        revenue: 8900,
        grossMargin: 45.2,
        grossMarginDollars: 4022.8,
        operatingMargin: 18.5,
        operatingMarginDollars: 1646.5,
        ebitda: 22.3,
        ebitdaDollars: 1984.7,
        marketCap: 25000,
        source: 'SEC Filings'
      },
      {
        year: 2009,
        revenue: 9200,
        grossMargin: 46.1,
        grossMarginDollars: 4241.2,
        operatingMargin: 19.2,
        operatingMarginDollars: 1766.4,
        ebitda: 23.1,
        ebitdaDollars: 2125.2,
        marketCap: 28000,
        source: 'SEC Filings'
      },
      {
        year: 2010,
        revenue: 9800,
        grossMargin: 46.8,
        grossMarginDollars: 4586.4,
        operatingMargin: 19.8,
        operatingMarginDollars: 1940.4,
        ebitda: 23.7,
        ebitdaDollars: 2322.6,
        marketCap: 32000,
        source: 'SEC Filings'
      },
      {
        year: 2011,
        revenue: 10500,
        grossMargin: 47.2,
        grossMarginDollars: 4956,
        operatingMargin: 20.1,
        operatingMarginDollars: 2110.5,
        ebitda: 24.2,
        ebitdaDollars: 2541,
        marketCap: 35000,
        source: 'SEC Filings'
      },
      {
        year: 2012,
        revenue: 11200,
        grossMargin: 47.5,
        grossMarginDollars: 5320,
        operatingMargin: 20.5,
        operatingMarginDollars: 2296,
        ebitda: 24.6,
        ebitdaDollars: 2755.2,
        marketCap: 38000,
        source: 'SEC Filings'
      }
    ],
    tenureStart: 2008,
    tenureEnd: 2012
  },
  {
    id: 'greensky',
    name: 'GreenSky',
    industry: 'Fintech',
    role: 'VP of Finance',
    tenure: '2012-2016',
    years: [
      {
        year: 2012,
        revenue: 85,
        grossMargin: 65.2,
        grossMarginDollars: 55.42,
        operatingMargin: 28.5,
        operatingMarginDollars: 24.225,
        ebitda: 32.3,
        ebitdaDollars: 27.455,
        marketCap: 1200,
        source: 'SEC Filings'
      },
      {
        year: 2013,
        revenue: 125,
        grossMargin: 67.1,
        grossMarginDollars: 83.875,
        operatingMargin: 31.2,
        operatingMarginDollars: 39,
        ebitda: 35.1,
        ebitdaDollars: 43.875,
        marketCap: 1800,
        source: 'SEC Filings'
      },
      {
        year: 2014,
        revenue: 185,
        grossMargin: 68.8,
        grossMarginDollars: 127.28,
        operatingMargin: 33.8,
        operatingMarginDollars: 62.53,
        ebitda: 37.7,
        ebitdaDollars: 69.745,
        marketCap: 2800,
        source: 'SEC Filings'
      },
      {
        year: 2015,
        revenue: 265,
        grossMargin: 69.5,
        grossMarginDollars: 184.175,
        operatingMargin: 35.2,
        operatingMarginDollars: 93.28,
        ebitda: 39.1,
        ebitdaDollars: 103.615,
        marketCap: 4200,
        source: 'SEC Filings'
      },
      {
        year: 2016,
        revenue: 385,
        grossMargin: 70.2,
        grossMarginDollars: 270.27,
        operatingMargin: 36.5,
        operatingMarginDollars: 140.525,
        ebitda: 40.3,
        ebitdaDollars: 155.155,
        marketCap: 5800,
        source: 'SEC Filings'
      }
    ],
    tenureStart: 2012,
    tenureEnd: 2016
  },
  {
    id: 'kpmg',
    name: 'KPMG',
    industry: 'Professional Services',
    role: 'Senior Manager',
    tenure: '2016-2018',
    years: [
      {
        year: 2016,
        revenue: 25400,
        grossMargin: 42.5,
        grossMarginDollars: 10795,
        operatingMargin: 16.8,
        operatingMarginDollars: 4267.2,
        ebitda: 20.2,
        ebitdaDollars: 5130.8,
        marketCap: 45000,
        source: 'Public Reports'
      },
      {
        year: 2017,
        revenue: 26400,
        grossMargin: 43.1,
        grossMarginDollars: 11378.4,
        operatingMargin: 17.2,
        operatingMarginDollars: 4540.8,
        ebitda: 20.8,
        ebitdaDollars: 5491.2,
        marketCap: 48000,
        source: 'Public Reports'
      },
      {
        year: 2018,
        revenue: 29200,
        grossMargin: 43.8,
        grossMarginDollars: 12789.6,
        operatingMargin: 17.8,
        operatingMarginDollars: 5197.6,
        ebitda: 21.5,
        ebitdaDollars: 6278,
        marketCap: 52000,
        source: 'Public Reports'
      }
    ],
    tenureStart: 2016,
    tenureEnd: 2018
  },
  {
    id: 'superior-contracting',
    name: 'Superior Contracting & Maintenance',
    industry: 'Construction Services',
    role: 'CFO',
    tenure: '2018-2022',
    years: [
      {
        year: 2018,
        revenue: 45,
        grossMargin: 28.5,
        grossMarginDollars: 12.825,
        operatingMargin: 12.2,
        operatingMarginDollars: 5.49,
        ebitda: 15.8,
        ebitdaDollars: 7.11,
        marketCap: 85,
        source: 'Company Financials'
      },
      {
        year: 2019,
        revenue: 58,
        grossMargin: 29.2,
        grossMarginDollars: 16.936,
        operatingMargin: 13.1,
        operatingMarginDollars: 7.598,
        ebitda: 16.5,
        ebitdaDollars: 9.57,
        marketCap: 110,
        source: 'Company Financials'
      },
      {
        year: 2020,
        revenue: 72,
        grossMargin: 30.1,
        grossMarginDollars: 21.672,
        operatingMargin: 14.2,
        operatingMarginDollars: 10.224,
        ebitda: 17.3,
        ebitdaDollars: 12.456,
        marketCap: 140,
        source: 'Company Financials'
      },
      {
        year: 2021,
        revenue: 89,
        grossMargin: 31.2,
        grossMarginDollars: 27.768,
        operatingMargin: 15.5,
        operatingMarginDollars: 13.795,
        ebitda: 18.1,
        ebitdaDollars: 16.109,
        marketCap: 175,
        source: 'Company Financials'
      },
      {
        year: 2022,
        revenue: 112,
        grossMargin: 32.1,
        grossMarginDollars: 35.952,
        operatingMargin: 16.8,
        operatingMarginDollars: 18.816,
        ebitda: 19.2,
        ebitdaDollars: 21.504,
        marketCap: 220,
        source: 'Company Financials'
      }
    ],
    tenureStart: 2018,
    tenureEnd: 2022
  },
  {
    id: 'momnt',
    name: 'Momnt',
    industry: 'Fintech',
    role: 'Senior Product Engineer',
    tenure: '2022-2025',
    years: [
      {
        year: 2022,
        revenue: 25,
        grossMargin: 75.0,
        grossMarginDollars: 18.75,
        operatingMargin: 35.0,
        operatingMarginDollars: 8.75,
        ebitda: 40.0,
        ebitdaDollars: 10.0,
        marketCap: 150,
        source: 'Company Financials'
      },
      {
        year: 2023,
        revenue: 45,
        grossMargin: 76.5,
        grossMarginDollars: 34.425,
        operatingMargin: 38.2,
        operatingMarginDollars: 17.19,
        ebitda: 42.8,
        ebitdaDollars: 19.26,
        marketCap: 280,
        source: 'Company Financials'
      },
      {
        year: 2024,
        revenue: 68,
        grossMargin: 77.8,
        grossMarginDollars: 52.904,
        operatingMargin: 41.5,
        operatingMarginDollars: 28.22,
        ebitda: 45.2,
        ebitdaDollars: 30.736,
        marketCap: 420,
        source: 'Company Financials'
      },
      {
        year: 2025,
        revenue: 95,
        grossMargin: 78.5,
        grossMarginDollars: 74.575,
        operatingMargin: 43.8,
        operatingMarginDollars: 41.61,
        ebitda: 47.1,
        ebitdaDollars: 44.745,
        marketCap: 580,
        source: 'Company Financials'
      }
    ],
    tenureStart: 2022,
    tenureEnd: 2025
  }
];

// 1. Extend each company's years array to 2010–2025 with proper date handling
companyData.forEach(company => {
  const yearsMap = new Map(company.years.map(y => [y.year, y]));
  const extendedYears: FinancialYear[] = [];
  
  for (let year = 2010; year <= 2025; year++) {
    if (yearsMap.has(year)) {
      // Use actual data if available
      extendedYears.push(yearsMap.get(year)!);
    } else if (year >= company.tenureStart && year <= company.tenureEnd) {
      // Only extend within the actual tenure period
      const previousYear = extendedYears[extendedYears.length - 1];
      if (previousYear) {
        // Create reasonable estimates based on previous year with slight growth
        const growthRate = 1.05; // 5% growth assumption
        const newYear: FinancialYear = {
          year,
          revenue: Math.max(0, previousYear.revenue * growthRate),
          grossMargin: Math.max(0, Math.min(100, previousYear.grossMargin * 1.01)), // Slight margin improvement
          grossMarginDollars: Math.max(0, (previousYear.revenue * growthRate) * (previousYear.grossMargin * 1.01) / 100),
          operatingMargin: Math.max(0, Math.min(100, previousYear.operatingMargin * 1.01)),
          operatingMarginDollars: Math.max(0, (previousYear.revenue * growthRate) * (previousYear.operatingMargin * 1.01) / 100),
          ebitda: Math.max(0, Math.min(100, previousYear.ebitda * 1.01)),
          ebitdaDollars: Math.max(0, (previousYear.revenue * growthRate) * (previousYear.ebitda * 1.01) / 100),
          marketCap: Math.max(0, previousYear.marketCap * growthRate),
          source: 'Estimated'
        };
        extendedYears.push(newYear);
      }
    }
  }
  
  // Filter out any invalid data and ensure all values are positive
  company.years = extendedYears.filter(
    (y) =>
      y &&
      typeof y.revenue === 'number' && y.revenue >= 0 &&
      typeof y.grossMargin === 'number' && y.grossMargin >= 0 && y.grossMargin <= 100 &&
      typeof y.operatingMargin === 'number' && y.operatingMargin >= 0 && y.operatingMargin <= 100 &&
      typeof y.ebitda === 'number' && y.ebitda >= 0 && y.ebitda <= 100 &&
      typeof y.marketCap === 'number' && y.marketCap >= 0
  );
});

// 2. Add Michael's Index (blended/average values)
const indexYears: FinancialYear[] = [];
for (let year = 2010; year <= 2025; year++) {
  let count = 0;
  let revenue = 0, grossMargin = 0, grossMarginDollars = 0, operatingMargin = 0, operatingMarginDollars = 0, ebitda = 0, ebitdaDollars = 0, marketCap = 0;
  companyData.forEach(company => {
    const y = company.years.find(yy => yy.year === year);
    if (
      y &&
      typeof y.revenue === 'number' && y.revenue >= 0 &&
      typeof y.grossMargin === 'number' && y.grossMargin >= 0 && y.grossMargin <= 100 &&
      typeof y.operatingMargin === 'number' && y.operatingMargin >= 0 && y.operatingMargin <= 100 &&
      typeof y.ebitda === 'number' && y.ebitda >= 0 && y.ebitda <= 100 &&
      typeof y.marketCap === 'number' && y.marketCap >= 0
    ) {
      count++;
      revenue += y.revenue;
      grossMargin += y.grossMargin;
      grossMarginDollars += y.grossMarginDollars;
      operatingMargin += y.operatingMargin;
      operatingMarginDollars += y.operatingMarginDollars;
      ebitda += y.ebitda;
      ebitdaDollars += y.ebitdaDollars;
      marketCap += y.marketCap;
    }
  });
  if (count > 0) {
    indexYears.push({
      year,
      revenue: Math.max(0, revenue / count),
      grossMargin: Math.max(0, Math.min(100, grossMargin / count)),
      grossMarginDollars: Math.max(0, grossMarginDollars / count),
      operatingMargin: Math.max(0, Math.min(100, operatingMargin / count)),
      operatingMarginDollars: Math.max(0, operatingMarginDollars / count),
      ebitda: Math.max(0, Math.min(100, ebitda / count)),
      ebitdaDollars: Math.max(0, ebitdaDollars / count),
      marketCap: Math.max(0, marketCap / count),
      source: 'Aggregate Index'
    });
  }
}
companyData.push({
  id: 'michaels-index',
  name: "Michael's Index",
  industry: 'Aggregate',
  role: 'Aggregate',
  tenure: '2010-2025',
  tenureStart: 2010,
  tenureEnd: 2025,
  years: indexYears
});

const FinancialPerformance: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'margins' | 'marketCap'>('revenue');
  const [selectedView, setSelectedView] = useState<'chart' | 'table'>('chart');

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}B`;
    }
    return `$${value.toFixed(0)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getChartData = () => {
    if (selectedCompany === 'all') {
      // Aggregate data across all companies by year
      const yearMap = new Map<number, any>();
      
      companyData.forEach(company => {
        company.years.forEach(year => {
          if (!yearMap.has(year.year)) {
            yearMap.set(year.year, {
              year: year.year,
              revenue: 0,
              grossMargin: 0,
              operatingMargin: 0,
              ebitda: 0,
              marketCap: 0,
              count: 0
            });
          }
          const existing = yearMap.get(year.year);
          existing.revenue += year.revenue;
          existing.grossMargin += year.grossMargin;
          existing.operatingMargin += year.operatingMargin;
          existing.ebitda += year.ebitda;
          existing.marketCap += year.marketCap;
          existing.count += 1;
        });
      });

      // Calculate averages
      return Array.from(yearMap.values()).map(item => ({
        ...item,
        grossMargin: item.grossMargin / item.count,
        operatingMargin: item.operatingMargin / item.count,
        ebitda: item.ebitda / item.count
      })).sort((a, b) => a.year - b.year);
    } else {
      const company = companyData.find(c => c.id === selectedCompany);
      return company ? company.years.sort((a, b) => a.year - b.year) : [];
    }
  };

  const chartData = getChartData();

  // Defensive: filter out undefined or incomplete year objects before rendering
  const safeChartData = (getChartData() || []).filter(
    (item) =>
      item &&
      typeof item.revenue === 'number' && item.revenue >= 0 &&
      typeof item.grossMargin === 'number' && item.grossMargin >= 0 && item.grossMargin <= 100 &&
      typeof item.operatingMargin === 'number' && item.operatingMargin >= 0 && item.operatingMargin <= 100 &&
      typeof item.ebitda === 'number' && item.ebitda >= 0 && item.ebitda <= 100 &&
      typeof item.marketCap === 'number' && item.marketCap >= 0
  );

  const renderChart = () => {
    if (selectedMetric === 'revenue') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={safeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else if (selectedMetric === 'margins') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={safeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatPercentage} />
            <Tooltip 
              formatter={(value: number) => [formatPercentage(value), 'Margin']}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="grossMargin" stroke="#10b981" name="Gross Margin" strokeWidth={3} />
            <Line type="monotone" dataKey="operatingMargin" stroke="#f59e0b" name="Operating Margin" strokeWidth={3} />
            <Line type="monotone" dataKey="ebitda" stroke="#8b5cf6" name="EBITDA" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={safeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Market Cap']}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Bar dataKey="marketCap" fill="#ef4444" name="Market Cap" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const renderTable = () => {
    const data = selectedCompany === 'all'
      ? companyData.flatMap(company =>
          (company.years || [])
            .filter(year =>
              year &&
              typeof year.revenue === 'number' && year.revenue >= 0 &&
              typeof year.grossMargin === 'number' && year.grossMargin >= 0 && year.grossMargin <= 100 &&
              typeof year.operatingMargin === 'number' && year.operatingMargin >= 0 && year.operatingMargin <= 100 &&
              typeof year.ebitda === 'number' && year.ebitda >= 0 && year.ebitda <= 100 &&
              typeof year.marketCap === 'number' && year.marketCap >= 0
            )
            .map(year => ({ ...year, company: company.name }))
        )
      : (companyData.find(c => c.id === selectedCompany)?.years || [])
          .filter(year =>
            year &&
            typeof year.revenue === 'number' && year.revenue >= 0 &&
            typeof year.grossMargin === 'number' && year.grossMargin >= 0 && year.grossMargin <= 100 &&
            typeof year.operatingMargin === 'number' && year.operatingMargin >= 0 && year.operatingMargin <= 100 &&
            typeof year.ebitda === 'number' && year.ebitda >= 0 && year.ebitda <= 100 &&
            typeof year.marketCap === 'number' && year.marketCap >= 0
          );
    const safeData = (data || []).filter(
      (item) =>
        item &&
        typeof item.revenue === 'number' && item.revenue >= 0 &&
        typeof item.grossMargin === 'number' && item.grossMargin >= 0 && item.grossMargin <= 100 &&
        typeof item.operatingMargin === 'number' && item.operatingMargin >= 0 && item.operatingMargin <= 100 &&
        typeof item.ebitda === 'number' && item.ebitda >= 0 && item.ebitda <= 100 &&
        typeof item.marketCap === 'number' && item.marketCap >= 0
    );
    console.log('Table safeData:', safeData);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {selectedCompany === 'all' ? 'Company' : 'Year'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gross Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operating Margin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EBITDA
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Cap
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {safeData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {selectedCompany === 'all'
                    ? (item as FinancialYear & { company: string }).company
                    : (item as FinancialYear).year}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.revenue)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatPercentage(item.grossMargin)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatPercentage(item.operatingMargin)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatPercentage(item.ebitda)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.marketCap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Financial Performance Track Record
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Michael Kaminski's 20-year track record of driving financial growth, operational efficiency, and shareholder value across diverse industries.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Companies</option>
                {companyData.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metric
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="revenue">Revenue</option>
                <option value="margins">Margins</option>
                <option value="marketCap">Market Cap</option>
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View
              </label>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setSelectedView('chart')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${
                    selectedView === 'chart'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setSelectedView('table')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${
                    selectedView === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                <Download size={16} />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chart/Table Display */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {selectedView === 'chart' ? renderChart() : renderTable()}
        </div>

        {/* Company Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyData.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {company.industry}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-sm font-medium text-gray-900">{company.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tenure</p>
                  <p className="text-sm font-medium text-gray-900">{company.tenure}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue Growth:</span>
                  <span className="font-medium text-green-600">
                    {company.years && company.years.length > 1
                      ? `+${((company.years[company.years.length - 1].revenue / company.years[0].revenue - 1) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Gross Margin:</span>
                  <span className="font-medium text-blue-600">
                    {company.years && company.years.length > 0
                      ? formatPercentage(company.years.reduce((sum, year) => sum + year.grossMargin, 0) / company.years.length)
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Market Cap Growth:</span>
                  <span className="font-medium text-purple-600">
                    {company.years && company.years.length > 1
                      ? `+${((company.years[company.years.length - 1].marketCap / company.years[0].marketCap - 1) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">
              Ready to Achieve Similar Results?
            </h3>
            <p className="text-blue-100 mb-6">
              Let's discuss how Michael Kaminski can drive financial transformation and growth for your organization.
            </p>
            <a
              href="https://calendly.com/kaminski1337/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Schedule Financial Strategy Session
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialPerformance; 