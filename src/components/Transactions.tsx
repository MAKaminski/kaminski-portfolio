import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Building2, Calendar } from 'lucide-react';
import { transactions, transactionTotals } from '../data/transactions';

const Transactions: React.FC = () => {

  const totals = transactionTotals();
  const totalValue = totals.totalM;

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
          <h2 className="display text-4xl md:text-5xl mb-4 text-white">Transaction <span className="accent">Experience</span></h2>
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
          <div className="rilla-card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">${totalValue.toLocaleString()}M</h3>
            <p className="text-white/60">Total Transaction Value</p>
          </div>
          <div className="rilla-card p-6 text-center">
            <Building2 className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">{transactions.length}</h3>
            <p className="text-white/60">Transactions Completed</p>
          </div>
          <div className="rilla-card p-6 text-center">
            <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">20+ Years</h3>
            <p className="text-white/60">Experience Span</p>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="rilla-card overflow-hidden"
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
                    className={`border-b border-white/10 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.03]'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-white">{transaction.date}</td>
                    <td className="px-6 py-4 font-bold text-primary-600">${transaction.value.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white/70">{transaction.company}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.asset === 'Equity' 
                          ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                          : 'border border-sky-400/30 bg-sky-400/10 text-sky-300'
                      }`}>
                        {transaction.asset}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70">{transaction.type}</td>
                    <td className="px-6 py-4 text-white/70">{transaction.entity}</td>
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
          {/* Derived from the table above, never typed by hand. The previous
              hard-coded version claimed 14 transactions worth $12,722M against
              a table of 11 worth $11,197M — it double-counted IPO and
              divestitures inside Equity and Debt, and was never updated when
              the Momnt 144(a) landed. */}
          {Object.entries(totals.byAsset).map(([type, summary], index) => (
            <div key={index} className="rilla-card p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">{type}</h4>
              <p className="text-2xl font-bold text-primary-600 mb-1">${summary.value.toLocaleString()}M</p>
              <p className="text-white/60">{summary.count} transactions</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Transactions; 