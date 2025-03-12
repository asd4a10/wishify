import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

import "./App.css";
import SignInPage from "./components/Auth/SignIn";
import SignUpPage from "./components/Auth/SignUp";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";

function App() {
	// Получение информации о пользователе
	const { user } = useUser();

	// Простая маршрутизация для авторизации
	const path = window.location.pathname;

	if (path === "/sign-in") {
		return <SignInPage />;
	} else if (path === "/sign-up") {
		return <SignUpPage />;
	}

	return (
		<>
			<SignedIn>{user && <Dashboard userId={user.id} />}</SignedIn>
			<SignedOut>
				<Welcome />
			</SignedOut>
		</>
	);
}

export default App;
