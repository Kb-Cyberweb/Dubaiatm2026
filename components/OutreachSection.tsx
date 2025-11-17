import React from 'react';
import type { SocialGroup } from '../types';
import GroupList from './GroupList';
import OutreachMessageCard from './OutreachMessageCard';
import FacebookIcon from './icons/FacebookIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import LoadingSpinner from './LoadingSpinner';

interface OutreachSectionProps {
  message: string;
  onFindFacebook: () => void;
  onFindLinkedIn: () => void;
  facebookGroups: SocialGroup[];
  linkedinGroups: SocialGroup[];
  isFacebookLoading: boolean;
  isLinkedInLoading: boolean;
  facebookFetched: boolean;
  linkedinFetched: boolean;
}

const OutreachSection: React.FC<OutreachSectionProps> = ({
  message,
  onFindFacebook,
  onFindLinkedIn,
  facebookGroups,
  linkedinGroups,
  isFacebookLoading,
  isLinkedInLoading,
  facebookFetched,
  linkedinFetched,
}) => {
  const anyLoading = isFacebookLoading || isLinkedInLoading;

  return (
    <section aria-labelledby="outreach-heading">
      <h3 id="outreach-heading" className="text-3xl font-bold text-center mb-8 text-amber-400">Social Groups for Lead Generation</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onFindFacebook}
              disabled={anyLoading || facebookFetched}
              className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isFacebookLoading ? <LoadingSpinner /> : <FacebookIcon className="h-6 w-6" />}
              <span>{facebookFetched ? 'Facebook Groups Found' : 'Find Facebook Groups'}</span>
            </button>
            <button
              onClick={onFindLinkedIn}
              disabled={anyLoading || linkedinFetched}
              className="flex-1 flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50"
            >
              {isLinkedInLoading ? <LoadingSpinner /> : <LinkedInIcon className="h-6 w-6" />}
              <span>{linkedinFetched ? 'LinkedIn Groups Found' : 'Find LinkedIn Groups'}</span>
            </button>
          </div>

          {(facebookFetched || isFacebookLoading) && (
            <GroupList platform="Facebook" isLoading={isFacebookLoading} groups={facebookGroups} hasBeenFetched={facebookFetched} />
          )}
          {(linkedinFetched || isLinkedInLoading) && (
            <GroupList platform="LinkedIn" isLoading={isLinkedInLoading} groups={linkedinGroups} hasBeenFetched={linkedinFetched} />
          )}
        </div>
        
        <div className="sticky top-24">
          <OutreachMessageCard message={message} />
        </div>
      </div>
    </section>
  );
};

export default OutreachSection;
