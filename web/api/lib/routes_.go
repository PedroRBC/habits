package lib

import (
	"fmt"
	"net/http"
)

func SetMethod(w http.ResponseWriter, r *http.Request, method string) error {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != method {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprint(w, "Method not allowed")
		return fmt.Errorf("method not allowed")
	}
	
	return nil
}
