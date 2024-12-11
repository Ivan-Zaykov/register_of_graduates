import React from "react";
import Header from "./Header";
import main_picture from "./pictures/main_picture.png";

const MainPage = () => {
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
      <div className="main_block">
        <img src={main_picture} className="main_pict" />
        <div className="project_students_block">
          <div className="our_team">Наша команда:</div>
          <div className="team_list">
            <div className="list_item">
              Данила Баин в роли системного аналитика;
            </div>
            <div className="list_item">Иван Зайков в роли тимлида;</div>
            <div className="list_item">Алина Кутузова в роли тестировщика;</div>
            <div className="list_item">
              Евгения Морозова в роли фронтенд разработчика;
            </div>
            <div className="list_item">
              Владислав Чернов в роли бэкенд разработчика;
            </div>
            <div className="list_item">Юлия Якубив в роли дизайнера.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
