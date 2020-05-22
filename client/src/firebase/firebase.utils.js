import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBS4ZVAZmmR_mcnAbr0y9QIG1PKCadcP4Y",
    authDomain: "crwn-db-e325f.firebaseapp.com",
    databaseURL: "https://crwn-db-e325f.firebaseio.com",
    projectId: "crwn-db-e325f",
    storageBucket: "crwn-db-e325f.appspot.com",
    messagingSenderId: "519910577700",
    appId: "1:519910577700:web:a303cdc9c4a79480926ab1",
    measurementId: "G-KPPZVEPZM2"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, addonData) => {
    if (!userAuth) return;

    const userRef  = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userRef.get();
    
    if(!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt =  new Date();

        try {
            await userRef.set ({
                displayName,
                email,
                createdAt,
                ...addonData
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }
    
    return userRef;
};

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);
    console.log(collectionRef);
    
    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc();
        batch.set(newDocRef, obj);
    });
    
    return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map(doc => {
        const { title, items } = doc.data();

        return {
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            items
        }
    });
    return transformedCollection.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    }, {});
};

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth);
        }, reject);
    });
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({prompt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);


export default firebase;