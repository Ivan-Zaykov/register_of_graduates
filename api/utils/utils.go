package utils

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"time"
)

type CustomNullString struct {
	sql.NullString
}

type CustomDate struct {
	Time time.Time
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
		"2006-01-02", // Простой формат
	}
	for _, layout := range layouts {
		parsed, err := time.Parse(layout, strInput)
		if err == nil {
			c.Time = parsed // присваиваем значение в c.Time
			return nil
		}
	}
	return fmt.Errorf("не удалось распарсить дату: %s", strInput)
}

func (c CustomDate) MarshalJSON() ([]byte, error) {
	return []byte(`"` + c.Time.Format("2006-01-02") + `"`), nil
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
func (c *CustomBoolString) Scan(value interface{}) error {
	if value == nil {
		c.BoolValue = false
		c.Valid = false
		return nil
	}
	switch v := value.(type) {
	case bool:
		c.BoolValue = v
		c.Valid = true
	case string:
		// Преобразуем строку в bool, если она может быть "true" или "false"
		if v == "true" {
			c.BoolValue = true
			c.Valid = true
		} else if v == "false" {
			c.BoolValue = false
			c.Valid = true
		} else {
			return errors.New("invalid value for CustomBoolString")
		}
	default:
		return fmt.Errorf("cannot scan type %T into CustomBoolString", value)
	}
	return nil
}

func (c CustomBoolString) Value() (driver.Value, error) {
	if !c.Valid {
		return nil, nil // Возвращаем null, если значение невалидно
	}
	return c.BoolValue, nil
}

func (d *CustomDate) Scan(src any) error {
	if src == nil {
		return nil
	}
	switch v := src.(type) {
	case time.Time:
		d.Time = v // Присваиваем значение в d.Time
	case string:
		parsedDate, err := time.Parse("2006-01-02", v)
		if err != nil {
			return err
		}
		d.Time = parsedDate // Присваиваем значение в d.Time
	default:
		return fmt.Errorf("unsupported type: %T", v)
	}
	return nil
}

func (d CustomDate) Value() (driver.Value, error) {
	if d.Time.IsZero() {
		return nil, nil // Если дата "нулевая", возвращаем nil (для обработки NULL в базе данных)
	}
	// Преобразуем CustomDate в строку в формате 'YYYY-MM-DD' (тип DATE)
	return d.Time.Format("2006-01-02"), nil
}

func (n *CustomNullString) Scan(value interface{}) error {
	if value == nil {
		n.String = ""
		n.Valid = false
		return nil
	}
	n.String, n.Valid = value.(string)
	return nil
}

// Value для передачи в базу данных.
func (n CustomNullString) Value() (driver.Value, error) {
	if n.Valid && n.String != "" {
		return n.String, nil
	}
	return nil, nil // Заменяем "" на NULL
}
