import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [year, setYear] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpBox, setShowOtpBox] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [error, setError] = useState(null);

    const handleSignUp = async () => {
        if (!email.endsWith('@thapar.edu')) {
            setError('Email must be in the format "@thapar.edu"');
            return;
        } 

        try {
            const response = await axios.post('http://localhost:3001/api/auth/signup', {
                email,
                password,
                name,
                gender,
                year,
            });

            if (response.data.userExists) {
                setUserExists(true);
            }

            alert(response.data.message);
            setShowOtpBox(true);
        } catch (error) {
            setError(error.response?.data?.error || 'Error during sign up');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/verify-otp', {
                email,
                otp,
                userExists,
                name: userExists ? undefined : name,
                gender: userExists ? undefined : gender,
                year: userExists ? undefined : year,
                password,
            });

            alert(response.data.message);
            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error during OTP verification');
        }
    };

    return (
        <div className="d-flex flex-column align-items-center vh-100 bg-dark">
            <div className="card p-4 mt-4" style={{ width: '400px' }}>
                <form>
                    {!showOtpBox ? (
                        <>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={userExists}
                                />
                            </div>
                            <div className="mb-3">
                                <select
                                    className="form-control"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    disabled={userExists}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSignUp}
                                >
                                    {userExists ? 'Reset Password' : 'Sign Up'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleVerifyOtp}
                                >
                                    Verify OTP
                                </button>
                            </div>
                        </>
                    )}
                    {error && <div className="text-danger mt-3">{error}</div>}
                </form>
            </div>
            
                <div
                    className="w-100 text-center text-danger mt-4"
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <div
                        className="d-inline-block"
                        style={{
                            animation: 'moveText 10s linear infinite',
                            willChange: 'transform',
                        }}
                    >
                        Only Password and Year will be updated of existing users.
                    </div>
                </div>
            
            <style>
                {`
                @keyframes moveText {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                `}
            </style>
        </div>
    );
}
