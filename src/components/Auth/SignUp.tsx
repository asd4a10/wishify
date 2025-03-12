import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
	return (
		<div className="auth-container">
			<SignUp
				routing="path"
				path="/sign-up"
				signInUrl="/sign-in"
				redirectUrl="/dashboard"
				appearance={{
					elements: {
						formButtonPrimary: "clerk-button",
						card: "clerk-card",
					},
				}}
			/>
		</div>
	);
};

export default SignUpPage;
