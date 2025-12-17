# Supabase Migrations

This folder contains all database migration schemas for the Supabase backend.

## Structure

- `migrations/` - Contains all SQL migration files
  - Migration files should be named with timestamps: `YYYYMMDDHHMMSS_description.sql`
  - Example: `20250101120000_initial_schema.sql`

## Usage

1. Create migration files in the `migrations/` folder
2. Apply migrations using Supabase CLI or the Supabase dashboard
3. Keep migrations version-controlled and documented

## Migration Best Practices

- Always test migrations on a development database first
- Include rollback instructions in migration comments
- One logical change per migration file
- Use descriptive names for migration files
- Never modify existing migration files - create new ones instead

