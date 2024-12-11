import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import Header from "../Header";
import { ReactComponent as StarIcon } from "../../pictures/star_icon.svg";
import { ReactComponent as AddStudentIcon } from "../../pictures/add_student_icon.svg";
import { ReactComponent as BackIcon } from "../../pictures/back_icon.svg";
import { ReactComponent as EditIcon } from "../../pictures/edit_icon.svg";
import { ReactComponent as ArchiveIcon } from "../../pictures/archive_icon.svg";
import { ReactComponent as DeleteIcon } from "../../pictures/delete_icon.svg";

import "../../css/StudentProfile.css";
import CustomAlert from "../CustomAlert";

const StudentProfile = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null); // Состояние для данных студента
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние для ошибок
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`/api/student/${studentId}`);
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data); // Сохраняем данные студента
      } catch (err) {
        setError(err.message); // Обрабатываем ошибку
      } finally {
        setIsLoading(false); // Выключаем индикатор загрузки
      }
    };

    fetchStudentData(); // Запрос данных при монтировании компонента
  }, [studentId]);

  if (isLoading) {
    return <div>Загрузка...</div>; // Показываем индикатор загрузки
  }

  if (error) {
    return <div>Ошибка: {error}</div>; // Показываем сообщение об ошибке
  }

  const handleDelete = async () => {
    const url = `/api/student/${student.student_id}`;

    if (student.is_archived) {
      setAlert({
        message: "Вы не можете удалить архивного студента!",
      });
    } else {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Ошибка при удалении студента: ${response.status}`);
        }

        setAlert({
          message: "Студент успешно удалён.",
        });
      } catch (error) {
        console.error('Ошибка:', error.message);
      }
    }
  };

  const handleArchive = () => {
    if (student.is_archived) {
      // запрос на архив/разархив!!!!
      setAlert({
        message: "Студент успешно разархивирован.",
      });
    } else {
      setAlert({
        message: "Студент успешно архивирован.",
      });
    }
  };


  const handleEdit = () => {
    if (student.archive) {
      setAlert({
        message: "Вы не можете редактировать архивного студента!",
      });
    }
    else {
      window.location.href = `/students/edit/${studentId}`;
    }
  };






  const handleAlertClose = () => {
    setAlert(null); // Закрытие alert
  };

  if (!student) {
    return (
      <>
        <Header />
        <div className="student_not_found">
          Карточка студента с id = {studentId} не найдена
        </div>
      </>
    );
  }

  return (
    <>
      {alert && (
        <CustomAlert message={alert.message} onClose={handleAlertClose} />
      )}
      <Header />
      <div className="student_profile_content">
        <div className="student_profile_header_line">
          <div className="path_line">
            <Link to="/" className="path_line_text">
              Главная
            </Link>
            <StarIcon />
            <Link to="/students" className="path_line_text">
              Студенты
            </Link>
            <StarIcon />
            <Link
              to={`/students/${student.studentId}`}
              className="path_line_text">
              {student.name}
            </Link>
          </div>

          <div className="add_and_input_block only_add">
            <a href="/students/add_new_student">
              <AddStudentIcon className="add_icon" />
            </a>
          </div>
        </div>

        <div className="student_profile_wrapper">
          <div className="student_profile_top_wrapper">
            <div className="button_and_picture_block">
              <div className="buttons_block">
                <a href={`/students`}>
                  <BackIcon className="button_icon" />
                </a>
                {/* <a href={`/students/edit/${studentId}`}> */}
                  <EditIcon onClick={handleEdit} className="button_icon" />
                {/* </a> */}
                <DeleteIcon onClick={handleDelete} className="button_icon" />
                <ArchiveIcon onClick={handleArchive} className="button_icon" />
              </div>

              <div className="picture_block">
                <img
                  // src={student.image}
                  src={student.image}
                  alt={student.name}
                  className="student_photo"
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
                <div className="data">{student.full_name}</div>
              </div>
              <div className="table_line">
                <div className="title">Студенческий:</div>
                <div className="data">{student.ticket_number}</div>
              </div>

              <div className="table_line">
                <div className="title">Факультет:</div>
                <div className="data">{student.faculty_name}</div>
              </div>

              <div className="table_line">
                <div className="title">Год поступления:</div>
                <div className="data">{student.enrollment_date}</div>
              </div>

              <div className="table_line">
                <div className="title">Ступень образования:</div>
                <div className="data">{student.education_level}</div>
              </div>

              <div className="table_line">
                <div className="title">Архивность:</div>
                <div className="data">{student.is_archived ? "Да" : "Нет"}</div>
              </div>

              <div className="table_line">
                <div className="title">Дата создания:</div>
                <div className="data">{student.created_at}</div>
              </div>

              <div className="table_line last_line">
                <div className="title">Дата обновления:</div>
                <div className="data">{student.updated_at}</div>
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
                    {student.department_id}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Научный руководитель <br></br> курсовой работы:
                  </td>
                  <td className="bottom_data_info">
                    {student.course_supervisor}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Название курсовой работы:
                  </td>
                  <td className="bottom_data_info">
                    {student.coursework_title}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Оценка за курсовую работу:
                  </td>
                  <td className="bottom_data_info">{student.coursework_grade}</td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Научный руководитель <br></br> дипломной работы:
                  </td>
                  <td className="bottom_data_info">
                    {student.diploma_supervisor}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Название дипломной работы:{" "}
                  </td>
                  <td className="bottom_data_info">{student.diploma_title}</td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Оценка за дипломную работу:
                  </td>
                  <td className="bottom_data_info">{student.diploma_grade}</td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">Год окончания:</td>
                  <td className="bottom_data_info">{student.graduation_date}</td>
                </tr>

                <tr className="bottom_table_line">
                  <td className="bottom_data_title bottom_data_title_last_left">
                    Успешность окончания:
                  </td>
                  <td className="bottom_data_info bottom_data_title_last_right">
                    {student.completion_status}
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

export default StudentProfile;
