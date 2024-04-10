package models

import (
	"time"
)

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

	Summary struct {
		Id 	string `json:"id"`
		Date time.Time `json:"date"`
		Amount int	`json:"amount"`
		Completed int	`json:"completed"`
	}

	Habit struct {
		Id          string `firestore:"-" json:"id"`
		AvaliableDays []int `firestore:"avaliable_days" json:"avaliableDays"`
		CreatedAt	time.Time `firestore:"created_at" json:"createdAt"`
		Title 	 string `firestore:"title" json:"title"`
	}

	MarkedDate struct {
		Id string `firestore:"-"`
		Date time.Time `firestore:"date"`
		Amount []string `firestore:"amount"`
		Completed []string `firestore:"completed"`
	}
)


type (

	CreateHabitRequest struct {
		Title string `json:"title"`
		WeekDays []int `json:"weekDays"`
	}

)