import { useState } from "react";
import FirebaseAuthService from "../FirebaseAuthService";

function LoginForm({ existingUser }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			await FirebaseAuthService.loginUser(username, password);
			setUsername("");
			setPassword("");
		} catch (error) {
			alert(error.message);
		}
	}

	async function handleLoginWithGoogle() {
		try {
			await FirebaseAuthService.loginWithGoogle();
		} catch (error) {
			console.log(error);
		}
	}

	function handleLogout() {
		FirebaseAuthService.logoutUser();
	}

	async function handleSendResetPasswordEmail() {
		if (!username) {
			alert("missing username");
			return;
		}

		try {
			await FirebaseAuthService.passwordResetEmail(username);
			alert("sent email");
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="login-form-container">
			{existingUser ? (
				<div className="row">
					<h3>Welcome, {existingUser.email}</h3>
					<button
						type="button"
						className="primary-button"
						onClick={handleLogout}
					>
						Logout
					</button>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="login-form">
					<label className="input-label login-label">
						Username (email):
						<input
							type="email"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="input-text"
						/>
					</label>
					<label className="input-label login-label">
						Password:
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input-text"
						/>
					</label>
					<div className="button-box">
						<button className="primary-button">Login</button>
						<button
							type="button"
							onClick={handleSendResetPasswordEmail}
							className="primary-button"
						>
							Reset Password
						</button>
						<button
							type="button"
							onClick={handleLoginWithGoogle}
							className="primary-button"
						>
							Login With Google
						</button>
					</div>
				</form>
			)}
		</div>
	);
}

export default LoginForm;
