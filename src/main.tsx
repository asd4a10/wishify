import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from "./store";
import "./index.css";
import App from "./App";
import { ThemeProviderWrapper } from "./theme";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

// Упрощенный импорт Roboto
// import "@fontsource/roboto"; // Удаляем эту строку

// Или альтернатива - добавить только необходимые стили
import "@fontsource/roboto/400.css"; // Импортируем только обычный вес

// Это более точные импорты, если нужны конкретные веса
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
			<Provider store={store}>
				<ThemeProviderWrapper>
					<App />
				</ThemeProviderWrapper>
			</Provider>
		</ClerkProvider>
	</React.StrictMode>
);
