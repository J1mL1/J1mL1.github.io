/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'neu-base': '#e0e0e0',
				'neu-light': '#ffffff',
				'neu-dark': '#c0c0c0',
				'neu-dark-base': '#2e2e2e',
				'neu-dark-light': '#3a3a3a',
				'neu-dark-dark': '#1a1a1a',
			},
		},
	},
	plugins: [
		require('tailwindcss-neumorphism'),
	],
}
