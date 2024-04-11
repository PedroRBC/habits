package firebase

import (
	"context"
	"fmt"
	"habits-app-go/api/_pkg/models"
	"log"
	"os"

	store "cloud.google.com/go/firestore"
	app "firebase.google.com/go"
	"github.com/golang-module/carbon/v2"
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
	doc, err := f.Store.Collection("users").Where("email", "==", email).Documents(ctx).Next()
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

/* GetSummary retrieves a summary of a user's habits from Firestore */
func (f *fireBase) GetSummary(UserId string) ([]*models.Summary, error) {
	
	markedDates, err := f.GetMarkedDates(UserId)
	if err != nil {
		return nil, err
	}

	Summary := []*models.Summary{}
	for _, markedDate := range markedDates {
		summary := models.Summary{
			Id: markedDate.Id,
			Date: markedDate.Date,
			Amount: len(markedDate.Amount),
			Completed: len(markedDate.Completed),
		}
		Summary = append(Summary, &summary)
	}

	return Summary, nil
}

/* GetMarkedDates retrieves a list of a user's habits from Firestore */
func (f *fireBase) GetMarkedDates(UserId string) ([]*models.MarkedDate, error) {
	markedDates, err := f.Store.Collection("users").Doc(UserId).Collection("marked_dates").Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}
	var MarkedDates []*models.MarkedDate
	for _, markedDate := range markedDates {
		var m models.MarkedDate
		markedDate.DataTo(&m)
		m.Id = markedDate.Ref.ID
		MarkedDates = append(MarkedDates, &m)
	}
	
	return MarkedDates, nil
}

/* GetHabits retrieves a list of a user's habits from Firestore */
func (f *fireBase) GetHabits(UserId string) ([]*models.Habit, error) {
	habits, err := f.Store.Collection("users").Doc(UserId).Collection("habits").Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}
	var Habits []*models.Habit
	for _, habit := range habits {
		var h models.Habit
		habit.DataTo(&h)
		h.Id = habit.Ref.ID
		Habits = append(Habits, &h)
	}

	return Habits, nil
}

type DayHabitsResponse struct {
	PossibleHabits []*models.Habit `json:"possibleHabits"`
	CompletedHabits []string `json:"completedHabits"`
}

/* GetDayPossibleHabits retrieves a list of a user's habits from Firestore */
func (f *fireBase) GetDayPossibleHabits(UserId string, date *carbon.Carbon) ([]*models.Habit, error) {

	possibleHabitsSnap, err := f.Store.Collection("users").Doc(UserId).Collection("habits").Where("created_at", "<=", date.StdTime()).Where("avaliable_days", "array-contains", date.DayOfWeek()).Documents(ctx).GetAll()
	if err != nil {
		return nil, err
	}

	possibleHabits := []*models.Habit{}
	for _, habit := range possibleHabitsSnap {
		var h models.Habit
		habit.DataTo(&h)
		h.Id = habit.Ref.ID
		possibleHabits = append(possibleHabits, &h)
	}

	return possibleHabits, nil
}

/* GetDay Habits and Completed Habits for a specific day */
func (f *fireBase) GetDayHabits(UserId string, dateString string) (DayHabitsResponse, error) {
	date := carbon.SetTimezone(carbon.SaoPaulo).Parse(dateString).AddHour()
	
	possibleHabits, err := f.GetDayPossibleHabits(UserId, &date)
	if err != nil {
		return DayHabitsResponse{}, err
	}

	markedDateSnap, err := f.Store.Collection("users").Doc(UserId).Collection("marked_dates").Doc(date.ToDateString()).Get(ctx)
	if err != nil {
		return DayHabitsResponse{
			PossibleHabits: possibleHabits,
			CompletedHabits: []string{},
		}, nil
	}

	completedHabits := []string{}
	markedDate := models.MarkedDate{}
	markedDateSnap.DataTo(&markedDate)
	completedHabits = append(completedHabits, markedDate.Completed...)

	return DayHabitsResponse{
		PossibleHabits: possibleHabits,
		CompletedHabits: completedHabits,
	}, nil

}

/* CreateHabit creates a habit for a User in Firestore */
func (f *fireBase) CreateHabit(UserId string, Habit models.CreateHabitRequest) (error) {


	habit := models.Habit{
		Title: Habit.Title,
		AvaliableDays: Habit.WeekDays,
		CreatedAt: carbon.SetTimezone(carbon.SaoPaulo).Now().StartOfDay().StdTime(),
	}

	habitRef, _, err := f.Store.Collection("users").Doc(UserId).Collection("habits").Add(ctx, habit)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("failed to create habit in Firestore")
	}
	today := carbon.SetTimezone(carbon.SaoPaulo).Now().StartOfDay().AddHour()

	markedDateRef := f.Store.Collection("users").Doc(UserId).Collection("marked_dates").Doc(today.ToDateString())
	markedDateSnap, err := markedDateRef.Get(ctx)
	if err != nil {
		return nil
	} else {
		markedDate := models.MarkedDate{
			Completed: []string{},
			Amount: []string{},
		}
		markedDateSnap.DataTo(&markedDate)
		
		markedDate.Amount = append(markedDate.Amount, habitRef.ID)

		_, err = markedDateRef.Set(ctx, markedDate)
		if err != nil {
			return err
		}
	}

	return nil
}

/* ToggleHabit toggles a habit for a User in Firestore */
func (f *fireBase) ToggleHabit(UserId string, HabitId string) (error) {
	today := carbon.SetTimezone(carbon.SaoPaulo).Now().StartOfDay().AddHour()

	markedDateRef := f.Store.Collection("users").Doc(UserId).Collection("marked_dates").Doc(today.ToDateString())
	markedDateSnap, err := markedDateRef.Get(ctx)
	var markedDate models.MarkedDate
	if err != nil {
		possibleHabits, err := f.GetDayPossibleHabits(UserId, &today)
		if err != nil {
			return err
		}

		amount := []string{}
		for _, habit := range possibleHabits {
			amount = append(amount, habit.Id)
		}

		markedDate = models.MarkedDate{
			Date: today.StartOfDay().StdTime(),
			Amount: amount,
			Completed: []string{HabitId},
		}
		_, err = markedDateRef.Set(ctx, markedDate)
		if err != nil {
			return err
		}
		return nil
	} else {
		markedDateSnap.DataTo(&markedDate)
		
		found := false
		for _, habit := range markedDate.Completed {
			if habit == HabitId {
				found = true
				break
			}
		}

		if found {
			newCompletedList := []string{}
			for _, habit := range markedDate.Completed {
				if habit != HabitId {
					newCompletedList = append(newCompletedList, habit)
				}
			}
			markedDate.Completed = newCompletedList
		} else {
			markedDate.Completed = append(markedDate.Completed, HabitId)
		}

		_, err = markedDateRef.Set(ctx, markedDate)
		if err != nil {
			return err
		}
	}

	return nil
}