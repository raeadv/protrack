package database

import (
	"context"
	"database/sql"
	"fmt"
)

type DbConnection struct {
	db *sql.DB
	*Queries
}

type DbConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
}

func NewConnection(cfg DbConfig) (*DbConnection, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true",
		cfg.User,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.Database,
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DbConnection{
		db:      db,
		Queries: New(db),
	}, nil
}

// Close closes the database connection
func (c *DbConnection) Close() error {
	return c.db.Close()
}

// WithTx executes a function within a transaction
func (c *DbConnection) WithTx(ctx context.Context, fn func(*Queries) error) error {
	tx, err := c.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	q := c.Queries.WithTx(tx)
	err = fn(q)

	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return fmt.Errorf("tx err: %v, rb err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit()
}

// GetDB returns the underlying *sql.DB (if needed for advanced use)
func (c *DbConnection) GetDB() *sql.DB {
	return c.db
}
