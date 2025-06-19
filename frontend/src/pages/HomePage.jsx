import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/home/ProjectCard';
import authService from '../services/AuthService';
import projectService from '../services/ProjectService';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { ProjectStatus, ViewMode } from '../constants/enums';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(ViewMode.GRID);
  const [filterStatus, setFilterStatus] = useState(ProjectStatus.ALL)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authService.getCurrentUser();
        
        if (!userResponse.data) {
          setLoading(false);
          return;
        }
        
        setUser(userResponse.data);

        const projectsResponse = await projectService.getAll();
        const userProjects = projectsResponse.data.filter(project => 
          project.members.includes(userResponse.data.id) || 
          project.owner === userResponse.data.id
        );
        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (filterStatus === ProjectStatus.ALL) return true;
    if (filterStatus === ProjectStatus.ACTIVE) return project.is_active;
    if (filterStatus === ProjectStatus.INACTIVE) return !project.is_active;
    return true;
});

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton 
              key={i} 
              variant="rounded" 
              width="100%" 
              height={120} 
              animation="wave" 
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50"
      >
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">
            Welcome to TMS Project
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your projects and tasks
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 px-4 rounded-md shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-indigo-600">{user.first_name}</span>!
          </h1>
          <p className="text-lg text-gray-500">
            Here's what needs your attention today
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          <button
            onClick={() => setViewMode(ViewMode.GRID)}
            className={`p-2 rounded-md ${viewMode === ViewMode.GRID ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode(ViewMode.LIST)}
            className={`p-2 rounded-md ${viewMode === ViewMode.LIST ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus(ProjectStatus.ALL)}
            className={`px-4 py-2 text-sm rounded-md ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus(ProjectStatus.ACTIVE)}
            className={`px-4 py-2 text-sm rounded-md ${filterStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus(ProjectStatus.INACTIVE)}
            className={`px-4 py-2 text-sm rounded-md ${filterStatus === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Inactive
          </button>
        </div>
      </motion.div>

        
        {filteredProjects.length > 0 ? (
          <motion.div 
            variants={containerVariants} 
            className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}
          >
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={project.id} 
                variants={itemVariants}
                custom={index}
              >
                <ProjectCard 
                  project={project} 
                  currentUser={user} 
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No projects yet
            </h3>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
