import app from "./firebaseConfig";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    query,
    where
} from "firebase/firestore";

import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from "firebase/storage"

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// For User Signing Up
const signUpUser = (userData) => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, userData.email, userData.password)
            .then(async (res) => {
                userData.uid = res.user.uid;
                delete userData.password;
                try {
                    await addDoc(collection(db, "users"), userData);
                    console.log("User Added To The Database Successfully");
                    resolve(userData);
                } catch (error) {
                    reject(error);
                }
            })
            .catch((error) => {
                reject(error.message);
            });
    });
};

// For User Login
const loginUser = (userData) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, userData.email, userData.password)
            .then(async () => {
                try {
                    const q = query(
                        collection(db, "users"),
                        where("uid", "==", auth.currentUser.uid)
                    );
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            resolve(doc.data());
                        });
                    } else {
                        reject("User data not found");
                    }
                } catch (error) {
                    reject(error);
                }
            })
            .catch((error) => {
                reject(error.message);
            });
    });
};

// For Uploading Image
const uploadImage = async (file, email) => {
    try {
        const storageRef = ref(storage, `profileImages/${email}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        throw new Error("Failed to upload image: " + error.message);
    }
};

export {
    auth,
    db,
    signUpUser,
    loginUser,
    uploadImage,
}