import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import MainPage from "./MainPage";
import StudentsPage from "./StudentsPage";
import FacultetsPage from "./FacultetsPage";
import DepartmentsPage from "./DepartmentsPage";
import StudentProfile from "./StudentProfile";
import EditStudent from "./EditStudent";
import AddNewStudent from "./AddNewStudent";



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
