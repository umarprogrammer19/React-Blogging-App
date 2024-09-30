import { useEffect, useState } from "react";
import { getAllData } from "../config/firebase/firebaseMethods"; 
import { Link } from "react-router-dom";

export default function AllBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await getAllData("blogs"); 
                setBlogs(data); 
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setError("Failed to fetch blogs.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-8">Good Morning Readers!</h1>
            <h1 className="text-2xl font-semibold mb-6">All Blogs</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p>Loading blogs...</p>
            ) : blogs.length > 0 ? (
                <div className="space-y-6">
                    {blogs.map((blog, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
                            <img
                                src={blog.imageUrl || "default-image-url.jpg"}
                                alt={`Image for blog titled ${blog.title}`}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                                <h2 className="text-lg font-semibold">{blog.title}</h2>
                                <p className="text-gray-500">
                                    {blog.author} - {blog.date} 
                                </p>
                                <p className="text-gray-600 mt-2">
                                    {blog.content}
                                </p>
                                <Link
                                    to={`/userblogs/${blog.uid}`}
                                    className="text-blue-600 hover:underline mt-4 block text-[17.5px]"
                                >
                                    View all blogs of this user
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No blogs found.</p>
            )}
        </div>
    );
}