import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, Calendar } from 'lucide-react';

const Transactions: React.FC = () => {
  const transactions = [
    {
      date: "Jun 2024",
      value: 400,
      company: "Momnt",
      asset: "Debt",
      type: "144(a)",
      entity: "Saluda Grade"
    },
    {
      date: "Sep 2023",
      value: 15,
      company: "Momnt",
      asset: "Equity",
      type: "Series B",
      entity: "TruStage Ventures"
    },
    {
      date: "May 2018",
      value: 1010,
      company: "GreenSky",
      asset: "Equity",
      type: "S1",
      entity: "Public Markets"
    },
    {
      date: "Dec 2017",
      value: 200,
      company: "GreenSky",
      asset: "Debt",
      type: "Debt Facility",
      entity: "PIMCO"
    },
    {
      date: "Apr 2016",
      value: 1000,
      company: "HD Supply",
      asset: "Debt",
      type: "Senior Unsecured",
      entity: "Public Markets"
    },
    {
      date: "Feb 2015",
      value: 825,
      company: "HD Supply",
      asset: "Equity",
      type: "Divestiture",
      entity: "Power Solutions"
    },
    {
      date: "Apr 2014",
      value: 90,
      company: "HD Supply",
      asset: "Equity",
      type: "Divestiture",
      entity: "Crown Bolt"
    },
    {
      date: "Apr 2014",
      value: 957,
      company: "HD Supply",
      asset: "Equity",
      type: "Secondary",
      entity: "Bain, Carlyle, Dublier & Rice"
    },
    {
      date: "May 2012",
      value: 4000,
      company: "Home Depot",
      asset: "Equity",
      type: "Share Repurchase",
      entity: "Goldman"
    },
    {
      date: "Oct 2011",
      value: 700,
      company: "Home Depot",
      asset: "Debt",
      type: "Line of Credit",
      entity: "Citi"
    },
    {
      date: "Sep 2011",
      value: 2000,
      company: "Home Depot",
      asset: "Debt",
      type: "Senior Unsecured",
      entity: "Public Markets"
    }
  ];

  const totalValue = transactions.reduce((sum, transaction) => sum + transaction.value, 0);

  return (
    <section id="transactions" className="section-padding" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
          style={{ color: 'var(--primary)' }}
        >
          <h2 className="text-4xl font-bold mb-4">Transaction Experience</h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--secondary)' }}>
            Proven track record in complex financial transactions across multiple industries and deal types
          </p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}M</h3>
            <p className="text-gray-600">Total Transaction Value</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <Building2 className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">{transactions.length}</h3>
            <p className="text-gray-600">Transactions Completed</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">20+ Years</h3>
            <p className="text-gray-600">Experience Span</p>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Value (MM)</th>
                  <th className="px-6 py-4 text-left font-semibold">Company</th>
                  <th className="px-6 py-4 text-left font-semibold">Asset</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Entity</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ backgroundColor: '#f8fafc', scale: 1.01 }}
                    className={`border-b border-gray-200 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{transaction.date}</td>
                    <td className="px-6 py-4 font-bold text-primary-600">${transaction.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700">{transaction.company}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.asset === 'Equity' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.asset}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{transaction.type}</td>
                    <td className="px-6 py-4 text-gray-700">{transaction.entity}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Transaction Types Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { type: "Equity", count: 6, value: 6897 },
            { type: "Debt", count: 5, value: 3900 },
            { type: "IPO/S1", count: 1, value: 1010 },
            { type: "Divestitures", count: 2, value: 915 }
          ].map((summary, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{summary.type}</h4>
              <p className="text-2xl font-bold text-primary-600 mb-1">${summary.value.toLocaleString()}M</p>
              <p className="text-gray-600">{summary.count} transactions</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Transactions; 