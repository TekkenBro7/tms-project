import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-5 py-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-indigo-200 transition-colors">
                    TMS Project
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:underline hover:text-indigo-200 transition-colors">
                        Home
                    </Link>
                    <Link to="/projects" className="hover:underline hover:text-indigo-200 transition-colors">
                        Projects
                    </Link>
                    <Link to="/tasks" className="hover:underline hover:text-indigo-200 transition-colors">
                        Tasks
                    </Link>
                    <Link to="/profile" className="hover:underline hover:text-indigo-200 transition-colors">
                        Profile
                    </Link>

                    <div className="relative group">
                        <button className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
                            <span>Admin</span>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                            <Link to="/admin/users" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 transition-colors">
                                Users
                            </Link>
                            <Link to="/admin/projects" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 transition-colors">
                                Projects
                            </Link>
                            <Link to="/admin/tasks" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 transition-colors">
                                Tasks
                            </Link>
                            <Link to="/admin/subtasks" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100 transition-colors">
                                Subtasks
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
