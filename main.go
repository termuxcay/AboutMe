package main

import (
	"log"

	"project/config"
	"project/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {
	engine := html.New("./views", ".html")
	engine.Reload(true)

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Static("/static", "./static")

	setupRoutes(app)

	log.Printf("🚀 Servidor rodando em http://localhost:%s", config.Port)
	log.Fatal(app.Listen(":" + config.Port))
}

func setupRoutes(app *fiber.App) {
	app.Get("/", handlers.Home)
}
