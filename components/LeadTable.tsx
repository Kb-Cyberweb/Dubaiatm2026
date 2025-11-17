import React from 'react';
import type { Lead } from '../types';

interface LeadTableProps {
  leads: Lead[];
}

const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {

  const renderContact = (contact: string) => {
    if (!contact) return <span className="text-slate-500">N/A</span>;

    const isEmail = contact.includes('@') && !contact.includes(' ');
    if (isEmail) {
      return (
        <a
          href={`mailto:${contact}`}
          className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {contact}
        </a>
      );
    }

    const isUrl = contact.startsWith('http') || contact.startsWith('www.');
    if (isUrl) {
      const url = contact.startsWith('http') ? contact : `https://${contact}`;
      return (
        <a
          href={url}
          className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {contact}
        </a>
      );
    }
    
    // Default to plain text
    return <span className="text-slate-300">{contact}</span>;
  };

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900/70">
            <tr>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-amber-300 uppercase tracking-wider sm:pl-6">Business Name</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-amber-300 uppercase tracking-wider">Industry</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-amber-300 uppercase tracking-wider hidden lg:table-cell">Location</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-amber-300 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-amber-300 uppercase tracking-wider sm:pr-6">Reason for Lead</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-800">
            {leads.map((lead, index) => (
              <tr key={index} className="hover:bg-slate-700/50 transition-colors duration-200">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{lead.businessName}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">{lead.industry}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300 hidden lg:table-cell">{lead.location}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm hidden md:table-cell">{renderContact(lead.contact)}</td>
                <td className="whitespace-normal px-4 py-4 text-sm text-slate-400 max-w-sm sm:pr-6">{lead.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;