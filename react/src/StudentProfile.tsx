import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import Header from "./Header";
import { ReactComponent as StarIcon } from "./pictures/star_icon.svg";
import { ReactComponent as AddStudentIcon } from "./pictures/add_student_icon.svg";
import { ReactComponent as BackIcon } from "./pictures/back_icon.svg";
import { ReactComponent as EditIcon } from "./pictures/edit_icon.svg";
import { ReactComponent as ArchiveIcon } from "./pictures/archive_icon.svg";
import { ReactComponent as DeleteIcon } from "./pictures/delete_icon.svg";

import "./StudentProfile.css";
import CustomAlert from "./CustomAlert";

const StudentProfile = () => {
  const { studentId } = useParams();
  const student = studentsData.find((s) => s.studentId === studentId);

  const [alert, setAlert] = useState(null);

  const handleDelete = () => {
    if (student.archive) {
      setAlert({
        message: "Вы не можете удалить архивного студента!",
      });
    }
    else {
      setAlert({
        message: "Студент успешно удалён.",
      });
    }
  };

  const handleArchive = () => {
    if (student.archive) {
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
                <div className="data">{student.id}</div>
              </div>
              <div className="table_line">
                <div className="title">ФИО:</div>
                <div className="data">{student.name}</div>
              </div>
              <div className="table_line">
                <div className="title">Студенческий:</div>
                <div className="data">{student.studentId}</div>
              </div>

              <div className="table_line">
                <div className="title">Факультет:</div>
                <div className="data">{student.faculty}</div>
              </div>

              <div className="table_line">
                <div className="title">Год поступления:</div>
                <div className="data">{student.yearOfAdmission}</div>
              </div>

              <div className="table_line">
                <div className="title">Ступень образования:</div>
                <div className="data">{student.level}</div>
              </div>

              <div className="table_line">
                <div className="title">Архивность:</div>
                <div className="data">{student.archive ? "Да" : "Нет"}</div>
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

          <div className="student_profile_bottom_wrapper">
            <table className="student_profile_department_info_table">
              <tbody className="student_profile_table_body">
                <tr className="bottom_table_line">
                  <td className="bottom_data_title bottom_data_title_first_left">
                    Кафедра:
                  </td>
                  <td className="bottom_data_info bottom_data_title_first_right">
                    {student.department}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Научный руководитель <br></br> курсовой работы:
                  </td>
                  <td className="bottom_data_info">
                    {student.courseSupervisor}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Название курсовой работы:
                  </td>
                  <td className="bottom_data_info">
                    {student.courseWorkTitle}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Оценка за курсовую работу:
                  </td>
                  <td className="bottom_data_info">{student.courseGrade}</td>
                </tr>
                <tr className="bottom_table_line">
                  <td
                    className="bottom_data_title"
                    style={{ lineHeight: "1.4" }}>
                    Научный руководитель <br></br> дипломной работы:
                  </td>
                  <td className="bottom_data_info">
                    {student.diplomaSupervisor}
                  </td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Название дипломной работы:{" "}
                  </td>
                  <td className="bottom_data_info">{student.diplomaTitle}</td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">
                    Оценка за дипломную работу:
                  </td>
                  <td className="bottom_data_info">{student.diplomaGrade}</td>
                </tr>
                <tr className="bottom_table_line">
                  <td className="bottom_data_title">Год окончания:</td>
                  <td className="bottom_data_info">{student.graduationYear}</td>
                </tr>

                <tr className="bottom_table_line">
                  <td className="bottom_data_title bottom_data_title_last_left">
                    Успешность окончания:
                  </td>
                  <td className="bottom_data_info bottom_data_title_last_right">
                    {student.successAssessment}
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
