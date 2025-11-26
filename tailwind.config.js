/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Configuración de dark mode: 'class' permite control manual del tema
  // Para activar dark mode, agrega la clase 'dark' al elemento <html>
  // Ejemplo: document.documentElement.classList.add('dark')
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores del design system para dark mode
        // Estos colores están definidos en src/features/adherencia/ui/ds.ts
        // y se usan con las clases dark:bg-[#color] o dark:text-[#color]
      },
    },
  },
  plugins: [],
};
