package handler

import (
	"encoding/json"
	"habits-app-go/api/firebase"
	"habits-app-go/api/lib"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func UserInfo(w http.ResponseWriter, r *http.Request) {
	err := lib.SetMethod(w, r, "GET")
	if err != nil {
		return
	}

	token, err := lib.ProtectRoute(w, r)
	if err != nil {
		return
	}

	fireApp := firebase.New()
	defer fireApp.Store.Close()

	userId := token.Claims.(jwt.MapClaims)["userId"].(string)

	user, err := fireApp.GetUser(userId)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "User not found",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
