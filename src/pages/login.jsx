import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../config/firebase/firebaseMethods';

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true); // Start loading

        try {
            await loginUser({ email: emailRef.current.value, password: passwordRef.current.value });
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false); // Stop loading after login attempt
        }
    };

    return (
        <div className="min-h-[90vh] flex flex-col bg-gray-300">
            <div className="flex items-center justify-center flex-grow">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

                    {error && (
                        <p className="text-red-600 bg-red-100 p-2 rounded mb-4 text-center">
                            {error}
                        </p>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                ref={emailRef}
                                aria-label="Email"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                ref={passwordRef}
                                aria-label="Password"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg transition-all duration-200 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            {loading ? (
                                <div className="flex justify-center items-center space-x-2">
                                    <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-md text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-purple-600 hover:underline">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
