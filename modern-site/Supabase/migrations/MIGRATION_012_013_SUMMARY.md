# Migration 012 & 013 - Autonomous Features Summary

## Overview

These migrations add database support for all autonomous operation features implemented in the AI builder:
- **012_code_versions.sql** - Version history and undo/redo
- **013_autonomous_features.sql** - Runtime error tracking and code suggestions

---

## Migration 012: Code Versions

### Purpose
Enables version history tracking for draft projects, allowing users to undo/redo changes and restore previous code versions.

### Tables Created

#### `code_versions`
Stores code snapshots for each version of a draft project.

**Columns:**
- `id` - UUID primary key
- `draft_id` - Foreign key to `draft_projects`
- `version` - Sequential version number (1, 2, 3, ...)
- `component_code` - Snapshot of component code
- `description` - Optional description of changes
- `metadata` - JSONB for file_tree, dependencies, etc.
- `created_at` - Timestamp

**Constraints:**
- Unique constraint on `(draft_id, version)` - ensures sequential versions

### Functions Created

1. **`get_latest_version(draft_uuid)`** - Returns latest version number
2. **`get_version_history(draft_uuid)`** - Returns all versions for a draft
3. **`get_version(draft_uuid, version_num)`** - Returns specific version
4. **`save_code_version(draft_uuid, code, description, metadata)`** - Saves new version (auto-increments)
5. **`restore_version(draft_uuid, version_num)`** - Restores a version (updates draft_projects)
6. **`cleanup_old_versions(draft_uuid, keep_count)`** - Deletes old versions (keeps last N)

### Indexes Created

- `idx_code_versions_draft_id` - Query versions by draft
- `idx_code_versions_draft_version_desc` - Get latest version efficiently
- `idx_code_versions_created_at` - Cleanup/analytics queries
- `idx_code_versions_metadata` - GIN index for JSONB queries

### RLS Policies

- Users can view/create/delete versions for their own drafts only

---

## Migration 013: Autonomous Features

### Purpose
Adds database support for runtime error monitoring and code quality suggestions.

### Tables Created

#### `runtime_errors`
Tracks runtime errors for monitoring and auto-fixing.

**Columns:**
- `id` - UUID primary key
- `draft_id` - Foreign key to `draft_projects`
- `user_id` - Foreign key to `user_accounts`
- `error_type` - Type: 'console', 'network', 'unhandled', 'promise'
- `error_message` - Error message
- `error_stack` - Stack trace
- `url` - URL where error occurred
- `line_number` - Line number
- `column_number` - Column number
- `user_agent` - Browser user agent
- `fixed` - Whether error has been fixed
- `fixed_at` - When error was fixed
- `auto_fixed` - Whether error was auto-fixed by AI
- `metadata` - JSONB for additional context
- `created_at` - Timestamp

#### `code_suggestions`
Tracks code quality suggestions and improvements.

**Columns:**
- `id` - UUID primary key
- `draft_id` - Foreign key to `draft_projects`
- `suggestion_type` - Type: 'improvement', 'warning', 'error', 'best-practice'
- `file_path` - File path
- `line_number` - Line number
- `column_number` - Column number
- `message` - Suggestion message
- `suggestion` - Improvement suggestion
- `priority` - Priority: 'low', 'medium', 'high'
- `category` - Category: 'performance', 'readability', 'security', 'maintainability', 'type-safety'
- `applied` - Whether suggestion was applied
- `applied_at` - When suggestion was applied
- `dismissed` - Whether suggestion was dismissed
- `dismissed_at` - When suggestion was dismissed
- `metadata` - JSONB for additional context
- `created_at` - Timestamp

### Functions Created

#### Runtime Errors:
1. **`log_runtime_error(...)`** - Logs a runtime error
2. **`mark_error_fixed(error_uuid, auto_fixed)`** - Marks error as fixed
3. **`get_error_stats(draft_uuid)`** - Returns error statistics

#### Code Suggestions:
1. **`save_code_suggestions(draft_uuid, suggestions)`** - Saves suggestions from analysis
2. **`apply_suggestion(suggestion_uuid)`** - Marks suggestion as applied

### Indexes Created

#### Runtime Errors:
- `idx_runtime_errors_draft_id` - Query errors by draft
- `idx_runtime_errors_unfixed` - Query unfixed errors
- `idx_runtime_errors_type` - Query by error type
- `idx_runtime_errors_created_at` - Analytics queries

