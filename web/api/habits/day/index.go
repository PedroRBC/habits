package handler

import (
	"encoding/json"
	"habits-app-go/api/_pkg/firebase"
	"habits-app-go/api/_pkg/lib"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func Day(w http.ResponseWriter, r *http.Request) {
	err := lib.SetMethod(w,r, "GET")
	if err != nil {
		return
	}

	token, err := lib.ProtectRoute(w, r)
	if err != nil {
		return
	}

	dateString := r.URL.Query().Get("date")
	if dateString == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Missing date parameter",
		})
		return
	}

	fireApp := firebase.New()
	defer fireApp.Store.Close()
	
	userId := token.Claims.(jwt.MapClaims)["userId"].(string)

	dayHabits, err := fireApp.GetDayHabits(userId, dateString)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Habits not found",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dayHabits)
}
