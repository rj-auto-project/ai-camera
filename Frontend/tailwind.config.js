// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JS, JSX, TS, and TSX files in the src directory
    './public/index.html',         // Include your HTML files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b', 
        secondary: '#374151',
      },
      backgroundImage: {
        'gradient-to-r': 'linear-gradient(to right, #1e293b, #374151)', 
        'gradient-to-b': 'linear-gradient(to bottom, #1e293b, #374151)', 
        'gradient-dark': 'linear-gradient(to right, #1e293b, #374151)',
      },
    },
  },
  plugins: [],
};
