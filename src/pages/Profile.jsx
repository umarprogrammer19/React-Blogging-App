import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth, db,storage} from '../config/firebase/firebaseMethods';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { CameraIcon } from '@heroicons/react/solid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userDocId, setUserDocId] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [newProfileImage, setNewProfileImage] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userId = currentUser.uid;
                fetchUserData(userId);
            } else {
                setUser(null);
                setBlogs([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserData = async (userId) => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                const docId = querySnapshot.docs[0].id;

                setUser(userData);
                setUserDocId(docId);
                setProfileImageUrl(userData.profileImage);
                fetchUserBlogs(userId);
            } else {
                setError("User not found.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBlogs = async (uid) => {
        setLoading(true);
        try {
            const blogsRef = collection(db, "blogs");
            const q = query(blogsRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            const blogsData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                docId: doc.id,
            }));
            setBlogs(blogsData);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setError("Failed to fetch blogs.");
        } finally {
            setLoading(false);
        }
    };

    const updateUserData = async (newData) => {
        if (userDocId) {
            try {
                const userDocRef = doc(db, "users", userDocId);
                await updateDoc(userDocRef, newData);
                alert("Profile updated successfully!");
                fetchUserData(auth.currentUser.uid);
            } catch (error) {
                console.error("Error updating user data:", error);
                setError("Failed to update profile.");
            }
        } else {
            setError("User document ID not found.");
        }
    };

    const handleProfileImageSelection = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImageUrl(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async () => {
        const updates = {};
    
        if (newFirstName) updates.firstName = newFirstName;
        if (newLastName) updates.lastName = newLastName;
    
        if (newProfileImage) {
            const imageRef = ref(storage, `profileImages/${newProfileImage.name}`); 
            try {
                await uploadBytes(imageRef, newProfileImage);
                const newProfileImageUrl = await getDownloadURL(imageRef); 
                updates.profileImage = newProfileImageUrl; 
            } catch (error) {
                console.error("Error uploading image:", error);
                setError("Failed to upload profile image.");
                return; 
            }
        }
    
        await updateUserData(updates);
        setNewProfileImage(null);
        setNewFirstName("");
        setNewLastName("");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex justify-center items-center h-[90vh] bg-gray-300">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
                <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

                {user ? (
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                src={profileImageUrl || "https://via.placeholder.com/150"}
                                alt="Profile"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageSelection}
                                className="absolute bottom-0 right-0 opacity-0 w-10 h-10 cursor-pointer"
                            />
                            <CameraIcon
                                className="absolute bottom-0 right-0 w-10 h-10 text-purple-500 cursor-pointer"
                                onClick={() => document.querySelector('input[type="file"]').click()}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={newFirstName}
                            onChange={(e) => setNewFirstName(e.target.value)}
                            className="mt-4 p-2 border rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={newLastName}
                            onChange={(e) => setNewLastName(e.target.value)}
                            className="mt-2 p-2 border rounded w-full"
                        />
                        <button
                            className="bg-purple-500 text-white p-2 rounded mt-4 hover:bg-purple-600 focus:outline-none"
                            onClick={handleProfileUpdate}
                        >
                            Update Profile
                        </button>
                    </div>
                ) : (
                    <p>No user data available</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
