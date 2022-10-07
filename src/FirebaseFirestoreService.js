import { firebaseApp } from "./FirebaseConfig";
import { addDoc, collection, getFirestore, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseApp);

const createDocument = (collectionName, document) => {
	const docRef = addDoc(collection(db, collectionName), document);
	return docRef;
};

const readDocuments = (collectionName) => {
	const docRef = getDocs(collection(db, collectionName));
	return docRef;
};

const FirebaseFirestoreService = {
	createDocument,
	readDocuments,
};

export default FirebaseFirestoreService;
