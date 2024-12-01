package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	pgx "github.com/jackc/pgx/v5"
)

// Структура для обработки ответа о студенте
type Student struct {
	StudentID        uuid.UUID `json:"student_id"`
	FacultyID        uuid.UUID `json:"faculty_id"`
	DepartmentID     uuid.UUID `json:"department_id"`
	TicketNumber     string    `json:"ticket_number"`
	FullName         string    `json:"full_name"`
	EnrollmentDate   string    `json:"enrollment_date"`
	GraduationDate   *string   `json:"graduation_date,omitempty"`
	CompletionStatus *bool     `json:"completion_status,omitempty"`
	IsArchived       bool      `json:"is_archived"`
	CreatedAt        string    `json:"created_at"`
	UpdatedAt        string    `json:"updated_at"`
}

// Получить информацию о студенте
func GetStudent(conn *pgx.Conn) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		studentID, err := uuid.Parse(vars["id"])
		if err != nil {
			http.Error(w, "Некорректный ID студента", http.StatusBadRequest)
			return
		}

		// Запрос в базу данных
		var student Student
		query := `
			SELECT student_id, faculty_id, department_id, ticket_number, full_name,
				enrollment_date, graduation_date, completion_status, is_archived, created_at, updated_at
			FROM student
			WHERE student_id = $1
		`
		row := conn.QueryRow(context.Background(), query, studentID)

		var enrollmentDate, createdAt, updatedAt time.Time
		var graduationDate *time.Time

		err = row.Scan(
			&student.StudentID, &student.FacultyID, &student.DepartmentID, &student.TicketNumber, &student.FullName,
			&enrollmentDate, &graduationDate, &student.CompletionStatus, &student.IsArchived, &createdAt, &updatedAt,
		)
		if err != nil {
			if err == pgx.ErrNoRows {
				http.Error(w, "Студент не найден", http.StatusNotFound)
				return
			}
			http.Error(w, "Ошибка базы данных: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Преобразование дат
		student.EnrollmentDate = enrollmentDate.Format("2006-01-02")
		student.CreatedAt = createdAt.Format(time.RFC3339)
		student.UpdatedAt = updatedAt.Format(time.RFC3339)
		if graduationDate != nil {
			formattedGraduationDate := graduationDate.Format("2006-01-02")
			student.GraduationDate = &formattedGraduationDate
		}

		// Отправляем ответ в формате JSON
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(student)
	}
}

type CreateStudentRequest struct {
	FacultyID      string `json:"FacultyID"`
	DepartmentID   string `json:"DepartmentID"`
	TicketNumber   string `json:"TicketNumber"`
	FullName       string `json:"FullName"`
	EnrollmentDate string `json:"EnrollmentDate"`
}

func CreateStudent(conn *pgx.Conn) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Проверяем метод запроса
		if r.Method != http.MethodPost {
			http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
			return
		}

		// Парсим тело запроса
		var req CreateStudentRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Некорректный JSON: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Проверяем обязательные поля
		if req.FacultyID == "" || req.DepartmentID == "" || req.TicketNumber == "" || req.FullName == "" || req.EnrollmentDate == "" {
			http.Error(w, "Все поля обязательны для заполнения", http.StatusBadRequest)
			return
		}

		// Парсим UUID
		facultyID, err := uuid.Parse(req.FacultyID)
		if err != nil {
			http.Error(w, "Некорректный UUID для faculty_id: "+err.Error(), http.StatusBadRequest)
			return
		}

		departmentID, err := uuid.Parse(req.DepartmentID)
		if err != nil {
			http.Error(w, "Некорректный UUID для department_id: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Парсим дату
		enrollmentDate, err := time.Parse("2006-01-02", req.EnrollmentDate)
		if err != nil {
			http.Error(w, "Некорректный формат даты (используйте YYYY-MM-DD): "+err.Error(), http.StatusBadRequest)
			return
		}

		// Проверяем, существует ли студент с таким номером студенческого
		query := `SELECT 1 FROM student WHERE ticket_number = $1`
		row := conn.QueryRow(context.Background(), query, req.TicketNumber)

		var exists int
		err = row.Scan(&exists)
		if err == nil {
			http.Error(w, "Студент с таким номером студенческого уже существует", http.StatusConflict)
			return
		}

		// Добавляем студента в базу данных
		insertQuery := `INSERT INTO student (student_id, faculty_id, department_id, ticket_number, full_name, enrollment_date, is_archived, created_at, updated_at)
						VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

		_, err = conn.Exec(context.Background(), insertQuery, uuid.New(), facultyID, departmentID, req.TicketNumber, req.FullName,
			enrollmentDate, false, time.Now(), time.Now())

		if err != nil {
			log.Printf("Ошибка при добавлении студента: %v\n", err)
			http.Error(w, "Ошибка при добавлении студента: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Успешный ответ
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, "Студент '%s' успешно добавлен\n", req.FullName)
	}
}
