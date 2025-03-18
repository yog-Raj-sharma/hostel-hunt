import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSignIn = async (e) => { 
      e.preventDefault();
        try {
            const response = await axios.post('https://hostel-hunt-1.onrender.com/api/auth/signin', { email, password });
            const { token } = response.data;

            if (token) {
                localStorage.setItem('authToken', token);
                navigate('/navbar'); 
            } else {
                alert('No token received');
            }
        } catch (error) {
            alert(error.response?.data?.error || "Error during sign in");
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-start vh-100 bg-dark">
            <div className="card p-4" style={{ width: '400px', marginTop: '20px' }}>

               <div className="alert alert-info" role="alert">
                    Loading of Page on login can take approx 1 minute since it is hosted for free. Please Wait!<br />
                </div>  
               
                <form> 
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-success" 
                            onClick={handleSignIn}
                        >
                            Sign In
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up / Forgot Password
                        </button>

                        <button 
                            type="button" 
                            className="btn btn-warning" 
                            onClick={() => { 
                                setEmail('yraj_be21@thapar.edu');
                                setPassword('Hellouser');
                                }}
                        >
                            Guest Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
