import React, { useState, useCallback } from 'react';
import ClipboardIcon from './icons/ClipboardIcon';

interface OutreachMessageCardProps {
  message: string;
}

const OutreachMessageCard: React.FC<OutreachMessageCardProps> = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyMessage = useCallback(() => {
    navigator.clipboard.writeText(message).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
      console.error('Failed to copy message:', err);
    });
  }, [message]);

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-xl p-6">
      <h4 className="text-xl font-semibold text-white mb-4">Your Outreach Message</h4>
      <p className="bg-slate-900 rounded-md p-4 text-slate-300 text-sm mb-4 border border-slate-700">
        {message}
      </p>
      <button
        onClick={handleCopyMessage}
        disabled={isCopied}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:bg-green-700 disabled:cursor-default"
        aria-label="Copy outreach message"
      >
        <ClipboardIcon className="h-5 w-5" />
        {isCopied ? 'Message Copied!' : 'Copy Message'}
      </button>
    </div>
  );
};

export default OutreachMessageCard;
