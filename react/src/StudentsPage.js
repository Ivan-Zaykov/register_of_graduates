import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as StarIcon } from "./pictures/star_icon.svg";
import { ReactComponent as SearchIcon } from "./pictures/search_icon.svg";
import { ReactComponent as AddStudentIcon } from "./pictures/add_student_icon.svg";

import "./StudentsPage.css";
import { studentsData } from "./AllData";

const StudentsPage = () => {
  const [data, setData] = useState(studentsData);

  //   {
  //     id: "27272727",
  //     name: "Дело В Шляпе",
  //     level: "Кошачья",
  //     faculty: "Шляпниковый",
  //     department: "Винный сад",
  //     archive: 0,
  //   },
  //   {
  //     id: "69696969",
  //     name: "Илон Рив Маск",
  //     level: "Магистратура",
  //     faculty: "Омереканский",
  //     department: "Теслоракетостроение",
  //     archive: 0,
  //   },
  //   {
  //     id: "42424242",
  //     name: "Патрик Глейдсон Бейтман",
  //     level: "Бакалавриат",
  //     faculty: "Сигмовый",
  //     department: "Убиватбубивать",
  //     archive: 1,
  //   },
  //   {
  //     id: "22822822",
  //     name: "Тайлер Дёрден",
  //     level: "Бакалавриат",
  //     faculty: "Бойцовский",
  //     department: "Воображаемая",
  //     archive: 1,
  //   },
  // ]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      const order = sortConfig.direction === "ascending" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  //search field

  const [searchStudent, setSearchStudent] = useState(""); //строка ввода

  const handleSearchStudentChange = (event) => {
    setSearchStudent(event.target.value); // обновляем ввод
  };

  const handleSearchStudentSubmit = (event) => {
    event.preventDefault();
    console.log("Поиск по студентам:", searchStudent); // cохраняем введенную строку
  };

  return (
    <>
      <header className="header">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
          Главная
        </NavLink>
        <NavLink
          to="/facultets"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
          Факультеты
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
          Студенты
        </NavLink>
        <NavLink
          to="/departments"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
          Кафедры
        </NavLink>
      </header>
      <div className="student_content">
        <div className="header_line">
          <div className="path_line">
            <Link to="/" className="path_line_text">
              Главная
            </Link>
            <StarIcon />
            <Link to="/students" className="path_line_text">
              Студенты
            </Link>
          </div>

          <div className="add_and_input_block">
            <a href="/students/add_new_student">
              <AddStudentIcon className="add_icon" />
            </a>

            <form className="search_field" onSubmit={handleSearchStudentSubmit}>
              <button type="submit" className="search_button">
                <SearchIcon />
              </button>
              <input
                type="text"
                className="search_input"
                placeholder="Введите текст..."
                value={searchStudent}
                onChange={handleSearchStudentChange}
              />
            </form>
          </div>
        </div>
        <div className="table_wrapper">
          <table className="student_table">
            <thead className="student_thead">
              <tr className="student_tr">
                <th className="student_th" onClick={() => requestSort("id")}>
                  Номер студенческого
                </th>
                <th className="student_th" onClick={() => requestSort("name")}>
                  ФИО
                </th>
                <th className="student_th" onClick={() => requestSort("level")}>
                  Ступень обучения
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("faculty")}>
                  Факультет
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("department")}>
                  Кафедра
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("archive")}>
                  Архив
                </th>
              </tr>
            </thead>
            <tbody className="student_tbody">
              {sortedData.map((student) => (
                <tr className="student_tr" key={student.id}>
                  <td className="student_td">
                    {/* <Link to={`/students/${student.id}`}>{student.id}</Link> */}
                    <a
                      href={`/students/${student.studentId}`}
                      // target="_blank"
                    >
                      {student.studentId}
                    </a>
                  </td>
                  <td className="student_td">
                    {/* <Link to={`/students/${student.id}`}>{student.name}</Link> */}
                    <a
                      href={`/students/${student.studentId}`}
                      // target="_blank"
                    >
                      {student.name}
                    </a>
                  </td>
                  <td className="student_td">{student.level}</td>
                  <td className="student_td">{student.faculty}</td>
                  <td className="student_td">{student.department}</td>
                  <td className="student_td">
                    {student.archive === 1 ? "Да" : "Нет"}
                  </td>
                </tr>
              ))}
              <tr className="student_tr">
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
              </tr>
              <tr className="student_tr">
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
              </tr>
              <tr className="student_tr">
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
              </tr>
              <tr className="student_tr">
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
              </tr>
              <tr className="student_tr">
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
              </tr>
              <tr className="student_tr">
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
                <td className="student_td"></td>
              </tr>
              <tr className="student_tr">
                <td className="student_td bottom_td"></td>
                <td className="student_td bottom_td"></td>
                <td className="student_td bottom_td"></td>
                <td className="student_td bottom_td"></td>
                <td className="student_td bottom_td"></td>
                <td className="student_td bottom_td"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentsPage;
