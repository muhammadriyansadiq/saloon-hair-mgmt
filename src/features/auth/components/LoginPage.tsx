import React from 'react';
import LoginForm from './LoginForm';
import loginBg from '@/assets/login_image.png'; // Make sure the asset exists

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background-white p-4 lg:p-0">
            <div className="w-full  h-screen   overflow-hidden flex flex-row justify-between">
                {/* Left Side - Form */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center items-center bg-white  lg:mt-10 relative">

                    <div className="w-full max-w-sm">
                        {/* Logo */}

                        <div className=" absolute top-1  ">
                            <h1 className="text-4xl font-black tracking-tighter" style={{ fontFamily: 'cursive' }}>MAK</h1>
                        </div>
                        {/* Welcome Text */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                                Welcome Back <span className="text-2xl">👋</span>
                            </h2>
                            <p className="text-sm text-gray-400 mt-1 font-medium">
                                We are happy to have you back
                            </p>
                        </div>

                        <LoginForm />
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden lg:block w-6/12 p-4 h-full">
                    <div className="w-full h-full rounded-lg overflow-hidden relative">
                        <img
                            src={loginBg}
                            alt="Barber working on client"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay if needed to match tonality */}
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
