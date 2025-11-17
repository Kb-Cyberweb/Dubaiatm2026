import React from 'react';
import BuildingIcon from './icons/BuildingIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-950/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <BuildingIcon className="h-8 w-8 text-amber-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Dubai Business Lead Generator
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
