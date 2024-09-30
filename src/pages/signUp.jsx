import React, { useState } from 'react';
import { signUpUser, uploadImage } from '../config/firebase/firebaseMethods';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: null,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const registerUser = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            setLoading(false);
            return;
        }

        try {
            const userProfileImageUrl = await uploadImage(formData.profileImage, formData.email);
            if (!userProfileImageUrl) {
                throw new Error('Image upload failed');
            }

            const userData = await signUpUser({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                profileImage: userProfileImageUrl,
            });

            console.log(userData);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                profileImage: null,
            });

            navigate('/login');
        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-6">
            <div className="flex items-center justify-center flex-grow">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
                    {error && <p className="text-red-500" aria-live="assertive">{error}</p>}
                    <form className="space-y-6" onSubmit={registerUser}>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your First Name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter Your Last Name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                minLength={1}
                                maxLength={20}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Your Email"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                minLength={8}
                                pattern="^(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                                title="Password must be at least 8 characters long, with at least one uppercase and one lowercase letter."
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Upload Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload Profile Image</label>
                            <input
                                type="file"
                                name="profileImage"
                                onChange={handleChange}
                                accept="image/*"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition ${loading ? 'opacity-50' : ''}`}
                        >
                            {loading ? 'Signing Up.....' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-4 text-center">
                        <p className="text-md text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-purple-600 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;