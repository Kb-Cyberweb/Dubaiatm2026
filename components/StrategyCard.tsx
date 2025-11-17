import React from 'react';
import type { Strategy } from '../types';

interface StrategyCardProps {
  strategy: Strategy;
  index: number;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, index }) => {
  const colors = [
    'border-t-cyan-400',
    'border-t-violet-400',
    'border-t-pink-400',
  ];

  return (
    <div className={`bg-slate-800/60 rounded-lg shadow-lg p-6 border-t-4 ${colors[index % colors.length]} transform transition-transform duration-300 hover:-translate-y-2`}>
      <h4 className="text-xl font-bold text-white mb-3">{strategy.title}</h4>
      <p className="text-slate-400 text-base leading-relaxed">{strategy.description}</p>
    </div>
  );
};

export default StrategyCard;
