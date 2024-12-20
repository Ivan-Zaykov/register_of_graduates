package utils

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"
)

type CustomNullString struct {
	sql.NullString
}

type CustomDate struct {
	time.Time
}

type CustomBoolString struct {
	BoolValue bool
	Valid     bool
}

func (c CustomNullString) MarshalJSON() ([]byte, error) {
	if c.Valid {
		return json.Marshal(c.String)
	}
	return json.Marshal("")
}

func (c *CustomNullString) UnmarshalJSON(data []byte) error {
	var s *string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	if s != nil {
		c.String = *s
		c.Valid = true
	} else {
		c.String = ""
		c.Valid = false
	}
	return nil
}

func (c *CustomDate) UnmarshalJSON(b []byte) error {
	strInput := string(b)
	// Убираем кавычки, если они присутствуют
	strInput = strInput[1 : len(strInput)-1]
	layouts := []string{
		"2006-01-02",                // Простой формат
		"2006-01-02T15:04:05",       // Без часового пояса
		"2006-01-02T15:04:05Z07:00", // С часовым поясом
	}
	for _, layout := range layouts {
		parsed, err := time.Parse(layout, strInput)
		if err == nil {
			c.Time = parsed
			return nil
		}
	}
	return fmt.Errorf("не удалось распарсить дату: %s", strInput)
}

func (c CustomDate) MarshalJSON() ([]byte, error) {
	return []byte(`"` + c.Time.Format("2006-01-02T15:04:05Z07:00") + `"`), nil
}

func (c *CustomBoolString) UnmarshalJSON(data []byte) error {
	// Проверяем строку
	strValue := string(data)
	if strValue == "true" || strValue == "false" {
		c.BoolValue = strValue == "true"
		c.Valid = true
		return nil
	}
	var boolValue bool
	if err := json.Unmarshal(data, &boolValue); err != nil {
		return err
	}
	c.BoolValue = boolValue
	c.Valid = true
	return nil
}

func (c CustomBoolString) MarshalJSON() ([]byte, error) {
	if c.Valid {
		return json.Marshal(c.BoolValue)
	}
	return json.Marshal(nil)
}
