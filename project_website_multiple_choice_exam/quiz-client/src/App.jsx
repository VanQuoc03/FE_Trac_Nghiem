import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarStudent from "./components/student/Navbar"; // Student Navbar
import NavbarTeacher from "./components/teacher/Navbar"; // Teacher Navbar
import ViewSv from "./components/student/ViewSv";
import Detail from "./components/student/Detail";
import PracticePage from "./components/student/PracticePage";
import PracticeTake from "./components/student/PracticeTake";
import JoinExam from "./components/student/JoinExam";
import JoinExamTake from "./components/student/JoinExamTake";
import ProfilePage from "./components/student/ProfilePage";
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
import ThongBao from "./components/student/ThongBao";
import Home from "./components/student/Home";

// Placeholder components for student features
const SubjectsPageStudent = () => <div className="p-6">Trang Môn Thi (Chưa triển khai)</div>;
const NotificationsPage = () => <div className="p-6">Trang Thông Báo (Chưa triển khai)</div>;
const ContactPage = () => <div className="p-6">Trang Liên Hệ (Chưa triển khai)</div>;
const SettingsPage = () => <div className="p-6">Trang Cài Đặt (Chưa triển khai)</div>;

export default function App() {
  const [user, setUser] = useState(null); // { role: "student" | "teacher", token, id, tendangnhap }

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
    localStorage.clear(); // Xóa toàn bộ localStorage
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
            <Route index element={<Home />} />
            <Route path="history-exam" element={<ViewSv />} />
            <Route path="detail/:id" element={<Detail />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="practice/take/:id_dethi" element={<PracticeTake />} />
            <Route path="join-exam" element={<JoinExam />} />
            <Route path="join-exam/take/:id_dethi" element={<JoinExamTake />} />
            <Route path="subjects" element={<SubjectsPageStudent />} />
            <Route path="notifications" element={<ThongBao />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
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