package customtypes

import (
	"fmt"
	"time"
)

type DateFormats struct {
	time.Time
}

func (ct *DateFormats) UnmarshalJSON(b []byte) error {
	s := string(b)
	s = s[1 : len(s)-1] // Remove quotes

	// Try multiple formats
	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04:05.999Z07:00",
		"2006-01-02",
		"2006-01-02 15:04:05",
	}

	for _, format := range formats {
		t, err := time.Parse(format, s)
		if err == nil {
			ct.Time = t
			return nil
		}
	}

	return fmt.Errorf("unable to parse time: %s", s)
}
