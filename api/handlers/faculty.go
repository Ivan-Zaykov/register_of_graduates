package handlers

import (
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"log"
	"net/http"
)

type Faculty struct {
	FacultyId         uuid.UUID `json:"faculty_id"`
	FacultyName       string    `json:"faculty_name"`
	FacultyDean       string    `json:"faculty_dean"`
	FacultySubstitute string    `json:"faculty_substitute"`
}

func GetAllFacultyHandler(conn *pgx.Conn) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()
		// SQL-запрос
		query := `
        SELECT
            faculty_id,
            faculty_name,
            faculty_dean,
            faculty_substitute
        FROM faculty
    `

		rows, err := conn.Query(ctx, query)
		if err != nil {
			http.Error(w, "Failed to fetch faculty", http.StatusInternalServerError)
			log.Println("Query error:", err)
			return
		}
		defer rows.Close()

		// Считываем данные из запроса
		var faculties []Faculty
		for rows.Next() {
			var faculty Faculty
			err := rows.Scan(
				&faculty.FacultyId,
				&faculty.FacultyName,
				&faculty.FacultyDean,
				&faculty.FacultySubstitute,
			)
			if err != nil {
				http.Error(w, "Error scanning rows", http.StatusInternalServerError)
				log.Println("Row scan error:", err)
				return
			}
			faculties = append(faculties, faculty)
		}

		// Проверяем ошибки после обработки rows
		if err := rows.Err(); err != nil {
			http.Error(w, "Error reading rows", http.StatusInternalServerError)
			log.Println("Rows error:", err)
			return
		}

		// Устанавливаем заголовок и отправляем JSON-ответ
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(faculties)
	}
}
