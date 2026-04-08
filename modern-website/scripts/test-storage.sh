#!/bin/bash
# =====================================================
# SCRIPT: Test Storage Optimization
# PURPOSE: Verify hot/cold separation is working
# =====================================================

echo "Testing Storage Optimization..."

# Test 1: Check database size
echo "Database size:"
curl -s "http://localhost:3000/api/webhook/archive-trigger" \
  -H "Authorization: Bearer ${ARCHIVE_WEBHOOK_SECRET}" \
  | jq '.metrics'

# Test 2: Create test expense
echo "Creating test expense..."
curl -X POST "http://localhost:3000/api/expenses" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "description": "Test expense", "category": "test"}'

# Test 3: Run archive (manual)
echo "Running archive manually..."
curl -X POST "http://localhost:3000/api/webhook/archive-trigger" \
  -H "Authorization: Bearer ${ARCHIVE_WEBHOOK_SECRET}"

# Test 4: Check archive status
echo "Archive status:"
curl -s "http://localhost:3000/api/webhook/archive-trigger" \
  -H "Authorization: Bearer ${ARCHIVE_WEBHOOK_SECRET}" \
  | jq '.metrics.last_archive_run'

echo "Tests completed!"
