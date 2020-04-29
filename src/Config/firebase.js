import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore';
import 'firebase/functions'
import 'firebase/storage'

const config = {
	apiKey: "AIzaSyCkYbGdlWeqwtQpMxLE0V7VsJaQaE7RxbI",
	authDomain: "egszulcus.firebaseapp.com",
	databaseURL: "https://egszulcus.firebaseio.com",
	projectId: "egszulcus",
	storageBucket: "egszulcus.appspot.com",
	messagingSenderId: "228488156746",
	appId: "1:228488156746:web:22d9c023aa9959c79178b3",
	measurementId: "G-JVX77JVRKV"
};

firebase.initializeApp(config);
firebase.firestore().settings({});

const db = firebase.firestore();
const au = firebase.auth();
const auth = firebase.auth;
const fu = firebase.functions();
const st = firebase.storage();
let user = null;
au.onAuthStateChanged(snap => {
	if (snap) {
		user = snap
	}
})

export {
	db,
	au,
	auth,
	fu,
	st,
	user
}