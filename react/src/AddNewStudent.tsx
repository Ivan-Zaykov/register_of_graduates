import React, { useState } from "react";

import default_student_photo from "./pictures/default_student_photo.png";

import CustomAlert from "./CustomAlert";

import "./StudentProfile.css";
import "./EditStudent.css";
import "./AddNewStudent.css";

const AddNewStudent = () => {
  const [alert, setAlert] = useState(null);

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

  const [addNewStudent, setAddNewStudent] = useState({
    name: "",
    faculty: "",
    studentId: "",
    yearOfAdmission: "",
    level: "",
    archive: "Нет (по дефолту, если что - добавим туда)",
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
      // window.location.href = "/students";

      // Добавить логику сохранения данных
    }
  };

  const handleAlertClose = () => {
    setAlert(null); // Закрытие alert
  };

  return (
    <>
      {alert && (
        <CustomAlert
          message={alert.message}
          onClose={handleAlertClose}
        />
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
              style={{ textDecoration: "none" }}>
              Сохранить
            </a>
            <div className="student_profile_top_wrapper">
              <div className="button_and_picture_block">
                <a
                  className="edit_student_cancel_button"
                  href="/students"
                  style={{ textDecoration: "none" }}>
                  Отмена
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
                    onChange={handleInputChange}
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
                  <input
                    type="text"
                    name="faculty"
                    placeholder="Введите факультет..."
                    value={addNewStudent.faculty}
                    onChange={handleInputChange}
                    className="add_student_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">
                    Год поступления<span className="red_star">*</span>:
                  </div>
                  {/* <div className="data">{student.yearOfAdmission}</div> */}
                  <input
                    type="number"
                    min="1900"
                    max="2024"
                    placeholder="Введите год..."
                    name="yearOfAdmission"
                    value={addNewStudent.yearOfAdmission}
                    onChange={handleInputChange}
                    className="add_student_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">
                    Ступень образования<span className="red_star">*</span>:
                  </div>
                  {/* <div className="data">{student.level}</div> */}
                  <input
                    type="text"
                    name="level"
                    placeholder="Введите ступень..."
                    value={addNewStudent.level}
                    onChange={handleInputChange}
                    className="add_student_input"
                  />
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
                  <div className="data">Сгенерировать</div>
                </div>

                <div className="table_line last_line">
                  <div className="title">Дата обновления:</div>
                  <div className="data">Сгенерировать</div>
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
                    <input
                      type="text"
                      name="department"
                      placeholder="Введите кафедру..."
                      value={addNewStudent.department}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input white_placeholder"
                    />
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
                    <input
                      type="number"
                      //   min="" //указать пределы оценки!!!!!
                      //   max=""
                      name="courseGrade"
                      placeholder="Введите оценку..."
                      value={addNewStudent.courseGrade}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    />
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
                  <td className="bottom_data_title">
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
                  <td className="bottom_data_title">
                    Оценка за дипломную работу:
                  </td>
                  <td className="bottom_data_info">
                    {/* {student.diplomaGrade} */}
                    <input
                      type="number"
                      //   min="" //указать пределы оценки!!!!!
                      //   max=""
                      name="diplomaGrade"
                      placeholder="Введите оценку..."
                      value={addNewStudent.diplomaGrade}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    />
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">Год окончания:</td>
                  <td className="bottom_data_info">
                    {/* {student.graduationYear} */}
                    <input
                      type="number"
                      min="1900"
                      max="2024" // изменить пределы?
                      name="graduationYear"
                      placeholder="Введите год..."
                      value={addNewStudent.graduationYear}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    />
                  </td>
                </tr>

                <tr className="bottom_table_line">
                  <td className="bottom_data_title bottom_data_title_last_left">
                    Успешность окончания:
                  </td>
                  <td className="bottom_data_info bottom_data_title_last_right">
                    {/* {student.successAssessment} */}
                    <input
                      type="text"
                      name="successAssessment"
                      placeholder="Введите успешность..."
                      value={addNewStudent.successAssessment}
                      onChange={handleInputChange}
                      className="add_student_input add_student_big_input"
                    />
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
