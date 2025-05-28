import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                
                <div>
                    <h2 className="text-2xl font-bold mb-2">TaskMaster</h2>
                    <p className="mb-2">Manage tasks easily and efficiently!</p>
                    <p className="text-sm opacity-80">&copy; 2025 TaskMaster. All rights reserved.</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4">Navigation</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/projects" className="hover:underline">Projects</a></li>
                        <li><a href="/tasks" className="hover:underline">Tasks</a></li>
                        <li><a href="/subtasks" className="hover:underline">Subtasks</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4">Contacts</h3>
                    <p>Email: <a href="mailto:support@taskmaster.com" className="hover:underline">support@taskmaster.com</a></p>
                    <p>Telephone: +375 (44) 123-45-67</p>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="hover:text-gray-300 transition">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V11h2.6l-.4 3h-2.2v7A10 10 0 0022 12z" />
                            </svg>
                        </a>

                        <a href="#" className="hover:text-gray-300 transition">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </a>

                        <a href="#" className="hover:text-gray-300 transition">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z"/>
                            </svg>
                        </a>

                        <a href="#" className="hover:text-gray-300 transition">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6.6c-1.44 0-2.6-1.16-2.6-2.6s1.16-2.6 2.6-2.6 2.6 1.16 2.6 2.6-1.16 2.6-2.6 2.6zM18 6.5c0 .83-.67 1.5-1.5 1.5S15 7.33 15 6.5 15.67 5 16.5 5 18 5.67 18 6.5z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-4">Additionally</h3>
                    <ul className="space-y-2">
                        <li><a href="/privacy" className="hover:underline">Privacy policy</a></li>
                        <li><a href="/terms" className="hover:underline">Terms of use</a></li>
                        <li><a href="/help" className="hover:underline">Help</a></li>
                    </ul>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
