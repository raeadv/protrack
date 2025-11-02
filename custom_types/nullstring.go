package customtypes

import (
	"database/sql"
	"encoding/json"
)

type NullString struct {
	sql.NullString
}

// UnmarshalJSON implements json.Unmarshaler
func (ns *NullString) UnmarshalJSON(data []byte) error {
	var s *string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}

	if s != nil {
		ns.Valid = true
		ns.String = *s
	} else {
		ns.Valid = false
	}

	return nil
}

// MarshalJSON implements json.Marshaler
func (ns NullString) MarshalJSON() ([]byte, error) {
	if ns.Valid {
		return json.Marshal(ns.String)
	}
	return json.Marshal(nil)
}
