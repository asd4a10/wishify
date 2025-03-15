import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ReactNode } from "react";

// Создаем пользовательскую тему
const theme = createTheme({
	palette: {
		primary: {
			main: "#3f51b5",
		},
		secondary: {
			main: "#f50057",
		},
		background: {
			default: "#f5f5f5",
		},
	},
	typography: {
		fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
					boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
				},
			},
		},
	},
});

interface ThemeProviderWrapperProps {
	children: ReactNode;
}

// Компонент-обертка для применения темы MUI
export const ThemeProviderWrapper = ({
	children,
}: ThemeProviderWrapperProps) => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};

export default theme;
