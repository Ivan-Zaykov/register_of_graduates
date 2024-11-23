package controller

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
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
func GetStudentHandler(conn *pgx.Conn) http.HandlerFunc {
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
