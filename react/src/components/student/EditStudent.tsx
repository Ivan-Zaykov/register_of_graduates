import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import Header from "../Header";
import { ReactComponent as StarIcon } from "../../pictures/star_icon.svg";
import { ReactComponent as AddStudentIcon } from "../../pictures/add_student_icon.svg";
import { ReactComponent as BackIcon } from "../../pictures/back_icon.svg";
import { ReactComponent as EditIcon } from "../../pictures/edit_icon.svg";
import { ReactComponent as ArchiveIcon } from "../../pictures/archive_icon.svg";
import { ReactComponent as DeleteIcon } from "../../pictures/delete_icon.svg";

import CustomAlert from "../CustomAlert";

import "../../css/StudentProfile.css";
import "../../css/EditStudent.css";

const EditStudent = () => {
  const { studentId } = useParams();
  const student = studentsData.find((s) => s.studentId === studentId);
  const [alert, setAlert] = useState(null); 

  // Код для замены фото студента (значок редактирования в углу фото)
  const [image, setImage] = useState(student.image); // Изначальная картинка
  

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Берём первый выбранный файл
    if (file) {
      const reader = new FileReader(); // Создаём FileReader для преобразования файла в URL
      reader.onload = () => setImage(reader.result); // Устанавливаем картинку после чтения
      reader.readAsDataURL(file); // Читаем файл как Data URL
    }
  };

  const [editableStudent, setEditableStudent] = useState({
    name: student.name,
    faculty: student.faculty,
    studentId: student.studentId,
    yearOfAdmission: student.yearOfAdmission,
    level: student.level,
    archive: student.archive,
    department: student.department,
    courseSupervisor: student.courseSupervisor,
    courseWorkTitle: student.courseWorkTitle,
    courseGrade: student.courseGrade,
    diplomaSupervisor: student.diplomaSupervisor,
    diplomaTitle: student.diplomaTitle,
    diplomaGrade: student.diplomaGrade,
    graduationYear: student.graduationYear,
    successAssessment: student.successAssessment,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Сохраненные данные:", editableStudent);
    setAlert({
      message: "Студент успешно изменён.",
      // можно добавить проверку на наличие изменений, тогда не выводить alert
    });
    // Логика отправки данных на сервер
    // НЕ ЗАБЫТЬ ПРО КАРТИНКУ!!!
  };

  const handleAlertClose = () => {
    setAlert(null); // Закрытие alert
  };

  if (!student) {
    // Можно убрать
    return (
      <>
        <Header />
        <div className="student_not_found">
          Карточка студента с id = {studentId} не найдена, редактирование
          недоступно
        </div>
      </>
    );
  }

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
              Редактирование студента
            </div>
            <a
              className="edit_student_save_button"
              // href={`/students/${studentId}`} 
              // Новая информация идет в консоль, из-за перехода назад может быть не видно,
              // так что пока закомментируй эту строчку
              onClick={handleSave}
              style={{ textDecoration: "none" }}>
              Сохранить
            </a>
            <div className="student_profile_top_wrapper">
              <div className="button_and_picture_block">
                <a
                  className="edit_student_cancel_button"
                  href={`/students/${studentId}`}
                  style={{ textDecoration: "none" }}>
                  Отмена
                </a>

                <div className="picture_block">
                  <img
                    src={image}
                    alt={student.name}
                    className="student_photo"
                  />
                  <label htmlFor="file-input">
                    <EditIcon className="edit_photo_icon" />
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
                  <div className="data">{student.id}</div>
                </div>
                <div className="table_line">
                  <div className="title">ФИО:</div>
                  {/* <div className="data">{student.name}</div> */}
                  <input
                    type="text"
                    name="name"
                    value={editableStudent.name}
                    onChange={handleInputChange}
                    className="editable_input"
                  />
                </div>
                <div className="table_line">
                  <div className="title">Студенческий:</div>
                  {/* <div className="data">{student.studentId}</div> */}
                  <input
                    type="number"
                    name="studentId"
                    value={editableStudent.studentId}
                    onChange={handleInputChange}
                    className="editable_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">Факультет:</div>
                  {/* <div className="data">{student.faculty}</div> */}
                  <input
                    type="text"
                    name="faculty"
                    value={editableStudent.faculty}
                    onChange={handleInputChange}
                    className="editable_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">Год поступления:</div>
                  {/* <div className="data">{student.yearOfAdmission}</div> */}
                  <input
                    type="number"
                    min="1900"
                    max="2024"
                    name="yearOfAdmission"
                    value={editableStudent.yearOfAdmission}
                    onChange={handleInputChange}
                    className="editable_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">Ступень образования:</div>
                  {/* <div className="data">{student.level}</div> */}
                  <input
                    type="text"
                    name="level"
                    value={editableStudent.level}
                    onChange={handleInputChange}
                    className="editable_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">Архивность:</div>
                  <div className="data">
                    {student.archive ? "Да" : "Нет"}
                  </div>
                </div>

                <div className="table_line">
                  <div className="title">Дата создания:</div>
                  <div className="data">{student.creationDate}</div>
                </div>

                <div className="table_line last_line">
                  <div className="title">Дата обновления:</div>
                  <div className="data">{student.updateDate}</div>
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
                      value={editableStudent.department}
                      onChange={handleInputChange}
                      className="editable_input big_input white_border"
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
                      value={editableStudent.courseSupervisor}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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
                      name="courseWorkTitle"
                      value={editableStudent.courseWorkTitle}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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
                      value={editableStudent.courseGrade}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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
                      value={editableStudent.diplomaSupervisor}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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
                      value={editableStudent.diplomaTitle}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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
                      value={editableStudent.diplomaGrade}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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
                      value={editableStudent.graduationYear}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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
                      value={editableStudent.successAssessment}
                      onChange={handleInputChange}
                      className="editable_input big_input"
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

export default EditStudent;
