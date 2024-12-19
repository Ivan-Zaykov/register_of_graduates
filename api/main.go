package main

import (
	"api/routes"
	"context"
	"fmt"
	"log"
	"os"

	pgxpool "github.com/jackc/pgx/v5/pgxpool"
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

	// Пул соединений с PostgreSQL
	connPool, err := pgxpool.New(context.Background(), dsn)
	if err != nil {
		log.Fatalf("Не удалось подключиться к базе данных: %v\n", err)
	}
	defer connPool.Close() // Закрытие пула соединений

	fmt.Println("Успешное подключение к базе данных")

	routes.ConfigureRouter(connPool)
}
