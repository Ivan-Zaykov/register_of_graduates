import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  formatCompletionStatus,
  fetchData,
  formatDate,
  handleFacultyChange,
  handleDepartmentChange, handleSaveStudent, handleInputChange
} from "../../utils/utils";
import CustomAlert from "../CustomAlert";

import "../../css/StudentProfile.css";
import "../../css/EditStudent.css";

const EditStudent = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null); // Состояние для данных студента
  const [editableStudent, setEditableStudent] = useState({}); // Инициализируем пустым объектом
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [scientificSupervisors, setScientificSupervisors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Показываем индикатор загрузки

      try {
        // Первый запрос для получения данных студента
        const studentResponse = await fetch(`/api/student/${studentId}`);

        if (!studentResponse.ok) {
          throw new Error(`Ошибка: ${studentResponse.status}`);
        }

        const student = await studentResponse.json();
        setStudent(student);

        // Параллельное выполнение остальных запросов
        await Promise.all([
          fetchData("/api/faculties", setFaculties, setError),
          fetchData("/api/departments", setDepartments, setError),
          fetchData('/api/education_level', setEducationLevels, setError),
          fetchData('/api/scientific_supervisors', setScientificSupervisors, setError)
        ]);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false); // Скрываем индикатор загрузки
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (student) {
      setEditableStudent({
        student_id: student.student_id,
        full_name: student.full_name,
        ticket_number: student.ticket_number,
        faculty_id: student.faculty_id,
        enrollment_date: student.enrollment_date,
        education_level: student.education_level,
        is_archived: student.is_archived,
        department_id: student.department_id,
        course_supervisor: student.course_supervisor,
        coursework_title: student.coursework_title,
        coursework_grade: student.coursework_grade,
        diploma_supervisor: student.diploma_supervisor,
        diploma_title: student.diploma_title,
        diploma_grade: student.diploma_grade,
        graduation_date: student.graduation_date,
        completion_status: student.completion_status,
      });
    }
  }, [student]); // Эта зависимость позволяет обновлять editableStudent при изменении student

  if (isLoading) {
    return <div>Загрузка...</div>; // Показываем индикатор загрузки
  }

  if (error) {
    return <div>Ошибка: {error}</div>; // Показываем сообщение об ошибке
  }

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    setEditableStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAlertClose = () => {
    setAlert(null); // Закрытие alert
  };

  const filteredDepartments = departments.filter(
      (department) => department.faculty_id === editableStudent.faculty_id
  );

  return (
      <>
        {alert && <CustomAlert message={alert.message} onClose={handleAlertClose} />}
          {alert && (
              <CustomAlert
                  message={alert.message}
                  onClose={handleAlertClose}
              />
          )}
        <>
          <div className="student_profile_content">
            <div className="student_profile_wrapper">
              <div className="edit_top_block">
                <div className="edit_student_top_edit_button">
                  Редактирование студента
                </div>
                <a
                    className="edit_student_save_button"
                    onClick={(e) =>
                        handleSaveStudent(e, editableStudent, 'update', setError, setAlert)}
                    style={{ textDecoration: "none", color: "inherit"}}>
                  Сохранить
                </a>
                <div className="student_profile_top_wrapper">
                  <div className="button_and_picture_block">
                    <a
                        className="edit_student_cancel_button"
                        href={`/students/${studentId}`}
                        style={{ textDecoration: "none", color: "#AE1010" }}>
                      Отмена
                    </a>

                    <div className="picture_block">
                      {/*<img*/}
                      {/*    src={image}*/}
                      {/*    alt={student.name}*/}
                      {/*    className="student_photo"*/}
                      {/*/>*/}
                      <label htmlFor="file-input">
                        {/*<EditIcon className="edit_photo_icon" />*/}
                      </label>
                      <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          // onChange={handleImageChange}
                          style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="info_table">
                    <div className="table_line first_line">
                      <div className="title">ID:</div>
                      <div className="data">{student.student_id}</div>
                    </div>
                    <div className="table_line">
                      <div className="title">ФИО:</div>
                      <input
                          type="text"
                          name="full_name"
                          value={editableStudent.full_name}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="editable_input"
                      />
                      <div className="data">{student.full_name}</div>
                    </div>
                    <div className="table_line">
                    <div className="title">Студенческий:</div>
                      <input
                          type="text"
                          name="ticket_number"
                          value={editableStudent.ticket_number}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="editable_input"
                      />
                       <div className="data">{student.ticket_number}</div>
                    </div>

                    <div className="table_line">
                      <div className="title">
                        Факультет<span className="red_star">*</span>:
                      </div>
                      <select
                          name="faculty_id"
                          value={editableStudent.faculty_id}
                          onChange={(e) => handleFacultyChange(e, setEditableStudent)}
                          className="add_student_select">
                        <option value="">Выберите факультет...</option>
                        {faculties.map((faculty) => (
                            <option key={faculty.faculty_id} value={faculty.faculty_id}>
                              {faculty.faculty_name}
                            </option>
                        ))}
                      </select>
                      <div className="data">
                      {editableStudent.faculty_id != "" ? faculties.filter(
                          (faculty) => faculty.faculty_id === student.faculty_id
                      )[0].faculty_name : ""}
                      </div>
                    </div>

                    <div className="table_line">
                      <div className="title">Год поступления:</div>
                      <input
                          type="date"
                          min="1900"
                          max="2024"
                          name="enrollment_date"
                          value={editableStudent.enrollment_date}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="editable_input"
                      />
                      <div className="data">{formatDate(student.enrollment_date)}</div>
                    </div>

                    <div className="table_line">
                      <div className="title">Ступень образования:</div>
                      {/* <div className="data">{student.level}</div> */}
                      <select
                          name="education_level"
                          value={editableStudent.education_level}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="add_student_select">
                        <option value="">Выберите ступень образования...</option>
                        {Object.keys(educationLevels).map((key) => (
                            <option key={key} value={key}>
                              {educationLevels[key]}
                            </option>
                        ))}
                      </select>
                      <div className="data">{educationLevels[student.education_level]}</div>
                    </div>

                    <div className="table_line">
                    <div className="title">Архивность:</div>
                      <div className="data">
                        {student.is_archived ? "Да" : "Нет"}
                      </div>
                    </div>

                    <div className="table_line">
                      <div className="title">Дата создания:</div>
                      <div className="data">
                         {formatDate(student.created_at)}
                      </div>
                    </div>

                    <div className="table_line last_line">
                      <div className="title">Дата обновления:</div>
                      <div className="data">
                         {formatDate(student.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="student_profile_bottom_wrapper">
                <table className="student_profile_department_info_table">
                  <tbody className="student_profile_table_body">
                  <tr>
                    <td className="bottom_data_title bottom_data_title_first_left">
                      Научная работа:
                    </td>
                    <td className="bottom_data_info bottom_data_title_first_right">
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td className="bottom_data_title">
                      Кафедра:
                    </td>
                    <td className="bottom_data_info">
                      <select
                          value={editableStudent.faculty_id}
                          onChange={(e) => handleDepartmentChange(e, setEditableStudent)}
                          className="add_student_select">
                        <option value="">Выберите кафедру</option>
                        {filteredDepartments.map((department) => (
                            <option key={department.department_id} value={department.department_id}>
                              {department.department_name}
                            </option>
                        ))}
                      </select>
                      <div className="data">
                        {editableStudent.department_id != "" ? departments.filter(
                            (department) => department.department_id === student.department_id
                        )[0].department_name : ""}
                      </div>
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td
                        className="bottom_data_title"
                        style={{lineHeight: "1.4"}}>
                      Научный руководитель <br></br> курсовой работы:
                    </td>
                    <td className="bottom_data_info">
                      <td className="bottom_data_info">
                        <select
                            name="course_supervisor"
                            value={editableStudent.course_supervisor}
                            onChange={(e) => handleInputChange(e, setEditableStudent)}
                            className="add_student_select add_student_big_input add_student_select_grade">
                          <option value="">Выберите руководителя курсовой...</option>
                          {Object.keys(scientificSupervisors).map((key) => (
                              <option key={key} value={key}>
                                {scientificSupervisors[key]['full_name']}
                              </option>
                          ))}
                        </select>
                      </td>
                      {scientificSupervisors[student.course_supervisor] ?
                          scientificSupervisors[student.course_supervisor].full_name : '' }
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td className="bottom_data_title">
                      Название курсовой работы:
                    </td>
                    <td className="bottom_data_info">
                      <textarea
                          type="text"
                          name="coursework_title"
                          value={editableStudent.coursework_title}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="editable_input big_input"
                          row="2"
                      />
                      {student.coursework_title}
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td className="bottom_data_title">
                      Оценка за курсовую работу:
                    </td>
                    <td className="bottom_data_info">
                      <select
                          name="coursework_grade"
                          value={editableStudent.coursework_grade}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="add_student_select add_student_big_input add_student_select_grade">
                        <option value="">Выберите оценку...</option>
                        {Array.from({length: 5 - 2 + 1}, (_, i) => (
                            <option key={i} value={5 - i}>
                              {5 - i}
                            </option>
                        ))}
                      </select>
                      {student.coursework_grade}
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td
                        className="bottom_data_title"
                        style={{lineHeight: "1.4"}}>
                      Научный руководитель <br></br> дипломной работы:
                    </td>
                    <td className="bottom_data_info">
                      <select
                          name="diploma_supervisor"
                          value={editableStudent.diploma_supervisor}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="add_student_select add_student_big_input add_student_select_grade">
                        <option value="">Выберите руководителя дипломной...</option>
                        {Object.keys(scientificSupervisors).map((key) => (
                            <option key={key} value={key}>
                              {scientificSupervisors[key]['full_name']}
                            </option>
                        ))}
                      </select>
                      {
                        scientificSupervisors[student.diploma_supervisor] ?
                          scientificSupervisors[student.diploma_supervisor].full_name :
                          ""
                      }
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td className="bottom_data_title" style={{lineHeight: "1.4"}}>
                      Название дипломной <br></br> работы:
                    </td>
                    <td className="bottom_data_info">
                      <textarea
                          type="text"
                          name="diploma_title"
                          value={editableStudent.diploma_title}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="editable_input big_input"
                          row="2"
                      />
                      {student.diploma_title}
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td className="bottom_data_title" style={{lineHeight: "1.4"}}>
                      Оценка за дипломную <br></br> работу:
                    </td>
                    <td className="bottom_data_info">
                      <select
                          name="diploma_grade"
                          value={editableStudent.diploma_grade}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="add_student_select add_student_big_input add_student_select_grade">
                        <option value="">Выберите оценку...</option>
                        {Array.from({length: 5 - 2 + 1}, (_, i) => (
                            <option key={i} value={5 - i}>
                              {5 - i}
                            </option>
                        ))}
                      </select>
                      {student.diploma_grade}
                    </td>
                  </tr>
                  <tr className="bottom_table_line">
                    <td className="bottom_data_title">Год окончания:</td>
                    <td className="bottom_data_info">
                      <input
                          type="date"
                          min="1900"
                          max="2024" // изменить пределы?
                          name="graduation_date"
                          value={editableStudent.graduation_date}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="editable_input big_input"
                      />
                      {formatDate(student.graduation_date)}
                    </td>
                  </tr>

                  <tr className="bottom_table_line">
                    <td className="bottom_data_title bottom_data_title_last_left">
                      Успешность окончания:
                    </td>
                    <td className="bottom_data_info bottom_data_title_last_right">
                      <input
                          type="checkbox"
                          name="completion_status"
                          checked={editableStudent.completion_status}
                          onChange={(e) => handleInputChange(e, setEditableStudent)}
                          className="editable_input big_input"
                      />
                      {formatCompletionStatus(student.completion_status)}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
        );
      </>
  );
};

export default EditStudent;
