package handlers

import (
	"api/utils"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	pgxpool "github.com/jackc/pgx/v5/pgxpool"
)

type Student struct {
	StudentID         uuid.UUID              `json:"student_id"`
	FacultyID         uuid.UUID              `json:"faculty_id"`
	FacultyName       utils.CustomNullString `json:"faculty_name"`
	DepartmentID      utils.CustomNullString `json:"department_id"`
	DepartmentName    utils.CustomNullString `json:"department_name"`
	TicketNumber      string                 `json:"ticket_number"`
	FullName          string                 `json:"full_name"`
	EnrollmentDate    utils.CustomDate       `json:"enrollment_date"`
	EducationLevel    string                 `json:"education_level"`
	GraduationDate    utils.CustomDate       `json:"graduation_date,omitempty"`
	CompletionStatus  utils.CustomBoolString `json:"completion_status,omitempty"`
	IsArchived        utils.CustomBoolString `json:"is_archived"`
	CreatedAt         *time.Time             `json:"created_at"`
	UpdatedAt         *time.Time             `json:"updated_at"`
	CourseworkTitle   utils.CustomNullString `json:"coursework_title"`
	CourseworkGrade   utils.CustomNullString `json:"coursework_grade"`
	CourseSupervisor  utils.CustomNullString `json:"course_supervisor"`
	DiplomaSupervisor utils.CustomNullString `json:"diploma_supervisor"`
	DiplomaTitle      utils.CustomNullString `json:"diploma_title"`
	DiplomaGrade      utils.CustomNullString `json:"diploma_grade"`
}

func StudentExistsByTicketNumber(conn *pgxpool.Conn, ticketNumber string) (bool, error) {
	query := "SELECT COUNT(*) FROM student WHERE ticket_number = $1"
	var count int

	err := conn.QueryRow(context.Background(), query, ticketNumber).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("ошибка при проверке существования студента: %v", err)
	}

	return count > 0, nil
}

func StudentExists(conn *pgxpool.Conn, studentID uuid.UUID) (bool, error) {
	query := "SELECT COUNT(*) FROM student WHERE student_id = $1"
	var count int

	err := conn.QueryRow(context.Background(), query, studentID).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("ошибка при проверке существования студента: %v", err)
	}

	return count > 0, nil
}

