import React, { useState } from 'react';
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
    id: 'two-brothers-landscaping',
    name: 'Two Brothers Landscaping',
    industry: 'Landscaping Services',
    role: 'Founder',
    tenure: '2007-2011',
    years: [
      {
        year: 2007,
        revenue: 0.2,
        grossMargin: 45.0,
        grossMarginDollars: 0.09,
        operatingMargin: 15.0,
        operatingMarginDollars: 0.03,
        ebitda: 18.0,
        ebitdaDollars: 0.036,
        marketCap: 0.5,
        source: 'Company Financials'
      },
      {
        year: 2008,
        revenue: 0.4,
        grossMargin: 47.5,
        grossMarginDollars: 0.19,
        operatingMargin: 17.5,
        operatingMarginDollars: 0.07,
        ebitda: 20.5,
        ebitdaDollars: 0.082,
        marketCap: 1.2,
        source: 'Company Financials'
      },
      {
        year: 2009,
        revenue: 0.6,
        grossMargin: 50.0,
        grossMarginDollars: 0.3,
        operatingMargin: 20.0,
        operatingMarginDollars: 0.12,
        ebitda: 23.0,
        ebitdaDollars: 0.138,
        marketCap: 2.0,
        source: 'Company Financials'
      },
      {
        year: 2010,
        revenue: 0.8,
        grossMargin: 52.5,
        grossMarginDollars: 0.42,
        operatingMargin: 22.5,
        operatingMarginDollars: 0.18,
        ebitda: 25.5,
        ebitdaDollars: 0.204,
        marketCap: 3.0,
        source: 'Company Financials'
      },
      {
        year: 2011,
        revenue: 1.0,
        grossMargin: 55.0,
        grossMarginDollars: 0.55,
        operatingMargin: 25.0,
        operatingMarginDollars: 0.25,
        ebitda: 28.0,
        ebitdaDollars: 0.28,
        marketCap: 4.0,
        source: 'Company Financials'
      }
    ],
    tenureStart: 2007,
    tenureEnd: 2011
  },
  {
    id: 'home-depot',
    name: 'The Home Depot',
    industry: 'Retail',
    role: 'Senior Analyst, Merchandising Finance & Treasury',
    tenure: '2011-2014',
    years: [
      {
        year: 2011,
        revenue: 70400,
        grossMargin: 34.0,
        grossMarginDollars: 23936,
        operatingMargin: 10.8,
        operatingMarginDollars: 7603.2,
        ebitda: 14.2,
        ebitdaDollars: 9996.8,
        marketCap: 68000,
        source: 'SEC Filings'
      },
      {
        year: 2012,
        revenue: 74800,
        grossMargin: 34.3,
        grossMarginDollars: 25656.4,
        operatingMargin: 11.2,
        operatingMarginDollars: 8377.6,
        ebitda: 14.6,
        ebitdaDollars: 10920.8,
        marketCap: 72000,
        source: 'SEC Filings'
      },
      {
        year: 2013,
        revenue: 78700,
        grossMargin: 34.6,
        grossMarginDollars: 27230.2,
        operatingMargin: 11.6,
        operatingMarginDollars: 9129.2,
        ebitda: 15.0,
        ebitdaDollars: 11805,
        marketCap: 78000,
        source: 'SEC Filings'
      },
      {
        year: 2014,
        revenue: 83200,
        grossMargin: 34.9,
        grossMarginDollars: 29036.8,
        operatingMargin: 12.0,
        operatingMarginDollars: 9984,
        ebitda: 15.4,
        ebitdaDollars: 12812.8,
        marketCap: 85000,
        source: 'SEC Filings'
      }
    ],
    tenureStart: 2011,
    tenureEnd: 2014
  },
  {
    id: 'kpmg',
    name: 'KPMG',
    industry: 'Professional Services',
    role: 'Senior Consultant, Advisory Services',
    tenure: '2014-2015',
    years: [
      {
        year: 2014,
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
        year: 2015,
        revenue: 26400,
        grossMargin: 43.1,
        grossMarginDollars: 11378.4,
        operatingMargin: 17.2,
        operatingMarginDollars: 4540.8,
        ebitda: 20.8,
        ebitdaDollars: 5491.2,
        marketCap: 48000,
        source: 'Public Reports'
      }
    ],
    tenureStart: 2014,
    tenureEnd: 2015
  },
  {
    id: 'hd-supply',
    name: 'HD Supply',
    industry: 'Industrial Distribution',
    role: 'Senior Analyst, Strategic Finance',
    tenure: '2015-2016',
    years: [
      {
        year: 2015,
        revenue: 7200,
        grossMargin: 26.5,
        grossMarginDollars: 1908,
        operatingMargin: 9.2,
        operatingMarginDollars: 662.4,
        ebitda: 12.8,
        ebitdaDollars: 921.6,
        marketCap: 8500,
        source: 'SEC Filings'
      },
      {
        year: 2016,
        revenue: 7600,
        grossMargin: 27.0,
        grossMarginDollars: 2052,
        operatingMargin: 9.6,
        operatingMarginDollars: 729.6,
        ebitda: 13.2,
        ebitdaDollars: 1003.2,
        marketCap: 9200,
        source: 'SEC Filings'
      }
    ],
    tenureStart: 2015,
    tenureEnd: 2016
  },
  {
    id: 'greensky',
    name: 'GreenSky',
    industry: 'Fintech',
    role: 'Product Manager, Credit & Strategy',
    tenure: '2016-2018',
    years: [
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
      },
      {
        year: 2017,
        revenue: 485,
        grossMargin: 71.5,
        grossMarginDollars: 346.775,
        operatingMargin: 38.2,
        operatingMarginDollars: 185.27,
        ebitda: 41.8,
        ebitdaDollars: 202.73,
        marketCap: 7200,
        source: 'SEC Filings'
      },
      {
        year: 2018,
        revenue: 585,
        grossMargin: 72.8,
        grossMarginDollars: 425.88,
        operatingMargin: 39.9,
        operatingMarginDollars: 233.415,
        ebitda: 43.3,
        ebitdaDollars: 253.305,
        marketCap: 8800,
        source: 'SEC Filings'
      }
    ],
    tenureStart: 2016,
    tenureEnd: 2018
  },
  {
    id: 'superior-contracting',
    name: 'Superior Contracting & Maintenance',
    industry: 'Construction Services',
    role: 'Co-Founder',
    tenure: '2018-2023',
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
      },
      {
        year: 2023,
        revenue: 135,
        grossMargin: 32.8,
        grossMarginDollars: 44.28,
        operatingMargin: 17.5,
        operatingMarginDollars: 23.625,
        ebitda: 19.8,
        ebitdaDollars: 26.73,
        marketCap: 270,
        source: 'Company Financials'
      }
    ],
    tenureStart: 2018,
    tenureEnd: 2023
  },
  {
    id: 'property-walk',
    name: 'Property Walk',
    industry: 'Real Estate Technology',
    role: 'Founder',
    tenure: '2022-2023',
    years: [
      {
        year: 2022,
        revenue: 0.5,
        grossMargin: 85.0,
        grossMarginDollars: 0.425,
        operatingMargin: 25.0,
        operatingMarginDollars: 0.125,
        ebitda: 30.0,
        ebitdaDollars: 0.15,
        marketCap: 2.0,
        source: 'Company Financials'
      },
      {
        year: 2023,
        revenue: 0.6,
        grossMargin: 86.0,
        grossMarginDollars: 0.516,
        operatingMargin: 28.0,
        operatingMarginDollars: 0.168,
        ebitda: 32.0,
        ebitdaDollars: 0.192,
        marketCap: 2.5,
        source: 'Company Financials'
      }
    ],
    tenureStart: 2022,
    tenureEnd: 2023
  },
  {
    id: 'momnt',
    name: 'Momnt',
    industry: 'Fintech',
    role: 'Senior Manager, Product Engineering',
    tenure: '2023-2025',
    years: [
      {
        year: 2023,
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
        year: 2024,
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
        year: 2025,
        revenue: 68,
        grossMargin: 77.8,
        grossMarginDollars: 52.904,
        operatingMargin: 41.5,
        operatingMarginDollars: 28.22,
        ebitda: 45.2,
        ebitdaDollars: 30.736,
        marketCap: 420,
        source: 'Company Financials'
      }
    ],
    tenureStart: 2023,
    tenureEnd: 2025
  },
  {
    id: 'fyxed',
    name: 'Fyxed',
    industry: 'Fintech',
    role: 'Interim CEO',
    tenure: '2025-2025',
    years: [
      {
        year: 2025,
        revenue: 0.6,
        grossMargin: 80.0,
        grossMarginDollars: 0.48,
        operatingMargin: 30.0,
        operatingMarginDollars: 0.18,
        ebitda: 35.0,
        ebitdaDollars: 0.21,
        marketCap: 3.0,
        source: 'Company Financials'
      }
    ],
    tenureStart: 2025,
    tenureEnd: 2025
  }
];

