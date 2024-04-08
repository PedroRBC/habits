package firebase

import (
	"context"
	"fmt"
	"habits-app-go/api/models"
	"log"
	"os"

	store "cloud.google.com/go/firestore"
	app "firebase.google.com/go"
	"github.com/google/uuid"
	"github.com/markbates/goth"
	"google.golang.org/api/option"
)

type fireBase struct {
	App   *app.App
	Store *store.Client
}

var (
	ctx = context.Background()
	opt = option.WithCredentialsJSON([]byte(os.Getenv("FIREBASE_SERVICE")))
)

func New() fireBase {
	App, err := app.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("Failed to create a Firebase app: %v", err)
	}

	store, err := App.Firestore(ctx)
	if err != nil {
		log.Fatalf("Failed to create a Firestore client: %v", err)
	}

	fire := fireBase{
		App:   App,
		Store: store,
	}

	return fire
}

/* GetUserByEmail retrieves a user from Firestore by email */
func (f *fireBase) GetUserByEmail(email string) (*models.User, error) {
	doc, err := f.Store.Collection("users").Where("Email", "==", email).Documents(ctx).Next()
	if err != nil {
		return nil, err
	}

	var user models.User
	doc.DataTo(&user)

	return &user, nil
}

/* GetUser retrieves a user from Firestore by Id */
func (f *fireBase) GetUser(Id string) (*models.User, error) {
	doc, err := f.Store.Collection("users").Doc(Id).Get(ctx)
	if err != nil {
		return nil, err
	}

	var user models.User
	doc.DataTo(&user)

	return &user, nil

}

/* CreateUser creates a user in Firestore */
func (f *fireBase) CreateUser(user *goth.User) (*models.User, error) {
	Id := uuid.NewString()
	existUser, err := f.GetUserByEmail(user.Email)
	if err != nil {
		User := models.User{
			Id:        Id,
			Email:     user.Email,
			Name:      user.Name,
			AvatarUrl: user.AvatarURL,
		}
		_, err := f.Store.Collection("users").Doc(Id).Set(ctx, User)
		if err != nil {
			fmt.Println(err)
			return nil, fmt.Errorf("failed to create user in Firestore")
		}
		return &User, nil
	}

	return existUser, nil
}

/* GetAccount retrieves an account from Firestore by provider */
func (f *fireBase) GetAccount(UserId string, provider string) (*models.Account, error) {
	doc, err := f.Store.Collection("users").Doc(UserId).Collection("accounts").Doc(provider).Get(ctx)
	if err != nil {
		return nil, err
	}

	var account models.Account
	doc.DataTo(&account)

	return &account, nil
}

/* CreateAccount creates an account for a User in Firestore */
func (f *fireBase) CreateAccount(UserId string, account *models.Account) error {
	_, err := f.Store.Collection("users").Doc(UserId).Collection("accounts").Doc(account.Provider).Set(ctx, account)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to create account in Firestore")
	}
	return nil
}
