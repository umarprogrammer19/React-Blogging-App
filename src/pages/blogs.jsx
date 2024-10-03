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
                setError("Failed to fetch blogs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-300 p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Good Morning Readers!</h1>
            <h1 className="text-2xl font-semibold mb-6 text-center">All Blogs</h1>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loader"></div>
                </div>
            ) : blogs.length > 0 ? (
                <div className="space-y-6">
                    {blogs.map((blog, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-start space-x-4">
                            <img
                                src={blog.imageUrl || "https://via.placeholder.com/150"}
                                alt={`Image for blog titled ${blog.title}`}
                                className="w-16 h-16 rounded-lg object-cover mb-4 mx-auto"
                            />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{blog.title}</h2>
                                <p className="text-gray-500">
                                    {blog.author} - {new Date(blog.date).toLocaleDateString()} 
                                </p>
                                <p className="text-gray-600 mt-2 text-justify">
                                    {blog.content.length > 100 ? `${blog.content}` : blog.content}
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
                <p className="text-gray-500 text-center">No blogs found.</p>
            )}
        </div>
    );
}
