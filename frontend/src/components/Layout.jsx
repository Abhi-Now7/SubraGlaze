import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pb-12 fade-in">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;