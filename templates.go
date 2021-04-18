package main

import (
	"html/template"
	"io"
	"strings"

	"github.com/labstack/echo/v4"
)

type GoTemplates struct {
	templates *template.Template
}

func (g *GoTemplates) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return g.templates.ExecuteTemplate(w, name, data)
}

func prepareTemplates(e *echo.Echo) {
	t := &GoTemplates{
		templates: template.Must(
			template.ParseGlob("templates/*.html"),
		).Funcs(template.FuncMap{
			"StringsJoin": strings.Join,
		}),
	}
	e.Renderer = t
}
