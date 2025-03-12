import { SignUpButton, SignInButton } from "@clerk/clerk-react";

const Welcome = () => {
	return (
		<div className="max-w-xl mx-auto text-center">
			<div className="mt-10 p-8 bg-gray-light rounded-lg shadow">
				<h2 className="text-2xl font-bold mb-4 text-text-primary">
					Добро пожаловать в Wishify!
				</h2>
				<p className="mb-6 text-text-secondary">
					Пожалуйста, войдите или зарегистрируйтесь, чтобы начать хранить свои
					желания.
				</p>

				<div className="flex justify-center gap-4">
					<SignInButton mode="modal">
						<button className="btn btn-primary px-6 py-3 font-medium">
							Войти
						</button>
					</SignInButton>
					<SignUpButton mode="modal">
						<button className="btn btn-success px-6 py-3 font-medium">
							Зарегистрироваться
						</button>
					</SignUpButton>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
