import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import Header from "./Header";
import { ReactComponent as StarIcon } from "./pictures/star_icon.svg";
import { ReactComponent as SearchIcon } from "./pictures/search_icon.svg";

import "./DepartmentPage.css";
import { departsData } from "./AllData";

const DepartmentsPage = () => {
  const [data, setData] = useState(departsData);

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

  const [searchDepart, setSearchDepart] = useState(""); //строка ввода

  const handleSearchDepartChange = (event) => {
    setSearchDepart(event.target.value); // обновляем ввод
  };

  const handleSearchDepartSubmit = (event) => {
    event.preventDefault();
    console.log("Поиск по кафедрам:", searchDepart); // cохраняем введенную строку
  };

  return (
    <>
      {/* <header className="header">
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
      </header> */}
      <Header /> 
      <div className="depart_content">
        <div className="header_line">
          <div className="path_line">
            <Link to="/" className="path_line_text">
              Главная
            </Link>
            <StarIcon />
            <Link to="/departments" className="path_line_text">
              Кафедры
            </Link>
          </div>
          <form className="search_field" onSubmit={handleSearchDepartSubmit}>
            <button type="submit" className="search_button">
              <SearchIcon />
            </button>
            <input
              type="text"
              className="search_input"
              placeholder="Введите текст..."
              value={searchDepart}
              onChange={handleSearchDepartChange}
            />
          </form>
        </div>
        <div className="table_wrapper">
          <table className="depart_table">
            <thead className="depart_thead">
              <tr className="depart_tr">
                <th className="depart_th" onClick={() => requestSort("id")}>
                  Идентификатор кафедры
                </th>
                <th className="depart_th" onClick={() => requestSort("name")}>
                  Наименование кафедры
                </th>
                <th className="depart_th" onClick={() => requestSort("head")}>
                  Заведующий кафедрой
                </th>
                <th className="depart_th" onClick={() => requestSort("deputy")}>
                  Зам. заведующего
                </th>
              </tr>
            </thead>
            <tbody className="depart_tbody">
              {sortedData.map((department) => (
                <tr className="depart_tr" key={department.id}>
                  <td className="depart_td">{department.id}</td>
                  <td className="depart_td">{department.name}</td>
                  <td className="depart_td">{department.head}</td>
                  <td className="depart_td">{department.deputy}</td>
                </tr>
              ))}      
              <tr className="depart_tr">
                <td className="depart_td"></td>
                <td className="depart_td"></td>
                <td className="depart_td"></td>
                <td className="depart_td"></td>
              </tr>
              <tr className="depart_tr">
                <td className="depart_td"></td>
                <td className="depart_td"></td>
                <td className="depart_td"></td>
                <td className="depart_td"></td>
              </tr>
              <tr className="depart_tr">
                <td className="depart_td bottom_td"></td>
                <td className="depart_td bottom_td"></td>
                <td className="depart_td bottom_td"></td>
                <td className="depart_td bottom_td"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DepartmentsPage;
