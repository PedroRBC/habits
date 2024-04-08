package lib

import (
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

func ProtectRoute(w http.ResponseWriter, r *http.Request) (*jwt.Token, error) {
	w.Header().Set("Content-Type", "application/json")
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Missing authorization header")
		return nil, fmt.Errorf("missing authorization header")
	}
	tokenString = tokenString[len("Bearer "):]

	token, err := ParseToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Invalid token")
		return nil, fmt.Errorf("invalid token")
	}

	return token, nil
}
