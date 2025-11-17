import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center mt-8" aria-label="Pagination">
      {isLoading && (
        <div className="flex items-center gap-2 text-slate-400">
          <LoadingSpinner />
          <span>Loading page...</span>
        </div>
      )}
      {!isLoading && (
        <div className="flex items-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
                Previous
            </button>
            
            {pageNumbers.map((number) => (
                <button
                key={number}
                onClick={() => onPageChange(number)}
                disabled={isLoading}
                className={`w-10 h-10 text-sm font-medium rounded-md transition-colors ${
                    currentPage === number
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                aria-current={currentPage === number ? 'page' : undefined}
                >
                {number}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
                Next
            </button>
        </div>
      )}
    </nav>
  );
};

export default Pagination;