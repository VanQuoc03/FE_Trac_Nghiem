import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarStudent from "./components/student/Navbar"; // Student Navbar
import NavbarTeacher from "./components/teacher/Navbar"; // Teacher Navbar
import ViewSv from "./components/student/ViewSv";
import Detail from "./components/student/Detail";
import HomePage from "./components/teacher/HomePage";
import ExamDetail from "./components/teacher/exam/ExamDetail";
import SubjectsPage from "./components/teacher/SubjectsPage";
import CreateExam from "./components/teacher/CreateExam";
import FormQuestion from "./components/teacher/FormQuestion";
import CreateStudentList from "./components/teacher/CreateStudentList";
import TeacherProfile from "./components/teacher/TeacherProfile";
import EditTeacher from "./components/teacher/EditTeacher";
import ExamByTestPage from "./components/teacher/exams/ExamByTestPage";
import TeacherExamList from "./components/teacher/exams/TeacherExamList";
import EditExam from "./components/teacher/exam/EditExam";
import BaiThiTheoNgay from "./components/teacher/BaiThiTheoNgay";
import Login from "./components/Login";
import { AppContextProvider } from "./Context/AppContext";

export default function App() {
  const [user, setUser] = useState(null); // { role: "student" | "teacher", token, id }

  useEffect(() => {
    // Check local storage for existing user session
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Redirect to login if not authenticated
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!user || user.role !== allowedRole) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <AppContextProvider>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={user.role === "student" ? "/" : "/teacher"} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Student Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRole="student">
                <NavbarStudent onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<ViewSv />} />
            <Route path="/detail/:id" element={<Detail />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRole="teacher">
                <NavbarTeacher onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="exam/:id_dethi" element={<ExamDetail />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="create-exam" element={<CreateExam />} />
            <Route path="form-question" element={<FormQuestion />} />
            <Route path="create-student-list" element={<CreateStudentList />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="profile/edit-teacher" element={<EditTeacher />} />
            <Route path="exams/by-exam" element={<ExamByTestPage />} />
            <Route path="exams" element={<TeacherExamList />} />
            <Route path="dethi/edit/:id_dethi" element={<EditExam />} />
            <Route path="exams/by-date" element={<BaiThiTheoNgay />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}