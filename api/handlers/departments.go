package handlers

import (
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"log"
	"net/http"
)

type Department struct {
	DepartmentID     uuid.UUID `json:"department_id"`
	FacultyID        uuid.UUID `json:"faculty_id"`
	DepartmentName   string    `json:"department_name"`
	HeadOfDepartment string    `json:"head_of_department"`
}

func GetAllDepartmentHandler(conn *pgx.Conn) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()
		// SQL-запрос
		query := `
        SELECT
             department_id,
             faculty_id,
             department_name,
             head_of_department
        FROM departments
    `

		rows, err := conn.Query(ctx, query)
		if err != nil {
			http.Error(w, "Failed to fetch faculty", http.StatusInternalServerError)
			log.Println("Query error:", err)
			return
		}
		defer rows.Close()

		// Считываем данные из запроса
		var departments []Department
		for rows.Next() {
			var department Department
			err := rows.Scan(
				&department.DepartmentID,
				&department.FacultyID,
				&department.DepartmentName,
				&department.HeadOfDepartment,
			)
			if err != nil {
				http.Error(w, "Error scanning rows", http.StatusInternalServerError)
				log.Println("Row scan error:", err)
				return
			}
			departments = append(departments, department)
		}

		// Проверяем ошибки после обработки rows
		if err := rows.Err(); err != nil {
			http.Error(w, "Error reading rows", http.StatusInternalServerError)
			log.Println("Rows error:", err)
			return
		}

		// Устанавливаем заголовок и отправляем JSON-ответ
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(departments)
	}
}