package handler

import (
	"context"
	"habits-app-go/api/_pkg/lib"
	"net/http"
	"time"

	"github.com/markbates/goth/gothic"
)

type Key string

func Provider(w http.ResponseWriter, r *http.Request) {

	lib.StartGoth()

	redirectApp := r.URL.Query().Get("redirectApp")
	if redirectApp != "" {
		http.SetCookie(w, &http.Cookie{
			Name:  "redirectApp",
			Value: "true",
			Expires: time.Now().Add(5 * time.Minute),
		})}
	
	provider := r.URL.Query().Get("provider")

	ctx := context.WithValue(r.Context(), Key("provider"), provider)
	r = r.WithContext(ctx)

	gothic.BeginAuthHandler(w, r)
}
