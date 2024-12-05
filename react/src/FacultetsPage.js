import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./FacultetsPage.css";
import Header from "./Header";
import { ReactComponent as StarIcon } from "./pictures/star_icon.svg";
import { ReactComponent as SearchIcon } from "./pictures/search_icon.svg";
import { facultsData } from "./AllData";

const FacultetsPage = () => {
  const [data, setData] = useState(facultsData);

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

  const [searchFacult, setSearchFacult] = useState(""); //строка ввода

  const handleSearchFacultChange = (event) => {
    setSearchFacult(event.target.value); // обновляем ввод
  };

  const handleSearchFacultSubmit = (event) => {
    event.preventDefault();
    console.log("Поиск по факультетам:", searchFacult); // cохраняем введенную строку
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
      <div className="facult_content">
        <div className="header_line">
          <div className="path_line">
            <Link to="/" className="path_line_text">
              Главная
            </Link>
            <StarIcon />
            <Link to="/facultets" className="path_line_text">
              Факультеты
            </Link>
          </div>
          <form className="search_field" onSubmit={handleSearchFacultSubmit}>
            <button type="submit" className="search_button">
              <SearchIcon />
            </button>
            <input
              type="text"
              className="search_input"
              placeholder="Введите текст..."
              value={searchFacult}
              onChange={handleSearchFacultChange}
            />
          </form>
        </div>
        <div className="table_wrapper">
          <table className="facult_table">
            <thead className="facult_thead">
              <tr className="facult_tr">
                <th className="facult_th" onClick={() => requestSort("id")}>
                  Идентификатор факультета
                </th>
                <th className="facult_th" onClick={() => requestSort("name")}>
                  Наименование факультета
                </th>
                <th className="facult_th" onClick={() => requestSort("dean")}>
                  ФИО декана
                </th>
                <th
                  className="facult_th"
                  onClick={() => requestSort("deputyDean")}>
                  ФИО зам. декана
                </th>
              </tr>
            </thead>
            <tbody className="facult_tbody">
              {sortedData.map((faculty) => (
                <tr className="facult_tr" key={faculty.id}>
                  <td className="facult_td">{faculty.id}</td>
                  <td className="facult_td">{faculty.name}</td>
                  <td className="facult_td">{faculty.dean}</td>
                  <td className="facult_td">{faculty.deputyDean}</td>
                </tr>
              ))}
              {/* <tr className="facult_tr">
            <td className="facult_td"></td>
            <td className="facult_td"></td>
            <td className="facult_td"></td>
            <td className="facult_td"></td>
          </tr> */}
              <tr className="facult_tr">
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
              </tr>
              <tr className="facult_tr">
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
              </tr>
              <tr className="facult_tr">
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
              </tr>
              <tr className="facult_tr">
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
              </tr>
              <tr className="facult_tr">
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
              </tr>
              <tr className="facult_tr">
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
              </tr>
              <tr className="facult_tr">
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
                <td className="facult_td"></td>
              </tr>
              <tr className="facult_tr">
                <td className="facult_td bottom_td"></td>
                <td className="facult_td bottom_td"></td>
                <td className="facult_td bottom_td"></td>
                <td className="facult_td bottom_td"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>

  );
};

export default FacultetsPage;
