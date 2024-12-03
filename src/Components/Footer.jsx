import React from 'react';

export default function Footer() {
  const fixedFooter = {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '16px',
    textAlign: 'center',
  };

  return (
    <footer style={fixedFooter}>
      <p className="text-sm md:text-base">© 2024 Dynamic Form</p>
    </footer>
  );
}
