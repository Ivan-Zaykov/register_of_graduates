package main

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"log"
	"net/http"
	"register_of_graduates/api/controller"
	"time"
)

func searchStudentByUUID(conn *pgx.Conn, studentID uuid.UUID) {
	//Создаём SQL запрос в нашу бд
	query := `SELECT * FROM student WHERE student_id = $1 LIMIT 1;`
	rows, err := conn.Query(context.Background(), query, studentID)
	if err != nil {
		log.Fatal("Error searching student by UUID:", err)
	}
	defer rows.Close()

	//Вывод информации в консоль, для проверки работоспособности
	for rows.Next() {
		var studentID, facultyID, departmentID, ticketNumber, fullName sql.NullString
		var enrollmentDate, graduationDate sql.NullTime
		var completionStatus, isArchived sql.NullString
		var createAt, updateAt sql.NullTime
		err := rows.Scan(&studentID, &facultyID, &departmentID, &ticketNumber, &fullName, &enrollmentDate,
			&graduationDate, &completionStatus, &isArchived, &createAt, &updateAt)
		if err != nil {
			log.Fatalf("Ошибка сканирования строки: %v\n", err)
		}
		fmt.Println("Search Student by UUID")
		fmt.Printf(
			"| %-36s | %-20s | %-20s | %-10s | %-20s | %-10s | %-10s | %-10s | %-10s | %-10s | %-10s |\n",
			studentID.String, facultyID.String, departmentID.String, ticketNumber.String, fullName.String,
			enrollmentDate.Time.Format("2006-01-02"), // Форматирование даты
			graduationDate.Time.Format("2006-01-02"),
			completionStatus.String, isArchived.String,
			createAt.Time.Format("2006-01-02 15:04:05"), // Форматирование даты и времени
			updateAt.Time.Format("2006-01-02 15:04:05"),
		)
	}
	return
}

