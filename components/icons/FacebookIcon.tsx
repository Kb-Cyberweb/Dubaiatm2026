import React from 'react';

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89H8.207v-2.99h2.231V9.43c0-2.209 1.343-3.418 3.32-3.418.942 0 1.954.172 1.954.172v2.544h-1.29C13.5 8.725 13 9.531 13 10.32v1.57h2.802l-.44 2.99H13v7.008c4.781-.75 8.438-4.887 8.438-9.888z" />
  </svg>
);

export default FacebookIcon;
