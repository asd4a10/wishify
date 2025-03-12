import { SignUpButton } from "@clerk/clerk-react";

import { SignInButton } from "@clerk/clerk-react";

const Welcome = () => {
	return (
		<div className="wishify-container auth-wrapper">
			<div className="auth-message">
				<h2>Добро пожаловать в Wishify!</h2>
				<p>
					Пожалуйста, войдите или зарегистрируйтесь, чтобы начать хранить свои
					желания.
				</p>

				<div className="auth-buttons">
					<SignInButton />
					<SignUpButton />
				</div>
			</div>
		</div>
	);
};

export default Welcome;
