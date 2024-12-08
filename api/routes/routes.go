package routes

import (
	"api/handlers"
	"log"
	"net/http"
	"os"

	logHandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	pgx "github.com/jackc/pgx/v5"
)

func ConfigureRouter(conn *pgx.Conn) {
	r := mux.NewRouter()
	r.HandleFunc("/api/student/{id}", handlers.GetStudentHandler(conn)).Methods(http.MethodGet)
	r.HandleFunc("/api/student", handlers.CreateStudentHandler(conn)).Methods(http.MethodPost)
	r.HandleFunc("/api/student/{id}", handlers.UpdateStudentHandler(conn)).Methods(http.MethodPut)
	r.HandleFunc("/api/student/{id}", handlers.DeleteStudentHandler(conn)).Methods(http.MethodDelete)
	//r.HandleFunc("/api/students/archive", ArchiveStudentHandler(conn)).Methods(http.MethodPost)

	log.Print("Listening 5000")
	log.Fatal(http.ListenAndServe(":5000", logHandlers.LoggingHandler(os.Stdout, r)))
}
