/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              color: '#4B1F42',
              backgroundColor: '#ECE5F1',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
              border: `1px solid ${theme('colors.purple.500')}`,
            },
            'ul': {
              listStyleType: 'none', 
            },
            'ul > li': {
              marginTop: '0.25em',
              marginBottom: '0.25em',
              marginLeft: '0.75em',
              paddingLeft: '0em', 
            },
            'ul > li::before': {
              content: '""',
              position: 'absolute',
              backgroundColor: '#000',
              borderRadius: '50%',
              width: '0.375em',
              height: '0.375em',
              top: 'calc(0.875em - 0.1875em)',
              left: '0.25em',
            },
            'ul > li > ul': {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
            table: {
              borderCollapse: 'collapse',
              width: '100%',
            },
            'thead, tbody': {
              borderBottom: `2px solid ${theme('colors.gray.200')}`,
            },
            'th, td': {
              padding: theme('spacing.2'),
              borderBottom: `1px solid ${theme('colors.gray.200')}`,
            },
            th: {
              backgroundColor: theme('colors.gray.100'),
              fontWeight: 'bold',
              textAlign: 'left',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
