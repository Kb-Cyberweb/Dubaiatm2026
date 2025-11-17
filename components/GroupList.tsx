import React from 'react';
import type { SocialGroup } from '../types';
import FacebookIcon from './icons/FacebookIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import LoadingSpinner from './LoadingSpinner';

interface GroupListProps {
  platform: 'Facebook' | 'LinkedIn';
  isLoading: boolean;
  groups: SocialGroup[];
  hasBeenFetched: boolean;
}

const GroupList: React.FC<GroupListProps> = ({ platform, isLoading, groups, hasBeenFetched }) => {
  if (!isLoading && !hasBeenFetched) {
    return null;
  }

  const PlatformIcon = ({ platform }: { platform: 'Facebook' | 'LinkedIn' }) => {
    if (platform === 'Facebook') {
      return <FacebookIcon className="h-6 w-6 text-blue-500" />;
    }
    return <LinkedInIcon className="h-6 w-6 text-sky-400" />;
  };

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-xl p-6 animate-fade-in">
      <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <PlatformIcon platform={platform} />
        {platform} Groups
      </h4>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : hasBeenFetched && groups.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-900/50 rounded-lg">
          <p className="text-slate-400">No relevant {platform} groups were found.</p>
          <p className="text-slate-500 text-sm mt-1">This can happen sometimes. Feel free to try again!</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-700">
          {groups.map((group, index) => (
            <li key={index} className="py-4">
              <p className="font-bold text-slate-200">
                {group.link ? (
                  <a href={group.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-indigo-400 transition-colors duration-200">
                    {group.name}
                  </a>
                ) : (
                  group.name
                )}
              </p>
              <p className="text-slate-400 text-sm mt-1">{group.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default GroupList;
