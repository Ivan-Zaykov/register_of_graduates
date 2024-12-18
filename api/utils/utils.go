package utils

import (
	"database/sql"
	"encoding/json"
)

type CustomNullString struct {
	sql.NullString
}

func (c CustomNullString) MarshalJSON() ([]byte, error) {
	if c.Valid {
		return json.Marshal(c.String)
	}
	return json.Marshal("")
}
