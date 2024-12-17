import React, { useState } from "react";

import default_student_photo from "../../pictures/default_student_photo.png";

import CustomAlert from "../CustomAlert";

import "../../css/StudentProfile.css";
import "../../css/EditStudent.css";
import "../../css/AddNewStudent.css";

const AddNewStudent = () => {
  const [alert, setAlert] = useState(null);

  // Состояния для факультетов и кафедр
  const [faculties] = useState({
    "Информационно-вычислительных технологий": [
      "Кафедра программирования",
      "Кафедра сетевых технологий",
    ],
    Исторический: ["Кафедра всеобщей истории", "Кафедра отечественной истории"],
    Математический: ["Кафедра алгебры", "Кафедра геометрии"],
    Юридический: ["Кафедра гражданского права", "Кафедра уголовного права"],
  });

  // Код для замены фото студента (значок редактирования в углу фото)
  const [image, setImage] = useState(default_student_photo); // Изначальная картинка

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Берём первый выбранный файл
    if (file) {
      const reader = new FileReader(); // Создаём FileReader для преобразования файла в URL
      reader.onload = () => setImage(reader.result); // Устанавливаем картинку после чтения
      reader.readAsDataURL(file); // Читаем файл как Data URL
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU"); // Форматирует как "день.месяц.год"
  };

  const [addNewStudent, setAddNewStudent] = useState({
    name: "",
    faculty: "",
    studentId: "",
    yearOfAdmission: "",
    level: "",
    archive: "Нет",
    department: "",
    courseSupervisor: "",
    courseWorkTitle: "",
    courseGrade: "",
    diplomaSupervisor: "",
    diplomaTitle: "",
    diplomaGrade: "",
    graduationYear: "",
    successAssessment: "",
  });

  const handleFacultyChange = (e) => {
    const selectedFaculty = e.target.value;
    setAddNewStudent((prev) => ({
      ...prev,
      faculty: selectedFaculty,
      department: "", // Очистим кафедру при смене факультета
    }));
  };

  const handleDepartmentChange = (e) => {
    setAddNewStudent((prev) => ({
      ...prev,
      department: e.target.value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const requiredFields = [
      "studentId",
      "name",
      "faculty",
      "yearOfAdmission",
      "level",
    ];
    const isAllFieldsFilled = requiredFields.every(
      (field) => addNewStudent[field].trim() !== ""
    );

    if (!isAllFieldsFilled) {
      // alert("Не все обязательные поля заполнены");
      setAlert({
        message: "Не все обязательные поля заполнены!",
      });
    } else {
      console.log("Сохраненные данные о студенте:", addNewStudent);
      // alert("Студент успешно создан");
      setAlert({
        message: "Студент успешно создан.",
      });

      // Добавить логику сохранения данных
    }
  };

  const handleAlertClose = () => {
    setAlert(null); // Закрытие alert
  };

  // ДОБАВИТЬ!!!!!!
  // ЕСЛИ НОМЕР СТУДЕНЧЕСКОГО У НОВОГО СТУДЕНТА НЕ УНИКАЛЬНЫЙ
  // setAlert({
  //   message: "Номер студенческого должен быть уникальным!",
  // });


  return (
    <>
      {alert && (
        <CustomAlert message={alert.message} onClose={handleAlertClose} />
      )}
      <div className="student_profile_content">
        <div className="student_profile_wrapper">
          <div className="edit_top_block">
            <div className="edit_student_top_edit_button">
              Создание студента
            </div>
            <a
              className="edit_student_save_button"
              // href="/students"
              onClick={handleSave}
              style={{ textDecoration: "none", color: "inherit" }}>
              Сохранить
            </a>
            <div className="student_profile_top_wrapper">
              <div className="button_and_picture_block">
                <a
                  className="edit_student_cancel_button"
                  href="/students"
                  style={{ textDecoration: "none", color: "#AE1010" }}>
                  Все студенты
                </a>

                <div className="picture_block">
                  <label htmlFor="file-input">
                    <img
                      src={image}
                      style={{ cursor: "pointer" }}
                      alt="дефолт"
                      className="student_photo"
                    />
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <div className="info_table">
                <div className="table_line first_line">
                  <div className="title">ID:</div>
                  <div className="data">Сгенерировать</div>
                </div>
                <div className="table_line">
                  <div className="title">
                    Студенческий<span className="red_star">*</span>:
                  </div>
                  {/* <div className="data">{student.studentId}</div> */}
                  <input
                    type="number"
                    placeholder="Введите номер..."
                    name="studentId"
                    value={addNewStudent.studentId}
                    // onChange={handleInputChange}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 7) {
                        handleInputChange(e); // Разрешаем изменение, только если длина <= 7
                      }
                    }}
                    className="add_student_input"
                  />
                </div>
                <div className="table_line">
                  <div className="title">
                    ФИО<span className="red_star">*</span>:
                  </div>
                  {/* <div className="data">{student.name}</div> */}
                  <input
                    type="text"
                    name="name"
                    value={addNewStudent.name}
                    placeholder="Введите ФИО..."
                    onChange={handleInputChange}
                    className="add_student_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">
                    Факультет<span className="red_star">*</span>:
                  </div>
                  {/* <div className="data">{student.faculty}</div> */}
                  {/* <input
                    type="text"
                    name="faculty"
                    placeholder="Введите факультет..."
                    value={addNewStudent.faculty}
                    onChange={handleInputChange}
                    className="add_student_input"
                  /> */}
                  <select
                    name="faculty"
                    value={addNewStudent.faculty}
                    onChange={handleFacultyChange}
                    className="add_student_select ">
                    <option value="">Выберите факультет...</option>
                    {Object.keys(faculties).map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="table_line">
                  <div className="title">
                    Год поступления<span className="red_star">*</span>:
                  </div>
                  {/* <div className="data">{student.yearOfAdmission}</div> */}
                  {/* <input
                    type="number"
                    min="1900"
                    max="2024"
                    placeholder="Введите год..."
                    name="yearOfAdmission"
                    value={addNewStudent.yearOfAdmission}
                    onChange={handleInputChange}
                    className="add_student_input"
                    
                  /> */}

                  <select
                    name="yearOfAdmission"
                    value={addNewStudent.yearOfAdmission}
                    onChange={handleInputChange}
                    className="add_student_select">
                    <option value="">Выберите год...</option>
                    {Array.from({ length: 2024 - 1970 + 1 }, (_, i) => (
                      <option key={i} value={2024 - i}>
                        {2024 - i}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="table_line">
                  <div className="title">
                    Ступень образования<span className="red_star">*</span>:
                  </div>
                  {/* <div className="data">{student.level}</div> */}
                  {/* <input
                    type="text"
                    name="level"
                    placeholder="Введите ступень..."
                    value={addNewStudent.level}
                    onChange={handleInputChange}
                    className="add_student_input"
                  /> */}
                  <select
                    name="level"
                    value={addNewStudent.level}
                    onChange={handleInputChange}
                    className="add_student_select add_student_select_level">
                    <option value="">Выберите ступень...</option>
                    <option value="bakalavriat">Бакалавриат</option>
                    <option value="magistratura">Магистратура</option>
                    <option value="aspirantura">Аспирантура</option>
                    <option value="specialitet">Специалитет</option>
                  </select>
                </div>

                <div className="table_line">
                  <div className="title">Архивность:</div>
                  <div className="data">
                    {/* {student.archive ? "Да" : "Нет"} */}
                    {addNewStudent.archive}
                  </div>
                </div>

                <div className="table_line">
                  <div className="title">Дата создания:</div>
                  <div className="data">
                    Сгенерировать
                    {/* {formatDate(student.created_at)} */}
                  </div>
                </div>

                <div className="table_line last_line">
                  <div className="title">Дата обновления:</div>
                  <div className="data">
                    Сгенерировать
                    {/* {formatDate(student.updated_at)} */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="student_profile_bottom_wrapper">
            <table className="student_profile_department_info_table">
              <tbody className="student_profile_table_body">
                <tr className="bottom_table_line">
                  <td className="bottom_data_title bottom_data_title_first_left">
                    Кафедра:
                  </td>
                  <td className="bottom_data_info bottom_data_title_first_right">
                    {/* {student.department} */}
                    {/* <input
                      type="text"
                      name="department"
                      placeholder="Введите кафедру..."
                      value={addNewStudent.department}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input white_placeholder"
                    /> */}
                    <select
                      name="department"
                      value={addNewStudent.department}
                      onChange={handleDepartmentChange}
                      className="add_student_select add_student_select_department"
                      disabled={!addNewStudent.faculty}>
                      <option value="">Выберите кафедру...</option>
                      {addNewStudent.faculty &&
                        faculties[addNewStudent.faculty].map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Научный руководитель <br></br> курсовой работы:
                  </td>
                  <td className="bottom_data_info">
                    {/* {student.courseSupervisor} */}
                    <input
                      type="text"
                      name="courseSupervisor"
                      placeholder="Введите научного руководителя..."
                      value={addNewStudent.courseSupervisor}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    />
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Название курсовой работы:
                  </td>
                  <td className="bottom_data_info">
                    {/* {student.courseWorkTitle} */}
                    <textarea
                      type="text"
                      placeholder="Введите название..."
                      name="courseWorkTitle"
                      value={addNewStudent.courseWorkTitle}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                      row="2"
                    />
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Оценка за курсовую работу:
                  </td>
                  <td className="bottom_data_info">
                    {/* {student.courseGrade} */}
                    {/* <input
                      type="number"
                      //   min="" 
                      //   max=""
                      name="courseGrade"
                      placeholder="Введите оценку..."
                      value={addNewStudent.courseGrade}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    /> */}
                    <select
                      name="courseGrade"
                      value={addNewStudent.courseGrade}
                      onChange={handleInputChange}
                      className="add_student_select add_student_big_input add_student_select_grade">
                      <option value="">Выберите оценку...</option>
                      {Array.from({ length: 5 - 2 + 1 }, (_, i) => (
                        <option key={i} value={5 - i}>
                          {5 - i}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Научный руководитель <br></br> дипломной работы:
                  </td>
                  <td className="bottom_data_info">
                    {/* {student.diplomaSupervisor} */}
                    <input
                      type="text"
                      name="diplomaSupervisor"
                      placeholder="Введите научного руководителя..."
                      value={addNewStudent.diplomaSupervisor}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    />
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Название дипломной работы:
                  </td>
                  <td className="bottom_data_info">
                    {/* {student.diplomaTitle} */}
                    <textarea
                      type="text"
                      name="diplomaTitle"
                      placeholder="Введите название работы..."
                      value={addNewStudent.diplomaTitle}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                      row="2"
                    />
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Оценка за дипломную работу:
                  </td>
                  <td className="bottom_data_info">
                    {/* {student.diplomaGrade} */}
                    {/* <input
                      type="number"
                      //   min="" 
                      //   max=""
                      name="diplomaGrade"
                      placeholder="Введите оценку..."
                      value={addNewStudent.diplomaGrade}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    /> */}
                    <select
                      name="diplomaGrade"
                      value={addNewStudent.diplomaGrade}
                      onChange={handleInputChange}
                      className="add_student_select add_student_big_input add_student_select_grade">
                      <option value="">Выберите оценку...</option>
                      {Array.from({ length: 5 - 2 + 1 }, (_, i) => (
                        <option key={i} value={5 - i}>
                          {5 - i}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">Год окончания:</td>
                  <td className="bottom_data_info">
                    {/* {student.graduationYear} */}
                    {/* <input
                      type="number"
                      min="1900"
                      max="2024" // изменить пределы?
                      name="graduationYear"
                      placeholder="Введите год..."
                      value={addNewStudent.graduationYear}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    /> */}
                    <select
                      name="graduationYear"
                      value={addNewStudent.graduationYear}
                      onChange={handleInputChange}
                      className="add_student_select add_student_big_input add_student_select_grade">
                      <option value="">Выберите год...</option>
                      {Array.from({ length: 2024 - 1970 + 1 }, (_, i) => (
                        <option key={i} value={2024 - i}>
                          {2024 - i}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="bottom_table_line">
                  <td className="bottom_data_title bottom_data_title_last_left">
                    Успешность окончания:
                  </td>
                  <td className="bottom_data_info bottom_data_title_last_right">
                    {/* {student.successAssessment} */}
                    {/* <input
                      type="text"
                      name="successAssessment"
                      placeholder="Введите успешность..."
                      value={addNewStudent.successAssessment}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    /> */}
                    <select
                      name="successAssessment"
                      value={addNewStudent.successAssessment}
                      onChange={handleInputChange}
                      className="add_student_select add_student_select_success">
                      <option value="">Выберите успешность...</option>
                      <option value="zakonchil">Закончил</option>
                      <option value="otchislen">Отчислен</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewStudent;
