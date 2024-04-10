package handler

import (
	"encoding/json"
	"habits-app-go/api/firebase"
	"habits-app-go/api/lib"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func Toggle(w http.ResponseWriter, r *http.Request) {
	err := lib.SetMethod(w,r, "PATCH")
	if err != nil {
		return
	}

	token, err := lib.ProtectRoute(w, r)
	if err != nil {
		return
	}

	habitId := r.URL.Query().Get("id")
	if habitId == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Missing id parameter",
		})
		return
	}

	fireApp := firebase.New()
	defer fireApp.Store.Close()
	
	userId := token.Claims.(jwt.MapClaims)["userId"].(string)

	err = fireApp.ToggleHabit(userId, habitId)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to toggle habit",
		})
		return
	}

	w.WriteHeader(http.StatusOK)
}
