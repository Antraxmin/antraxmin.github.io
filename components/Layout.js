import React from 'react';
import Link from 'next/link';

const GithubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9.026 23.126 9.026 22.813C9.026 22.532 9.015 21.624 9.015 20.613C6 21.187 5.22 19.875 4.98 19.188C4.845 18.836 4.26 17.76 3.75 17.473C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.663 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.902C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.982 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.982 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.813C15 23.126 15.225 23.503 15.825 23.387C20.565 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="currentColor"/>
  </svg>
);

export default function Layout({ children }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <header className="flex justify-between items-center mb-6">
        <Link href="/">
          <p className="text-2xl font-bold text-gray-800">Antraxmin</p>
        </Link>
        <Link href="https://github.com/Antraxmin" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
          <GithubIcon />
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
}