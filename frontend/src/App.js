import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import AdminUsersPage from "./pages/UserAdminPage";
import UserCreateForm from "./components/UserCreateForm";
import UserEditForm from "./components/UserEditForm";
import ProjectAdminPage from "./pages/ProjectAdminPage";

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
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
