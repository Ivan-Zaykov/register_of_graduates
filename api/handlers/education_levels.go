package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type EducationLevels map[string]string

func GetEducationLevels() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Данные, которые будем возвращать
		degrees := EducationLevels{
			"bachelor":        "Бакалавр",
			"master":          "Магистр",
			"graduate_school": "Аспирант",
			"specialty":       "Специалист",
		}

		// Устанавливаем правильный тип контента
		w.Header().Set("Content-Type", "application/json")

		// Кодируем данные в JSON и отправляем в ответ
		if err := json.NewEncoder(w).Encode(degrees); err != nil {
			http.Error(w, fmt.Sprintf("unable to encode JSON: %v", err), http.StatusInternalServerError)
		}
	}
}