func GetStudent(conn *pgxpool.Conn, studentID uuid.UUID) (map[string]interface{}, error) {
	// Проверяем существование студента
	exists, err := StudentExists(conn, studentID)
	if err != nil {
		return nil, fmt.Errorf("ошибка проверки существования студента: %w", err)
	}
	if !exists {
		return nil, fmt.Errorf("студент с ID %s не найден", studentID)
	}

	// Запрос данных студента
	query := `
		SELECT
            st.student_id,
            st.ticket_number,
            st.full_name,
            fct.faculty_id,
            fct.faculty_name,
            dpts.department_id,
            dpts.department_name,
            st.education_level,
            st.enrollment_date,
            st.graduation_date,
            st.completion_status,
            st.is_archived,
            st.created_at,
            st.updated_at,
            cswk.coursework_title,
            cswk.coursework_grade,
            css.supervisor_id as course_supervisor,
            dps.supervisor_id as diploma_supervisor,
            dpm.diploma_title,
            dpm.diploma_grade
        FROM student st
        LEFT JOIN faculty fct ON st.faculty_id = fct.faculty_id
        LEFT JOIN departments dpts ON st.department_id = dpts.department_id
        LEFT JOIN coursework cswk ON st.student_id = cswk.student_id
        LEFT JOIN diploma dpm ON st.student_id = dpm.student_id
        /* Руководитель курсовой */
		LEFT JOIN scientific_supervisor css ON cswk.supervisor_id = css.supervisor_id
		/* Руководитель диплома */
		LEFT JOIN scientific_supervisor dps ON dpm.supervisor_id = dps.supervisor_id
        
		WHERE st.student_id = $1`

	var Student Student
	err = conn.QueryRow(context.Background(), query, studentID).Scan(
		&Student.StudentID,
		&Student.TicketNumber,
		&Student.FullName,
		&Student.FacultyID,
		&Student.FacultyName,
		&Student.DepartmentID,
		&Student.DepartmentName,
		&Student.EducationLevel,
		&Student.EnrollmentDate,
		&Student.GraduationDate,
		&Student.CompletionStatus,
		&Student.IsArchived,
		&Student.CreatedAt,
		&Student.UpdatedAt,
		&Student.CourseworkTitle,
		&Student.CourseworkGrade,
		&Student.CourseSupervisor,
		&Student.DiplomaSupervisor,
		&Student.DiplomaTitle,
		&Student.DiplomaGrade,
	)
	if err != nil {
		return nil, fmt.Errorf("ошибка извлечения студента: %w", err)
	}

	// Возвращаем результат в виде карты (для JSON)
	result := map[string]interface{}{
		"student_id":         Student.StudentID,
		"ticket_number":      Student.TicketNumber,
		"full_name":          Student.FullName,
		"faculty_id":         Student.FacultyID,
		"faculty_name":       Student.FacultyName,
		"department_id":      Student.DepartmentID,
		"department_name":    Student.DepartmentName,
		"education_level":    Student.EducationLevel,
		"enrollment_date":    Student.EnrollmentDate,
		"graduation_date":    Student.GraduationDate,
		"completion_status":  Student.CompletionStatus,
		"is_archived":        Student.IsArchived,
		"created_at":         Student.CreatedAt,
		"updated_at":         Student.UpdatedAt,
		"coursework_title":   Student.CourseworkTitle,
		"coursework_grade":   Student.CourseworkGrade,
		"course_supervisor":  Student.CourseSupervisor,
		"diploma_supervisor": Student.DiplomaSupervisor,
		"diploma_title":      Student.DiplomaTitle,
		"diploma_grade":      Student.DiplomaGrade,
	}

	return result, nil
}

func GetStudentHandler(connPool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := connPool.Acquire(context.Background())
		if err != nil {
			log.Fatalf("Ошибка при получении соединения из пула: %v\n", err)
		}
		defer conn.Release()

		// Извлекаем student_id из параметров запроса
		vars := mux.Vars(r)
		studentID, err := uuid.Parse(vars["id"])
		if err != nil {
			http.Error(w, "Некорректный ID студента", http.StatusBadRequest)
			return
		}

		// Получаем данные студента из базы
		studentData, err := GetStudent(conn, studentID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		// Возвращаем данные студента в формате JSON
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(studentData); err != nil {
			http.Error(w, "Ошибка кодирования JSON", http.StatusInternalServerError)
		}
	}
}

