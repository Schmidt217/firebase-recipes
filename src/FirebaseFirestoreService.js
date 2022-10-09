import { firebaseApp } from "./FirebaseConfig";
import {
	addDoc,
	collection,
	getFirestore,
	getDocs,
	where,
	query,
	updateDoc,
	doc,
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

const createDocument = (collectionName, document) => {
	const docRef = addDoc(collection(db, collectionName), document);
	return docRef;
};

// getting docs without queries

// const readDocuments = (collectionName) => {
// 	const docRef = getDocs(collection(db, collectionName));
// 	return docRef;
// };

// getting docs with queries

const readDocuments = (collectionName, queries) => {
	let collectionRef = collection(db, collectionName);

	if (queries && queries.length > 0) {
		for (const querys of queries) {
			collectionRef = query(
				collectionRef,
				where(querys.field, querys.condition, querys.value)
			);
		}
	}
	return getDocs(collectionRef);
};

const updateDocument = (collectionName, id, document) => {
	const collectionRef = doc(db, collectionName, id);
	return updateDoc(collectionRef, document);
};

const FirebaseFirestoreService = {
	createDocument,
	readDocuments,
	updateDocument,
};

export default FirebaseFirestoreService;
