import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { ThemeProviderWrapper } from "./theme";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage.tsx";
import WishesPage from "./pages/WishesPage.tsx";
import GoalTrackerPage from "./pages/GoalTrackerPage.tsx";
import MentorSelectionPage from "./pages/MentorSelectionPage.tsx";

import "./App.css";
import SignInPage from "./components/Auth/SignIn";
import SignUpPage from "./components/Auth/SignUp";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";

function App() {
	const { isSignedIn, user } = useUser();

	return (
		<Router basename={import.meta.env.BASE_URL}>
			<ThemeProviderWrapper>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<HomePage />} />
						<Route
							path="wishes"
							element={isSignedIn ? <WishesPage /> : <Navigate to="/" />}
						/>
						<Route
							path="goal-tracker"
							element={isSignedIn ? <GoalTrackerPage /> : <Navigate to="/" />}
						/>
						<Route
							path="select-mentor"
							element={
								isSignedIn ? <MentorSelectionPage /> : <Navigate to="/" />
							}
						/>
						<Route path="*" element={<div>Страница не найдена</div>} />
					</Route>
				</Routes>
			</ThemeProviderWrapper>
		</Router>
	);
}

export default App;
