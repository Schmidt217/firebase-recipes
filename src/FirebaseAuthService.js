import { firebaseApp } from "./FirebaseConfig";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	GoogleAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
} from "firebase/auth";

const auth = getAuth(firebaseApp);

const registerUser = (email, password) => {
	return createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = (email, password) => {
	return signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
	signOut(auth)
		.then(() => {
			console.log("signout successful");
		})
		.catch((error) => {
			alert(error);
		});
};

const passwordResetEmail = (email) => {
	return sendPasswordResetEmail(auth, email);
};

const loginWithGoogle = () => {
	const provider = new GoogleAuthProvider();

	signInWithPopup(auth, provider);
};

const subscribeToAuthChanges = (handleAuthChange) => {
	onAuthStateChanged(auth, (user) => {
		if (user) {
			handleAuthChange(user);
		}
	});
};

const FirebaseAuthService = {
	registerUser,
	loginUser,
	logoutUser,
	passwordResetEmail,
	loginWithGoogle,
	subscribeToAuthChanges,
};

export default FirebaseAuthService;
