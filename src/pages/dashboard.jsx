import { useEffect, useState } from "react";
import { db, auth, getData } from "../config/firebase/firebaseMethods";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState("");
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [form, setForm] = useState({
        title: "",
        content: "",
    });

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
        console.log("Fetching user data for user ID:", userId);
        try {
            const data = await getData("users", userId);
            console.log("Fetched user data:", data);
            setUser(data[0]);
            fetchUserBlogs(userId);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handlePublish = async (event) => {
        event.preventDefault();
        if (form.title && form.content) {
            setPublishing(true);
            const newBlog = {
                title: form.title,
                content: form.content,
                author: `${user?.firstName} ${user?.lastName}`,
                date: new Date().toLocaleDateString(),
                imageUrl: user?.profileImage || "",
                uid: auth.currentUser?.uid || "",
            };

            try {
                if (editingBlogId) {
                    const blogRef = doc(db, "blogs", editingBlogId);
                    await updateDoc(blogRef, newBlog);

                    setBlogs((prevBlogs) =>
                        prevBlogs.map((blog) =>
                            blog.docId === editingBlogId ? { ...blog, ...newBlog } : blog
                        )
                    );
                    setEditingBlogId(null);
                } else {
                    const docRef = await addDoc(collection(db, "blogs"), newBlog);
                    setBlogs((prevBlogs) => [...prevBlogs, { ...newBlog, docId: docRef.id }]);
                }

                setForm({ title: "", content: "" });
            } catch (error) {
                console.error("Error publishing blog:", error);
                setError("Failed to publish blog.");
            } finally {
                setPublishing(false);
            }
        } else {
            setError("Title and content cannot be empty.");
        }
    };

    const handleDelete = async (blogId) => {
        if (blogId && window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const blogRef = doc(db, "blogs", blogId);
                await deleteDoc(blogRef);
                setBlogs((prevBlogs) => prevBlogs.filter(blog => blog.docId !== blogId));
            } catch (error) {
                console.error("Error deleting blog:", error);
                setError("Failed to delete blog.");
            }
        } else {
            console.error("Blog ID is undefined:", blogId);
        }
    };

    const handleEdit = (blog) => {
        setForm({
            title: blog.title,
            content: blog.content,
        });
        setEditingBlogId(blog.docId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {error && <p className="text-red-600 text-[18px] mb-4">{error}</p>}

            {/* Blog Publishing Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-purple-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Blog Title"
                    disabled={publishing}
                />
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    className="w-full border border-purple-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="What is in your mind"
                    rows={4}
                    disabled={publishing}
                ></textarea>
                <button
                    onClick={handlePublish}
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                    disabled={publishing}
                >
                    {publishing ? "Publishing..." : editingBlogId ? "Update Blog" : "Publish Blog"}
                </button>
            </div>

            {/* Blog List */}
            <h2 className="text-2xl font-semibold mb-6">My Blogs</h2>
            {loading ? (
                <p>Loading blogs...</p>
            ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div
                        key={blog.docId}
                        className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4"
                    >
                        <img
                            src={blog.imageUrl || "default-image-url.jpg"}
                            alt={blog.title}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <p className="text-gray-500">
                                {blog.author} - {blog.date}
                            </p>
                            <p className="mt-2 text-gray-600">{blog.content}</p>
                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => handleDelete(blog.docId)}
                                    className="text-red-700 hover:underline"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleEdit(blog)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No blogs found. Start by publishing one!</p>
            )}
        </div>
    );
}
