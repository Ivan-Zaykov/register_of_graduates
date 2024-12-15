import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "../Header";
import { ReactComponent as StarIcon } from "../../pictures/star_icon.svg";
import { ReactComponent as SearchIcon } from "../../pictures/search_icon.svg";

import "../../css/DepartmentPage.css";

const DepartmentsPage = () => {
  const [departsData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/departments");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Пустой массив означает, что эффект выполнится только при монтировании

  useEffect(() => {
    setFilteredDeparts(departsData);
  }, [departsData]);


  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedData = [...departsData].sort((a, b) => {
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
  const [filteredDeparts, setFilteredDeparts] = useState([]); // отфильтрованные данные
  

  const handleSearchDepartChange = (event) => {
    setSearchDepart(event.target.value); // обновляем ввод
  };

  const handleSearchDepartSubmit = (event) => {
    event.preventDefault();
  
    if (searchDepart.trim() === "") {
      // Если строка поиска пуста, сбрасываем фильтр
      setFilteredDeparts(departsData);
      console.log("Поиск сброшен, отображаются все кафедры");
      return;
    }
  
    // Фильтруем данные
    const filteredData = departsData.filter((department) =>
      Object.values(department).some((value) =>
        value.toString().toLowerCase().includes(searchDepart.toLowerCase())
      )
    );
  
    setFilteredDeparts(filteredData);
    console.log("Поиск по кафедрам:", searchDepart);
  };

  const sortedAndFilteredData = [...filteredDeparts].sort((a, b) => {
    if (sortConfig.key) {
      const order = sortConfig.direction === "ascending" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? order : -order;
    }
    return 0;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
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
                <th
                  className="depart_th"
                  onClick={() => requestSort("department_id")}>
                  Идентификатор кафедры
                </th>
                <th
                  className="depart_th"
                  onClick={() => requestSort("department_name")}>
                  Наименование кафедры
                </th>
                <th
                  className="depart_th"
                  onClick={() => requestSort("head_of_department")}>
                  Заведующий кафедрой
                </th>
                <th className="depart_th" onClick={() => requestSort("deputy")}>
                  Зам. заведующего
                </th>
              </tr>
            </thead>
            <tbody className="depart_tbody">
              {/* {sortedData.map((department) => ( */}
              {sortedAndFilteredData.map((department) => (
                <tr className="depart_tr" key={department.department_id}>
                  <td className="depart_td">{department.department_id}</td>
                  <td className="depart_td">{department.department_name}</td>
                  <td className="depart_td">{department.head_of_department}</td>
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
