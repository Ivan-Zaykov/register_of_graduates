import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as StarIcon } from "../../pictures/star_icon.svg";
import { ReactComponent as SearchIcon } from "../../pictures/search_icon.svg";
import { ReactComponent as AddStudentIcon } from "../../pictures/add_student_icon.svg";

import "../../css/StudentsPage.css";

const StudentsPage = () => {
  const [students, setStudents] = useState([]); // Состояние для хранения данных студентов
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние для ошибок

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [searchStudent, setSearchStudent] = useState("");

  const [filteredStudents, setFilteredStudents] = useState([]); // отфильтрованные данные

  useEffect(() => {
    // Функция для получения данных
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students"); // Запрос к API
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Парсим JSON
        setStudents(data); // Сохраняем данные в состояние
        setIsLoading(false); // Отключаем индикатор загрузки
      } catch (err) {
        setError(err.message); // Сохраняем сообщение об ошибке
        setIsLoading(false);
      }
    };

    fetchStudents(); // Вызываем функцию при монтировании компонента
  }, []);


   useEffect(() => {
      // При загрузке из API сразу отображаем все данные
      setFilteredStudents(students);
    }, [students]);



  const sortedData = [...students].sort((a, b) => {
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

  // Отображение данных
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const handleSearchStudentChange = (event) => {
    setSearchStudent(event.target.value); // обновляем ввод
  };

  const handleSearchStudentSubmit = (event) => {
    event.preventDefault();

    if (searchStudent.trim() === "") {
      // Если строка поиска пуста, сбрасываем фильтр
      setFilteredStudents(students);
      console.log("Поиск сброшен, отображаются все студенты");
      return;
    }

    // Фильтруем данные
    const filteredData = students.filter((student) =>
      Object.values(student).some(
        (value) =>
          value != null &&
          value.toString().toLowerCase().includes(searchStudent.toLowerCase())
      )
    );

    setFilteredStudents(filteredData);
    console.log("Поиск по студентам:", searchStudent);
  };

  const sortedAndFilteredData = [...filteredStudents].sort((a, b) => {
    if (sortConfig.key) {
      const order = sortConfig.direction === "ascending" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
    }
    return 0;
  });

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
            <a href="/students/add_new_student" target="_blank">
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
                <th
                  className="student_th"
                  onClick={() => requestSort("ticket_number")}>
                  Номер студенческого
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("full_name")}>
                  ФИО
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("education_level")}>
                  Ступень обучения
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("faculty_name")}>
                  Факультет
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("department_name")}>
                  Кафедра
                </th>
                <th
                  className="student_th"
                  onClick={() => requestSort("is_archived")}>
                  Архив
                </th>
              </tr>
            </thead>
            <tbody className="student_tbody">
              {/* {sortedData.map((student) => ( */}
              {/* {filteredStudents.map((student) => ( */}
              {sortedAndFilteredData.map((student, index) => (
                 <tr
                 className={`student_tr ${
                   index === sortedAndFilteredData.length - 1 ? "bottom_td" : ""
                 }`}
                 key={student.student_id}
               >
                {/* <tr className="student_tr" key={student.student_id}> */}
                  <td className="student_td">
                    {/* <Link to={`/students/${student.id}`}>{student.id}</Link> */}
                    <a
                      href={`/students/${student.student_id}`}
                      // target="_blank"
                    >
                      {student.ticket_number}
                    </a>
                  </td>
                  <td className="student_td">
                    {/* <Link to={`/students/${student.id}`}>{student.name}</Link> */}
                    <a
                      href={`/students/${student.student_id}`}
                      // target="_blank"
                    >
                      {student.full_name}
                    </a>
                  </td>
                  <td className="student_td">{student.education_level}</td>
                  <td className="student_td">{student.faculty_name}</td>
                  <td className="student_td">{student.department_name}</td>
                  <td className="student_td">
                    {student.is_archived? "Да" : "Нет"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StudentsPage;
