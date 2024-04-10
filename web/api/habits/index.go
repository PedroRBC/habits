package handler

import (
	"encoding/json"
	"habits-app-go/api/firebase"
	"habits-app-go/api/lib"
	"habits-app-go/api/models"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func CreateHabit(w http.ResponseWriter, r *http.Request) {
	err := lib.SetMethod(w,r, "POST")
	if err != nil {
		return
	}

	token, err := lib.ProtectRoute(w, r)
	if err != nil {
		return
	}

	HabitRequest := models.CreateHabitRequest{}
	err = json.NewDecoder(r.Body).Decode(&HabitRequest)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid request body",
		})
		return
	}

	fireApp := firebase.New()
	defer fireApp.Store.Close()
	
	userId := token.Claims.(jwt.MapClaims)["userId"].(string)

	err = fireApp.CreateHabit(userId, HabitRequest)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to create habit",
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	
}
