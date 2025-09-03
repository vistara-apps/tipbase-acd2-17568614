    import type { Config } from 'tailwindcss';

    const config: Config = {
      content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        extend: {
          colors: {
            bg: 'hsl(210, 30%, 98%)',
            accent: 'hsl(130, 60%, 45%)',
            primary: 'hsl(210, 80%, 50%)',
            surface: 'hsl(200, 35%, 95%)',
            'text-primary': 'hsl(210, 20%, 15%)',
            'text-secondary': 'hsl(210, 20%, 40%)',
          },
          borderRadius: {
            sm: '6px',
            md: '10px',
            lg: '16px',
          },
          boxShadow: {
            card: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '12px',
            lg: '16px',
            xl: '24px',
          },
          fontSize: {
            caption: ['12px', { fontWeight: '500' }],
            body: ['16px', { fontWeight: '400' }],
            heading1: ['28px', { fontWeight: '700' }],
            display: ['36px', { fontWeight: '800' }],
          },
          transitionTimingFunction: {
            'ease-in-out': 'ease-in-out',
          },
          transitionDuration: {
            base: '200ms',
            fast: '100ms',
          },
        },
      },
      plugins: [],
    };

    export default config;
  