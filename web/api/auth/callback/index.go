package handler

import (
	"context"
	"fmt"
	"habits-app-go/api/_pkg/firebase"
	"habits-app-go/api/_pkg/lib"
	"habits-app-go/api/_pkg/models"
	"net/http"
	"time"

	"github.com/markbates/goth/gothic"
)

type Key string

func Callback(w http.ResponseWriter, r *http.Request) {

	lib.StartGoth()
	fireApp := firebase.New()
	defer fireApp.Store.Close()

	provider := r.URL.Query().Get("provider")
	r = r.WithContext(context.WithValue(context.Background(), Key("provider"), provider))

	gothUser, err := gothic.CompleteUserAuth(w, r)
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}

	user, err := fireApp.GetUserByEmail(gothUser.Email)
	if err != nil {
		user, err = fireApp.CreateUser(&gothUser)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	_, err = fireApp.GetAccount(user.Id, provider)
	if err != nil {
		account := &models.Account{
			UserId:   user.Id,
			Provider: provider,
		}
		err = fireApp.CreateAccount(user.Id, account)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	token, err := lib.CreateToken(user.Id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   token,
		Expires: time.Now().Add(time.Hour * 24 * 7),
		Secure: true,
		Path: "/",
		HttpOnly: false,
	})
	
	http.Redirect(w, r, "/summary", http.StatusFound)

}
