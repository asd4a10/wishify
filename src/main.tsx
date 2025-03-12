import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";
import { store } from "./store";
import "./index.css";
import App from "./App";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
			<Provider store={store}>
				<App />
			</Provider>
		</ClerkProvider>
	</React.StrictMode>
);
