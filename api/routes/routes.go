package routes

import (
	"api/handlers"
	"log"
	"net/http"
	"os"

	logHandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	pgxpool "github.com/jackc/pgx/v5/pgxpool"
)

func ConfigureRouter(connPool *pgxpool.Pool) {
	r := mux.NewRouter()
	r.HandleFunc("/api/student/{id}", handlers.GetStudentHandler(connPool)).Methods(http.MethodGet)
	r.HandleFunc("/api/student", handlers.CreateStudentHandler(connPool)).Methods(http.MethodPost)
	r.HandleFunc("/api/student", handlers.UpdateStudentHandler(connPool)).Methods(http.MethodPut)
	r.HandleFunc("/api/student/{id}", handlers.DeleteStudentHandler(connPool)).Methods(http.MethodDelete)

	r.HandleFunc("/api/students", handlers.GetAllStudentsHandler(connPool)).Methods(http.MethodGet)
	//r.HandleFunc("/api/students/archive", ArchiveStudentHandler(connPool)).Methods(http.MethodPost)

	r.HandleFunc("/api/faculties", handlers.GetAllFacultyHandler(connPool)).Methods(http.MethodGet)

	r.HandleFunc("/api/departments", handlers.GetAllDepartmentHandler(connPool)).Methods(http.MethodGet)

	r.HandleFunc("/api/education_level", handlers.GetEducationLevels()).Methods(http.MethodGet)

	log.Print("Listening 5000")
	log.Fatal(http.ListenAndServe(":5000", logHandlers.LoggingHandler(os.Stdout, r)))
}