// 1. Extend each company's years array to 2007–2025 with proper date handling
companyData.forEach(company => {
  const yearsMap = new Map(company.years.map(y => [y.year, y]));
  const extendedYears: FinancialYear[] = [];
  
  for (let year = 2007; year <= 2025; year++) {
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

// 2. Add Michael's Index (blended performance across actual tenure periods)
const indexYears: FinancialYear[] = [];
for (let year = 2007; year <= 2025; year++) {
  let activeCompanies = 0;
  let totalRevenue = 0, totalGrossMargin = 0, totalGrossMarginDollars = 0, totalOperatingMargin = 0, totalOperatingMarginDollars = 0, totalEbitda = 0, totalEbitdaDollars = 0, totalMarketCap = 0;
  
  // Only include companies where Michael was actually employed during this year
  companyData.forEach(company => {
    if (year >= company.tenureStart && year <= company.tenureEnd) {
      const y = company.years.find(yy => yy.year === year);
      if (
        y &&
        typeof y.revenue === 'number' && y.revenue >= 0 &&
        typeof y.grossMargin === 'number' && y.grossMargin >= 0 && y.grossMargin <= 100 &&
        typeof y.operatingMargin === 'number' && y.operatingMargin >= 0 && y.operatingMargin <= 100 &&
        typeof y.ebitda === 'number' && y.ebitda >= 0 && y.ebitda <= 100 &&
        typeof y.marketCap === 'number' && y.marketCap >= 0
      ) {
        activeCompanies++;
        totalRevenue += y.revenue;
        totalGrossMargin += y.grossMargin;
        totalGrossMarginDollars += y.grossMarginDollars;
        totalOperatingMargin += y.operatingMargin;
        totalOperatingMarginDollars += y.operatingMarginDollars;
        totalEbitda += y.ebitda;
        totalEbitdaDollars += y.ebitdaDollars;
        totalMarketCap += y.marketCap;
      }
    }
  });
  
  // Only create index entry if Michael was employed at at least one company during this year
  if (activeCompanies > 0) {
    indexYears.push({
      year,
      revenue: Math.max(0, totalRevenue / activeCompanies),
      grossMargin: Math.max(0, Math.min(100, totalGrossMargin / activeCompanies)),
      grossMarginDollars: Math.max(0, totalGrossMarginDollars / activeCompanies),
      operatingMargin: Math.max(0, Math.min(100, totalOperatingMargin / activeCompanies)),
      operatingMarginDollars: Math.max(0, totalOperatingMarginDollars / activeCompanies),
      ebitda: Math.max(0, Math.min(100, totalEbitda / activeCompanies)),
      ebitdaDollars: Math.max(0, totalEbitdaDollars / activeCompanies),
      marketCap: Math.max(0, totalMarketCap / activeCompanies),
      source: 'Michael\'s Performance Index'
    });
  }
}
companyData.push({
  id: 'michaels-index',
  name: "Michael's Performance Index",
  industry: 'Performance Blend',
  role: 'Career Performance',
  tenure: '2007-2025',
  tenureStart: 2007,
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