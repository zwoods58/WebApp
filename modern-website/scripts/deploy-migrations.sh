#!/bin/bash
# =====================================================
# SCRIPT: Deploy Migrations
# PURPOSE: Run all Supabase migrations in order
# USAGE: ./scripts/deploy-migrations.sh
# =====================================================

set -e

echo "Deploying BeeZee Storage Optimizations..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first:"
    echo "   https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "Please log in to Supabase first:"
    supabase login
fi

# Get project reference from environment
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | sed 's/\.supabase\.co//')

if [ -z "$PROJECT_REF" ]; then
    read -p "Enter your Supabase project reference (from dashboard URL): " PROJECT_REF
fi

echo "Using project reference: $PROJECT_REF"

# Run migrations in order
echo "Running migration 20260408_hot_cold_tables..."
supabase db push --project-ref $PROJECT_REF

echo "Running migration 20260408_chat_storage_bucket..."
supabase db push --project-ref $PROJECT_REF

echo "Running migration 20260408_archive_functions..."
supabase db push --project-ref $PROJECT_REF

echo "Migrations completed!"

# Deploy Edge Function
echo "Deploying Edge Function: archive-old-data..."
supabase functions deploy archive-old-data --project-ref $PROJECT_REF

echo "Edge Function deployed!"

echo ""
echo "Next steps:"
echo "1. Set up a cron job to trigger the archive function weekly"
echo "   Endpoint: https://$PROJECT_REF.supabase.co/functions/v1/archive-old-data"
echo "   Method: POST"
echo "   Headers: Authorization: Bearer YOUR_ARCHIVE_SECRET"
echo ""
echo "2. Set environment variables:"
echo "   SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "   SUPABASE_SERVICE_ROLE_KEY: your_service_role_key"
echo "   ARCHIVE_WEBHOOK_SECRET: your_secret_key"
echo ""
echo "3. Run storage test: ./scripts/test-storage.sh"
