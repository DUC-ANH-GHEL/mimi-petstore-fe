import React from 'react';

import { Bell, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AdminShop | Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell size={20} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} className="text-gray-400" /> : <Moon size={20} className="text-gray-500" />}
          </button>
          
          <div className="flex items-center">
            <img
              src="/api/placeholder/32/32"
              alt="Admin avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;