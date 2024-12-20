package handlers

import (
	"context"
	"encoding/json"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

type ScientificSupervisor struct {
	SupervisorID string `json:"supervisor_id"`
	DepartmentID string `json:"department_id"`
	FullName     string `json:"full_name"`
}

// Обработчик для получения списка научных руководителей в формате объекта объектов
func GetScientificSupervisors(connPool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Подключаемся к базе данных
		conn, err := connPool.Acquire(context.Background())
		if err != nil {
			http.Error(w, "Ошибка при получении соединения из пула", http.StatusInternalServerError)
			log.Fatalf("Ошибка при получении соединения из пула: %v\n", err)
			return
		}
		defer conn.Release()

		// Запрос на получение всех научных руководителей
		rows, err := conn.Query(context.Background(), "SELECT supervisor_id, department_id, full_name FROM scientific_supervisor")
		if err != nil {
			http.Error(w, "Ошибка выполнения запроса", http.StatusInternalServerError)
			log.Println("Ошибка выполнения запроса:", err)
			return
		}
		defer rows.Close()

		// Объект для хранения данных
		supervisors := make(map[string]ScientificSupervisor)

		// Заполняем объект с данными
		for rows.Next() {
			var supervisor ScientificSupervisor
			if err := rows.Scan(&supervisor.SupervisorID, &supervisor.DepartmentID, &supervisor.FullName); err != nil {
				http.Error(w, "Ошибка обработки данных", http.StatusInternalServerError)
				log.Println("Ошибка обработки данных:", err)
				return
			}
			supervisors[supervisor.SupervisorID] = supervisor
		}

		// Обработка ошибок выборки
		if err := rows.Err(); err != nil {
			http.Error(w, "Ошибка обработки данных", http.StatusInternalServerError)
			log.Println("Ошибка в данных:", err)
			return
		}

		// Устанавливаем заголовки и отправляем статус 200 (OK)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Отправляем ответ в формате JSON
		if err := json.NewEncoder(w).Encode(supervisors); err != nil {
			http.Error(w, "Ошибка кодирования JSON", http.StatusInternalServerError)
			log.Println("Ошибка кодирования JSON:", err)
		}
	}
}
