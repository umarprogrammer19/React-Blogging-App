import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../config/firebase/firebaseMethods';

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await loginUser({ email: emailRef.current.value, password: passwordRef.current.value });
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex items-center justify-center flex-grow">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6">Login</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                ref={emailRef}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your email"
                                required
                                aria-describedby="email-description"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                ref={passwordRef}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your password"
                                required
                                aria-describedby="password-description"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                        >
                            Log In
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-4 text-center">
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