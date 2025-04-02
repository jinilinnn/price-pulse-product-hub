
import React from 'react';
import Navbar from './Navbar';

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="pt-16 px-4 md:px-8 flex-grow">
        {children}
      </div>
      <footer className="bg-white border-t border-gray-200 py-4 px-4 md:px-8">
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PricePulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PageContainer;
