import React, { useState, useEffect } from "react";

import default_student_photo from "../../pictures/default_student_photo.png";

import CustomAlert from "../CustomAlert";

import "../../css/StudentProfile.css";
import "../../css/EditStudent.css";
import "../../css/AddNewStudent.css";

const AddNewStudent = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setter(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData("/api/faculties", setFaculties),
        fetchData("/api/departments", setDepartments),
      ]);
      setLoading(false);
    };

    fetchAllData();
  }, []);

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
    ticket_number: "",
    full_name: "",
    faculty_id : "",
    enrollment_date: "",
    education_level: "",
    is_archived: false,
    department_id: "",
    course_supervisor: "",
    coursework_title: "",
    coursework_grade: "",
    diploma_supervisor: "",
    diploma_title: "",
    diploma_grade: "",
    graduation_year: "",
    completion_status: "",
  });

  const handleFacultyChange = (e) => {
    e.preventDefault();
    const selectedFaculty = e.target.value;
    setAddNewStudent((prev) => ({
      ...prev,
      faculty_id: selectedFaculty,
      department_id: "", // Очистим кафедру при смене факультета
    }));
  };

  const handleDepartmentChange = (e) => {
    setAddNewStudent((prev) => ({
      ...prev,
      department_id: e.target.value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddNewStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "ticket_number",
      "full_name",
      "faculty_id",
      "enrollment_date",
      "education_level",
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
      try {
        const response = await fetch("/api/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addNewStudent),
        });

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        setAlert({
          message: "Студент успешно создан.",
        });
      } catch (err) {
        setError(err.message);
      }
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


  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

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
                    name="ticket_number"
                    value={addNewStudent.ticket_number}
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
                    name="full_name"
                    value={addNewStudent.full_name}
                    placeholder="Введите ФИО..."
                    onChange={handleInputChange}
                    className="add_student_input"
                  />
                </div>

                <div className="table_line">
                  <div className="title">
                    Факультет<span className="red_star">*</span>:
                  </div>
                  { addNewStudent.faculty_id != "" ? addNewStudent.faculty_id : "" }
                  <select
                    name="faculty_id"
                    value={addNewStudent.faculty_id}
                    onChange={handleFacultyChange}
                    className="add_student_select ">
                    <option value="">Выберите факультет...</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.faculty_id} value={faculty.faculty_id}>
                        {faculty.faculty_name}
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
                    name="enrollment_date"
                    value={addNewStudent.enrollment_date}
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
                    name="education_level"
                    value={addNewStudent.education_level}
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
                    {addNewStudent.is_archived ? "Да" : "Нет"}
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
                      name="department_id"
                      value={addNewStudent.department_id}
                      onChange={handleDepartmentChange}
                      className="add_student_select add_student_select_department"
                      disabled={!addNewStudent.faculty_id}>
                      <option value="">Выберите кафедру...</option>
                      {addNewStudent.faculty_id &&
                          departments.filter((department, faculty_id) => {
                            return department.faculty_id = faculty_id
                          }).map((department) => (
                            <option key={department.department_id} value={department.department_id}>
                              {department.department_name}
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
                      name="course_supervisor"
                      placeholder="Введите научного руководителя..."
                      value={addNewStudent.course_supervisor}
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
                      name="coursework_title"
                      value={addNewStudent.coursework_title}
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
                      name="course_grade"
                      value={addNewStudent.course_grade}
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
                      name="diploma_supervisor"
                      placeholder="Введите научного руководителя..."
                      value={addNewStudent.diploma_supervisor}
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
                      name="diploma_title"
                      placeholder="Введите название работы..."
                      value={addNewStudent.diploma_title}
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
                      name="diploma_grade"
                      value={addNewStudent.diploma_grade}
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
                      name="graduation_year"
                      value={addNewStudent.graduation_year}
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
                      name="completion_status"
                      value={addNewStudent.completion_status}
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