func createStudent(conn *pgx.Conn, facultyID uuid.UUID, departmentID uuid.UUID, ticketNumber string, fullName string,
	enrollmentDate time.Time) {
	query := `SELECT * FROM student WHERE ticket_number = $1;`

	rows, err := conn.Query(context.Background(), query, ticketNumber)
	if err != nil {
		log.Fatal("Error creating student:", err)
	}
	defer rows.Close()

	if rows.Next() {
		fmt.Println("Ошибка: студент с таким номером студенческого существует")
	} else {
		query1 := `INSERT INTO student (student_id, faculty_id, department_id, ticket_number, full_name, enrollment_date,
		is_archived, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

		_, err = conn.Exec(context.Background(), query1, uuid.New(), facultyID, departmentID, ticketNumber, fullName,
			enrollmentDate, "false", time.Now(), time.Now())
		if err != nil {
			log.Fatalf("Ошибка при добавлении студента: %v\n", err)
		}
		fmt.Printf("Студент '%s' добавлен успешно.\n", fullName)
	}
	return
}

func deleteStudent(conn *pgx.Conn, studentID uuid.UUID) {
	query := `SELECT is_archived FROM student WHERE student_id = $1;`

	var isArchived bool

	err := conn.QueryRow(context.Background(), query, studentID).Scan(&isArchived)
	if err != nil {
		log.Fatal("Error deleting student:", err)
	}
	if isArchived {
		fmt.Println("Студент заархивирован, информацию о нём удалить нельзя")
	} else {
		query1 := `DELETE FROM coursework WHERE student_id = $1;`

		_, err := conn.Exec(context.Background(), query1, studentID)
		if err != nil {
			log.Fatal("Error deleting coursework:", err)
		}

		query1 = `DELETE FROM diploma WHERE student_id = $1;`

		_, err = conn.Exec(context.Background(), query1, studentID)
		if err != nil {
			log.Fatal("Error deleting diploma:", err)
		}

		query1 = `DELETE FROM student WHERE student_id = $1;`

		_, err = conn.Exec(context.Background(), query1, studentID)
		if err != nil {
			log.Fatal("Error deleting student:", err)
		}

		fmt.Println("Студент удалён")
	}
	return
}

func updateStudent(conn *pgx.Conn, studentID uuid.UUID, newFacultyID *uuid.UUID, newDepartmentID *uuid.UUID,
	newFullName *string, newEnrollmentDate *time.Time, newGraduationDate *time.Time, newCompletionStatus *bool,
) error {
	// Шаг 1. Проверяем, существует ли студент с таким ID
	var isArchived bool
	queryCheck := `SELECT is_archived FROM student WHERE student_id = $1`

	err := conn.QueryRow(context.Background(), queryCheck, studentID).Scan(&isArchived)
	if err != nil {
		if err == pgx.ErrNoRows {
			return fmt.Errorf("студент с ID %s не найден", studentID)
		}
		return fmt.Errorf("ошибка проверки существования студента: %v", err)
	}

	// Шаг 2. Проверяем, что запись не архивная
	if isArchived {
		return fmt.Errorf("запись архивная, изменения недопустимы")
	}

	// Шаг 3. Формируем динамический запрос для обновления
	queryUpdate := `UPDATE student SET`
	args := []interface{}{}
	argCounter := 1

	if newFacultyID != nil {
		queryUpdate += fmt.Sprintf(" faculty_id = $%d,", argCounter)
		args = append(args, *newFacultyID)
		argCounter++
	}
	if newDepartmentID != nil {
		queryUpdate += fmt.Sprintf(" department_id = $%d,", argCounter)
		args = append(args, *newDepartmentID)
		argCounter++
	}
	if newFullName != nil {
		queryUpdate += fmt.Sprintf(" full_name = $%d,", argCounter)
		args = append(args, *newFullName)
		argCounter++
	}
	if newEnrollmentDate != nil {
		queryUpdate += fmt.Sprintf(" enrollment_date = $%d,", argCounter)
		args = append(args, *newEnrollmentDate)
		argCounter++
	}
	if newGraduationDate != nil {
		queryUpdate += fmt.Sprintf(" graduation_date = $%d,", argCounter)
		args = append(args, *newGraduationDate)
		argCounter++
	}
	if newCompletionStatus != nil {
		queryUpdate += fmt.Sprintf(" completion_status = $%d,", argCounter)
		args = append(args, *newCompletionStatus)
		argCounter++
	}

	// Удаляем лишнюю запятую и добавляем WHERE
	queryUpdate = queryUpdate[:len(queryUpdate)-1] + fmt.Sprintf(" WHERE student_id = $%d", argCounter)
	args = append(args, studentID)

	// Выполняем обновление
	_, err = conn.Exec(context.Background(), queryUpdate, args...)
	if err != nil {
		return fmt.Errorf("ошибка обновления студента: %v", err)
	}

	fmt.Println("Данные студента обновлены успешно.")
	return nil
}

func archiveStudent(conn *pgx.Conn, studentID uuid.UUID) error {
	// Шаг 1: Проверяем существование записи и получаем необходимые данные
	var graduationDate *time.Time
	var completionStatus *bool
	query := `
		SELECT graduation_date, completion_status 
		FROM student 
		WHERE student_id = $1
	`

	err := conn.QueryRow(context.Background(), query, studentID).Scan(&graduationDate, &completionStatus)
	if err != nil {
		if err == pgx.ErrNoRows {
			return fmt.Errorf("студент с ID %s не найден", studentID)
		}
		return fmt.Errorf("ошибка при поиске студента: %v", err)
	}

	// Шаг 2: Проверяем, завершено ли обучение
	if graduationDate == nil || completionStatus == nil || !*completionStatus {
		return fmt.Errorf("архивация невозможна: студент не завершил обучение")
	}

	// Шаг 3: Устанавливаем флаг архивности
	queryUpdate := `
		UPDATE student 
		SET is_archived = true, updated_at = $2 
		WHERE student_id = $1
	`

	_, err = conn.Exec(context.Background(), queryUpdate, studentID, time.Now())
	if err != nil {
		return fmt.Errorf("ошибка при архивации студента: %v", err)
	}

	fmt.Printf("Студент с ID %s успешно заархивирован.\n", studentID)
	return nil
}

func main() {
	conn, err := pgx.Connect(context.Background(), "postgres://vlad:1234@localhost:5432/school-project")
	if err != nil {
		log.Fatalf("Не удалось подключиться к базе данных: %v\n", err)
	}
	defer conn.Close(context.Background())
	
	// Создание маршрутизатора
	r := mux.NewRouter()

	// Подключение контроллеров
	r.HandleFunc("/students/{id}", controller.GetStudentHandler(conn)).Methods("GET")

	// Запуск сервера
	port := 8080
	fmt.Printf("Сервер запущен на порту %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), r))
}
