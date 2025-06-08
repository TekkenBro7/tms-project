import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/home/ProjectCard';
import authService from '../services/AuthService';
import projectService from '../services/ProjectService';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authService.getCurrentUser();
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Welcome back, {user?.first_name || 'User'}!
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
          </div>
        )}
      </div>
    </div>
  );
}
