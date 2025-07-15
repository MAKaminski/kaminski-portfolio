import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Target, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Metric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const LiveMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: 'companies',
      label: 'Companies Helped',
      value: 6,
      suffix: '+',
      icon: <Users size={24} className="text-blue-600" />,
      color: 'blue',
      description: 'Organizations transformed'
    },
    {
      id: 'capital',
      label: 'Capital Raised',
      value: 1200,
      suffix: 'M',
      icon: <DollarSign size={24} className="text-green-600" />,
      color: 'green',
      description: 'Dollars in funding secured'
    },
    {
      id: 'experience',
      label: 'Years Experience',
      value: 20,
      suffix: '+',
      icon: <Clock size={24} className="text-purple-600" />,
      color: 'purple',
      description: 'Executive leadership'
    },
    {
      id: 'success',
      label: 'Success Rate',
      value: 95,
      suffix: '%',
      icon: <Target size={24} className="text-orange-600" />,
      color: 'orange',
      description: 'Project success rate'
    },
    {
      id: 'growth',
      label: 'Avg. Growth',
      value: 40,
      suffix: '%',
      icon: <TrendingUp size={24} className="text-red-600" />,
      color: 'red',
      description: 'Average company growth'
    }
  ]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('live-metrics');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targetValues = [25, 150, 15, 95, 8, 40];
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = targetValues.map((target, index) => {
      const startValue = 0;
      const increment = target / steps;

      return setInterval(() => {
        setMetrics(prev => prev.map((metric, i) => {
          if (i === index && metric.value < target) {
            const newValue = Math.min(metric.value + increment, target);
            return { ...metric, value: Math.round(newValue) };
          }
          return metric;
        }));
      }, stepDuration);
    });

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [isVisible]);

  return (
    <div id="live-metrics" className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-4"
          >
            Michael Kaminski by the Numbers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Real-time metrics showcasing proven results and executive leadership impact.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  {metric.icon}
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-bold">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-xl font-semibold">
                    {metric.suffix}
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-1">
                  {metric.label}
                </h3>
                <p className="text-xs text-gray-300">
                  {metric.description}
                </p>
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <h3 className="text-xl font-semibold mb-4">
              Ready to Achieve Similar Results?
            </h3>
            <p className="text-gray-300 mb-6">
              Let's discuss how Michael Kaminski can drive transformation and growth for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/kaminski1337/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Schedule a Strategy Session
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveMetrics; 