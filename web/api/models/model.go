package models

import "github.com/golang-jwt/jwt/v5"

type (
	User struct {
		Id        string `firestore:"id"`
		Email     string `firestore:"email"`
		AvatarUrl string `firestore:"avatarUrl"`
		Name      string `firestore:"name"`
	}

	Account struct {
		UserId string `firestore:"userId"`

		Code     string `firestore:"code,omitempty"`
		Provider string `firestore:"provider"`
	}

	Token struct {
		UserId string `json:"userId"`
		jwt.Claims
	}
)
