package handler

import (
	"context"
	"habits-app-go/api/_pkg/lib"
	"net/http"

	"github.com/markbates/goth/gothic"
)

type Key string

func Logout(w http.ResponseWriter, r *http.Request) {
	lib.StartGoth()
	provider := r.URL.Query().Get("provider")

	ctx := context.WithValue(r.Context(), Key("provider"), provider)
	r = r.WithContext(ctx)

	gothic.Logout(w, r)
	w.Header().Set("Location", "/")
	w.WriteHeader(http.StatusTemporaryRedirect)
}
