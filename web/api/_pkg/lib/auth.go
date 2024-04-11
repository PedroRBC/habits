package lib

import (
	"os"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

var (
	store  = sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))
	maxAge = 86400 * 30
	// NODE_ENV because are using vercel to deploy our app
	isProd   = os.Getenv("NODE_ENV") == "production" || false
	hostname = "http://localhost:3000"
)

func init() {
	if os.Getenv("NEXT_PUBLIC_VERCEL_ENV") == "production" {
		hostname = "https://habits.pedrorbc.com"
	}

	store.MaxAge(maxAge)
	store.Options.Path = "/"
	store.Options.HttpOnly = true
	store.Options.Secure = isProd

	gothic.Store = store
}

func StartGoth() {
	googleClientId := os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret := os.Getenv("GOOGLE_CLIENT_SECRET")

	goth.UseProviders(
		google.New(googleClientId, googleClientSecret, hostname+"/api/auth/google/callback", "profile", "email"),
	)
}
