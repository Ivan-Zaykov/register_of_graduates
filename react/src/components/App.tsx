import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import MainPage from "./pages/MainPage";
import StudentsPage from "./pages/StudentsPage";
import FacultetsPage from "./pages/FacultetsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import StudentProfile from "./student/StudentProfile";
import EditStudent from "./student/EditStudent";
import AddNewStudent from "./student/AddNewStudent";



const App = () => {
  return (
    <Router>
      <div className="app">
        <main className="content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/facultets" element={<FacultetsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/:studentId" element={<StudentProfile />} />
            <Route path="/students/edit/:studentId" element={<EditStudent />} />
            <Route path="/students/add_new_student" element={<AddNewStudent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