func CreateStudent(conn *pgxpool.Conn, facultyID uuid.UUID, ticketNumber string, fullName string, educationLevel string, enrollmentDate time.Time) error {
	defer conn.Release()

	// Проверяем, существует ли студент с данным номером студенческого билета
	if exists, err := StudentExistsByTicketNumber(conn, ticketNumber); err != nil {
		return fmt.Errorf("ошибка проверки существования студента: %v", err)
	} else if exists {
		return fmt.Errorf("студент с номером студенческого '%s' уже существует", ticketNumber)
	}

	// SQL-запрос на создание студента
	query := `
		INSERT INTO student (
			student_id, faculty_id, ticket_number, 
			full_name, education_level, enrollment_date, is_archived, created_at, updated_at 
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	_, err := conn.Exec(
		context.Background(),
		query,
		uuid.New(),     // student_id
		facultyID,      // faculty_id
		ticketNumber,   // ticket_number
		fullName,       // full_name
		educationLevel, // education_level
		enrollmentDate, // enrollment_date
		false,          // is_archived
		time.Now(),     // created_at
		time.Now(),     // updated_at
	)

	if err != nil {
		return fmt.Errorf("ошибка при добавлении студента: %v", err)
	}

	return nil
}

func CreateStudentHandler(connPool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := connPool.Acquire(context.Background())
		if err != nil {
			log.Fatalf("Ошибка при получении соединения из пула: %v\n", err)
		}
		defer conn.Release()

		// Парсим тело запроса
		var req struct {
			FacultyID      string `json:"faculty_id"`
			DepartmentID   string `json:"department_id"`
			TicketNumber   string `json:"ticket_number"`
			FullName       string `json:"full_name"`
			EducationLevel string `json:"education_level"`
			EnrollmentDate string `json:"enrollment_date"`
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Неверный формат данных", http.StatusBadRequest)
			return
		}

		// Парсим UUID и дату
		facultyID, err := uuid.Parse(req.FacultyID)
		if err != nil {
			http.Error(w, "Неверный UUID факультета", http.StatusBadRequest)
			return
		}

		enrollmentDate, err := time.Parse("2006", req.EnrollmentDate)
		if err != nil {
			http.Error(w, "Неверный формат даты", http.StatusBadRequest)
			return
		}

		// Вызов функции для создания студента
		if err := CreateStudent(conn, facultyID, req.TicketNumber, req.FullName, req.EducationLevel, enrollmentDate); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, "Студент '%s' успешно создан\n", req.FullName)
	}
}

func UpdateStudent(conn *pgxpool.Conn, student Student) error {
	// Проверяем, существует ли студент
	exists, err := StudentExists(conn, student.StudentID)
	if err != nil {
		return fmt.Errorf("ошибка при проверке существования студента: %w", err)
	}
	if !exists {
		return fmt.Errorf("студент с ID %s не найден", student.StudentID)
	}

	// Проверяем, является ли студент архивным
	var isArchived bool
	err = conn.QueryRow(
		context.Background(),
		`SELECT is_archived FROM student WHERE student_id = $1`,
		student.StudentID,
	).Scan(&isArchived)
	if err != nil {
		return fmt.Errorf("ошибка при проверке архивности студента: %w", err)
	}
	if isArchived {
		return fmt.Errorf("нельзя изменять данные архивного студента")
	}

	// Начинаем транзакцию
	tx, err := conn.Begin(context.Background())
	if err != nil {
		return fmt.Errorf("ошибка при начале транзакции: %v", err)
	}
	defer tx.Rollback(context.Background()) // откат, если не выполнится commit

	// Преобразуем объект Student в JSON
	studentJSON, err := json.MarshalIndent(student, "", "  ") // Используем MarshalIndent для красивого вывода с отступами
	if err != nil {
		log.Fatalf("Ошибка при преобразовании в JSON: %v", err)
	}

	// Выводим JSON в консоль
	fmt.Println(string(studentJSON))

	// Формируем запрос для обновления студента в таблице "students"
	query := `
        UPDATE student
        SET
            faculty_id = $2,
            department_id = $3,
            ticket_number = $4,
            full_name = $5,
            enrollment_date = $6,
            education_level = $7,
            graduation_date = $8,
            completion_status = $9,
            is_archived = $10,
            updated_at = $11
        WHERE student_id = $1`
	_, err = tx.Exec(context.Background(), query,
		student.StudentID,
		student.FacultyID,
		student.DepartmentID,
		student.TicketNumber,
		student.FullName,
		student.EnrollmentDate,
		student.EducationLevel,
		student.GraduationDate,
		student.CompletionStatus,
		student.IsArchived,
		time.Now(),
	)
	if err != nil {
		return fmt.Errorf("ошибка при обновлении студента: %v", err)
	}

	// Если нужно обновить таблицу "coursework", добавляем запрос
	queryCoursework := `
    INSERT INTO coursework (coursework_id, student_id, coursework_title, coursework_grade, supervisor_id)
    VALUES (COALESCE($1, gen_random_uuid()), $1, $2, $3, $4)
    ON CONFLICT (student_id) DO UPDATE
    SET
        coursework_title = EXCLUDED.coursework_title,
        coursework_grade = EXCLUDED.coursework_grade,
        supervisor_id = EXCLUDED.supervisor_id`

	_, err = tx.Exec(context.Background(), queryCoursework,
		student.StudentID,
		student.CourseworkTitle,
		student.CourseworkGrade,
		student.CourseSupervisor,
	)

	if err != nil {
		return fmt.Errorf("ошибка при обновлении данных в coursework: %v", err)
	}

	// Обновление таблицы "diploma", переносим поля "diploma_title" и "diploma_grade"
	queryDiploma := `
        INSERT INTO diploma (diploma_id, student_id, diploma_title, diploma_grade, supervisor_id)
        VALUES (COALESCE($1, gen_random_uuid()), $1, $2, $3, $4)
        ON CONFLICT (student_id) DO UPDATE
        SET
        diploma_title = EXCLUDED.diploma_title,
        diploma_grade = EXCLUDED.diploma_grade,
        supervisor_id = EXCLUDED.supervisor_id`

	_, err = tx.Exec(context.Background(), queryDiploma,
		student.StudentID,
		student.DiplomaTitle, // Переносим сюда дипломный титул
		student.DiplomaGrade, // Переносим сюда дипломную оценку
		student.DiplomaSupervisor,
	)

	if err != nil {
		return fmt.Errorf("ошибка при обновлении данных в diploma: %v", err)
	}

	// Подтверждаем транзакцию
	if err := tx.Commit(context.Background()); err != nil {
		return fmt.Errorf("ошибка при коммите транзакции: %v", err)
	}

	return nil
}

func UpdateStudentHandler(connPool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := connPool.Acquire(context.Background())
		if err != nil {
			log.Fatalf("Ошибка при получении соединения из пула: %v\n", err)
		}
		defer conn.Release()

		body, err := ioutil.ReadAll(r.Body)

		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		// Создаем экземпляр структуры Student для декодирования
		var student Student

		// Декодируем JSON в структуру
		err = json.Unmarshal(body, &student)
		if err != nil {
			log.Printf("Ошибка при разборе JSON: %v\n", err)
			http.Error(w, fmt.Sprintf("Failed to parse JSON: %v", err), http.StatusBadRequest)
			return
		}

		// Вызываем функцию обновления данных в БД
		err = UpdateStudent(conn, student)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Успешный ответ
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, "Студент успешно обновлён")
	}
}

func DeleteStudent(conn *pgxpool.Conn, studentID uuid.UUID) error {
	// Проверяем, существует ли студент
	exists, err := StudentExists(conn, studentID)
	if err != nil {
		return fmt.Errorf("ошибка проверки существования студента: %v", err)
	}
	if !exists {
		return fmt.Errorf("студент с ID '%s' не найден", studentID)
	}

	// Удаляем запись из базы данных
	query := `DELETE FROM student WHERE student_id = $1`
	_, err = conn.Exec(context.Background(), query, studentID)
	if err != nil {
		return fmt.Errorf("ошибка удаления студента: %v", err)
	}

	return nil
}

func DeleteStudentHandler(connPool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := connPool.Acquire(context.Background())
		if err != nil {
			log.Fatalf("Ошибка при получении соединения из пула: %v\n", err)
		}
		defer conn.Release()

		// Разбираем ID студента из маршрута
		vars := mux.Vars(r)
		studentIDStr, ok := vars["id"]
		if !ok {
			http.Error(w, "ID студента не предоставлен", http.StatusBadRequest)
			return
		}

		// Конвертируем ID из строки в UUID
		studentID, err := uuid.Parse(studentIDStr)
		if err != nil {
			http.Error(w, "Некорректный формат ID студента", http.StatusBadRequest)
			return
		}

		// Удаляем студента через функцию взаимодействия с базой данных
		err = DeleteStudent(conn, studentID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Ошибка при удалении студента: %v", err), http.StatusInternalServerError)
			return
		}

		// Отправляем успешный ответ
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Студент с ID %s успешно удален", studentID)
	}
}

func ArchiveStudent(conn *pgxpool.Conn, studentID uuid.UUID) error {
	// Проверяем, существует ли студент
	exists, err := StudentExists(conn, studentID)
	if err != nil {
		return fmt.Errorf("ошибка проверки существования студента: %v", err)
	}
	if !exists {
		return fmt.Errorf("студент с ID '%s' не найден", studentID)
	}

	// Проверяем, завершил ли студент обучение
	query := `SELECT completion_status, graduation_date FROM student WHERE student_id = $1`
	var completionStatus *bool
	var graduationDate *time.Time
	err = conn.QueryRow(context.Background(), query, studentID).Scan(&completionStatus, &graduationDate)
	if err != nil {
		return fmt.Errorf("ошибка получения данных о студенте: %v", err)
	}

	if completionStatus == nil || *completionStatus == false {
		return fmt.Errorf("студент не завершил обучение, архивация невозможна")
	}

	// Архивируем студента, обновляем флаг is_archived
	updateQuery := `UPDATE student SET is_archived = true, updated_at = $2 WHERE student_id = $1`
	_, err = conn.Exec(context.Background(), updateQuery, studentID, time.Now())
	if err != nil {
		return fmt.Errorf("ошибка архивации студента: %v", err)
	}

	return nil
}

func ArchiveStudentHandler(conn *pgxpool.Conn) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Извлекаем ID студента из маршрута
		vars := mux.Vars(r)
		studentIDStr, ok := vars["id"]
		if !ok {
			http.Error(w, "ID студента не предоставлен", http.StatusBadRequest)
			return
		}

		// Конвертируем ID из строки в UUID
		studentID, err := uuid.Parse(studentIDStr)
		if err != nil {
			http.Error(w, "Некорректный формат ID студента", http.StatusBadRequest)
			return
		}

		// Архивируем студента через функцию взаимодействия с базой данных
		err = ArchiveStudent(conn, studentID)
		if err != nil {
			http.Error(w, fmt.Sprintf("Ошибка при архивации студента: %v", err), http.StatusInternalServerError)
			return
		}

		// Успешный ответ
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Студент с ID %s успешно архивирован", studentID)
	}
}

func GetAllStudentsHandler(connPool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		conn, err := connPool.Acquire(context.Background())
		if err != nil {
			log.Fatalf("Ошибка при получении соединения из пула: %v\n", err)
		}
		defer conn.Release()

		ctx := context.Background()
		// SQL-запрос
		query := `
        SELECT
            s.student_id,
            f.faculty_id,
            s.ticket_number,
            s.full_name,
            s.education_level,
            f.faculty_name,
            d.department_id,
            d.department_name,
            s.is_archived
        FROM student s
        LEFT JOIN faculty f ON s.faculty_id = f.faculty_id
        LEFT JOIN departments d ON s.department_id = d.department_id;
    `

		rows, err := conn.Query(ctx, query)
		if err != nil {
			http.Error(w, "Failed to fetch students", http.StatusInternalServerError)
			log.Println("Query error:", err)
			return
		}
		defer rows.Close()

		// Считываем данные из запроса
		var students []Student
		for rows.Next() {
			var student Student
			err := rows.Scan(
				&student.StudentID,
				&student.FacultyID,
				&student.TicketNumber,
				&student.FullName,
				&student.EducationLevel,
				&student.FacultyName,
				&student.DepartmentID,
				&student.DepartmentName,
				&student.IsArchived,
			)
			if err != nil {
				http.Error(w, "Error scanning rows", http.StatusInternalServerError)
				log.Println("Row scan error:", err)
				return
			}

			students = append(students, student)
		}

		// Проверяем ошибки после обработки rows
		if err := rows.Err(); err != nil {
			http.Error(w, "Error reading rows", http.StatusInternalServerError)
			log.Println("Rows error:", err)
			return
		}

		// Устанавливаем заголовок и отправляем JSON-ответ
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(students)
	}
}
