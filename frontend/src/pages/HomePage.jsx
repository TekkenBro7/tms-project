import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/home/ProjectCard';
import authService from '../services/AuthService';
import projectService from '../services/ProjectService';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Проверяем авторизацию пользователя
        const userResponse = await authService.getCurrentUser();
        
        if (!userResponse.data) {
          // Если пользователь не авторизован, прерываем загрузку
          setLoading(false);
          return;
        }
        
        setUser(userResponse.data);
        
        // Загружаем проекты только для авторизованного пользователя
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">
            Please sign in to view your projects
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            You need to be authenticated to access this content
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mx-auto w-30 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 px-4 rounded-md shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Welcome back, {user.first_name}!
          </h1>
          <p className="text-lg text-gray-600">
            Here are your active projects and tasks
          </p>
        </div>
        
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                currentUser={user} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any projects yet</p>
            <button
              onClick={() => navigate('/projects/new')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