#### Code Suggestions:
- `idx_code_suggestions_draft_id` - Query suggestions by draft
- `idx_code_suggestions_unapplied` - Query unapplied suggestions
- `idx_code_suggestions_priority` - Query by priority
- `idx_code_suggestions_category` - Query by category

### RLS Policies

- Users can view/create/update errors for their own drafts only
- Users can view/create/update suggestions for their own drafts only

---

## Integration with Code

### Version History Integration

```typescript
import { saveCodeVersion, restoreVersion, getVersionHistory } from './version-history'

// Save version after code change
await saveCodeVersion(draftId, componentCode, 'Fixed error')

// Restore version (undo)
await restoreVersion(draftId, 5)

// Get history
const history = await getVersionHistory(draftId)
```

### Runtime Error Integration

```typescript
import { logRuntimeError, markErrorFixed } from './runtime-monitor'

// Log error
await logRuntimeError(draftId, userId, 'console', error.message, error.stack)

// Mark as fixed
await markErrorFixed(errorId, true) // true = auto-fixed
```

### Code Suggestions Integration

```typescript
import { saveCodeSuggestions, applySuggestion } from './code-suggestions'

// Save suggestions from analysis
await saveCodeSuggestions(draftId, suggestionsArray)

// Apply suggestion
await applySuggestion(suggestionId)
```

---

## Usage Examples

### Version History

```sql
-- Save a new version
SELECT public.save_code_version(
  'draft-uuid-here',
  'export default function Component() { ... }',
  'Fixed syntax error',
  '{"file_tree": {...}}'::jsonb
);

-- Get version history
SELECT * FROM public.get_version_history('draft-uuid-here');

-- Restore version 5
SELECT public.restore_version('draft-uuid-here', 5);

-- Cleanup old versions (keep last 50)
SELECT public.cleanup_old_versions('draft-uuid-here', 50);
```

### Runtime Errors

```sql
-- Log an error
SELECT public.log_runtime_error(
  'draft-uuid-here',
  'user-uuid-here',
  'console',
  'Cannot read property of undefined',
  'Error: ...\n  at Component...',
  'https://example.com/preview/123',
  42,
  10,
  'Mozilla/5.0...',
  '{}'::jsonb
);

-- Get error statistics
SELECT * FROM public.get_error_stats('draft-uuid-here');

-- Mark error as fixed
SELECT public.mark_error_fixed('error-uuid-here', true);
```

### Code Suggestions

```sql
-- Save suggestions
SELECT public.save_code_suggestions(
  'draft-uuid-here',
  '[
    {
      "type": "improvement",
      "file": "src/components/LandingPage.tsx",
      "line": 42,
      "column": 10,
      "message": "Long line detected",
      "suggestion": "Consider breaking this line",
      "priority": "low",
      "category": "readability"
    }
  ]'::jsonb
);

-- Apply a suggestion
SELECT public.apply_suggestion('suggestion-uuid-here');
```

---

## Verification

After running migrations, verify:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN ('code_versions', 'runtime_errors', 'code_suggestions');

-- Check functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%version%' 
     OR routine_name LIKE '%error%'
     OR routine_name LIKE '%suggestion%';

-- Check indexes exist
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND (indexname LIKE '%code_version%' 
       OR indexname LIKE '%runtime_error%'
       OR indexname LIKE '%code_suggestion%');

-- Check RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('code_versions', 'runtime_errors', 'code_suggestions');
```

---

## Notes

- **Version History**: Automatically increments version numbers. No manual version management needed.
- **Error Tracking**: Errors are logged automatically by runtime monitor. Can be queried for analytics.
- **Code Suggestions**: Suggestions are generated by code analysis. Users can apply or dismiss them.
- **RLS Security**: All tables have RLS enabled. Users can only access their own data.
- **Performance**: Indexes optimized for common queries (latest version, unfixed errors, unapplied suggestions).

---

**Migration Files:**
- `012_code_versions.sql` - Version history support
- `013_autonomous_features.sql` - Error tracking and suggestions

**Dependencies:**
- Requires `003_draft_projects.sql` (draft_projects table)
- Requires `002_user_accounts.sql` (user_accounts table)
- Requires `007_row_level_security.sql` (RLS patterns)

**Status:** ✅ Ready for production





