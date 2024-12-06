package main

import (
	"api/controller"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	pgx "github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbHost := os.Getenv("POSTGRES_HOST")
	dbPort := os.Getenv("POSTGRES_PORT")
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	conn, err := pgx.Connect(context.Background(), dsn)
	if err != nil {
		log.Fatalf("Не удалось подключиться к базе данных: %v\n", err)
	}
	defer conn.Close(context.Background())

	fmt.Println("Успешное подключение к базе данных")

	log.Print("Listening 5000")

	r := mux.NewRouter()
	r.HandleFunc("/api/student/{id}", controller.GetStudent(conn))
	r.HandleFunc("/api/student", controller.CreateStudent(conn)).Methods("POST")
	r.HandleFunc("/api/student", controller.UpdateStudent(conn)).Methods("PUT")
	//r.HandleFunc("/api/students", UpdateStudentHandler(conn)).Methods(http.MethodPut)

	log.Fatal(http.ListenAndServe(":5000", handlers.LoggingHandler(os.Stdout, r)))
}
