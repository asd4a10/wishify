/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#3498db",
					hover: "#2980b9",
				},
				success: {
					DEFAULT: "#2ecc71",
					hover: "#27ae60",
				},
				danger: {
					DEFAULT: "#e74c3c",
					hover: "#c0392b",
				},
				gray: {
					light: "#f5f5f5",
					DEFAULT: "#95a5a6",
					dark: "#7f8c8d",
				},
				text: {
					primary: "#2c3e50",
					secondary: "#34495e",
					muted: "#7f8c8d",
				},
			},
		},
	},
	plugins: [],
};
