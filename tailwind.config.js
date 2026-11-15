/** Configuração do Tailwind para o site MILFIX (mesmas cores e fontes do HTML original) */
module.exports = {
  content: ["./index.html", "./admin.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: { 950: '#091526', 900: '#0F233C', 800: '#173459', 700: '#21487A' },
        industrial: { amber: '#F59E0B', amberHover: '#D97706', red: '#D9232E', bg: '#F4F6F9' },
      },
    },
  },
  plugins: [],
};
