import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/header/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import ExamDetail from "./components/exam/ExamDetail.jsx";
import SubjectsPage from "./pages/SubjectsPage.jsx";
import CreateExam from "./pages/CreateExam.jsx";
import FormQuestion from "./pages/FormQuestion.jsx";
import CreateStudentList from "./pages/CreateStudentList.jsx";
import TeacherProfile from "./pages/TeacherProfile.jsx";
import EditTeacher from "./pages/EditTeacher.jsx";
import ExamByTestPage from "./pages/teacher/exams/ExamByTestPage.jsx";
import TeacherExamList from "./pages/teacher/exams/TeacherExamList.jsx";
import EditExam from "./components/exam/EditExam.jsx";
import BaiThiTheoNgay from "./pages/teacher/BaiThiTheoNgay.jsx";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exam/:id_dethi" element={<ExamDetail />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/form-question" element={<FormQuestion />} />
          <Route path="/create-student-list" element={<CreateStudentList />} />
          <Route path="/profile" element={<TeacherProfile />} />
          <Route path="/profile/edit-teacher" element={<EditTeacher />} />
          <Route path="/teacher/exams/by-exam" element={<ExamByTestPage />} />
          <Route path="/teacher/exams" element={<TeacherExamList />} />
          <Route path="/dethi/edit/:id_dethi" element={<EditExam />} />
          <Route path="/teacher/exams/by-date" element={<BaiThiTheoNgay />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
