import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import AdminUsersPage from "./pages/Admin/UserAdminPage";
import UserCreateForm from "./components/users/UserCreateForm";
import UserEditForm from "./components/users/UserEditForm";
import ProjectAdminPage from "./pages/Admin/ProjectAdminPage";
import TaskAdminPage from "./pages/Admin/TaskAdminPage";
import SubtaskAdminPage from "./pages/Admin/SubTaskAdminPage";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/create" element={<UserCreateForm />} />
              <Route path="/admin/users/edit/:id" element={<UserEditForm />} />
              <Route path="projects" element={<ProjectAdminPage />} />
              <Route path="tasks" element={<TaskAdminPage />} />
              <Route path="subtasks" element={<SubtaskAdminPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
