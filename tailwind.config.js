/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#3490dc",
					hover: "#2779bd",
				},
				success: {
					DEFAULT: "#38c172",
					hover: "#2d995b",
				},
				danger: {
					DEFAULT: "#e3342f",
					hover: "#cc1f1a",
				},
				gray: {
					light: "#f1f5f8",
					DEFAULT: "#b8c2cc",
					dark: "#8795a1",
				},
				text: {
					primary: "#22292f",
					secondary: "#3d4852",
					muted: "#8795a1",
				},
			},
		},
	},
	plugins: [],
};
