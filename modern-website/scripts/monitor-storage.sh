#!/bin/bash
# =====================================================
# SCRIPT: Monitor Storage
# PURPOSE: Check storage usage and alert if near limit
# USAGE: ./scripts/monitor-storage.sh (run daily via cron)
# =====================================================

ALERT_THRESHOLD_GB=7  # Alert when database reaches 7 GB
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL}"

# Get database size
DB_SIZE_BYTES=$(curl -s "http://localhost:3000/api/webhook/archive-trigger" \
  -H "Authorization: Bearer ${ARCHIVE_WEBHOOK_SECRET}" \
  | jq -r '.metrics.database_size_bytes')

DB_SIZE_GB=$(echo "scale=2; $DB_SIZE_BYTES / 1073741824" | bc)

echo "Database size: ${DB_SIZE_GB} GB"

# Check if near limit
if (( $(echo "$DB_SIZE_GB > $ALERT_THRESHOLD_GB" | bc -l) )); then
    echo "WARNING: Database size (${DB_SIZE_GB} GB) approaching Free Plan limit (8 GB)"
    
    # Send alert to Slack if configured
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST "$SLACK_WEBHOOK" \
          -H "Content-Type: application/json" \
          -d "{
            \"text\": \"BeeZee Storage Alert\nDatabase: ${DB_SIZE_GB} GB / 8 GB\nUsage: $(echo "scale=0; $DB_SIZE_GB / 8 * 100" | bc)%\nAction: Consider running archive or upgrading to Pro\"
          }"
    fi
fi

# Check when last archive ran
LAST_ARCHIVE=$(curl -s "http://localhost:3000/api/webhook/archive-trigger" \
  -H "Authorization: Bearer ${ARCHIVE_WEBHOOK_SECRET}" \
  | jq -r '.metrics.last_archive_run')

echo "Last archive: $LAST_ARCHIVE"

# Suggest running archive if older than 7 days
if [[ "$(uname)" == "Darwin" ]]; then
    # macOS date
    LAST_ARCHIVE_SEC=$(date -j -f "%Y-%m-%d %H:%M:%S" "$LAST_ARCHIVE" +%s 2>/dev/null || echo 0)
else
    # Linux date
    LAST_ARCHIVE_SEC=$(date -d "$LAST_ARCHIVE" +%s 2>/dev/null || echo 0)
fi

NOW_SEC=$(date +%s)
DAYS_SINCE_ARCHIVE=$(( ($NOW_SEC - $LAST_ARCHIVE_SEC) / 86400 ))

if [ $DAYS_SINCE_ARCHIVE -gt 7 ]; then
    echo "Archive hasn't run in $DAYS_SINCE_ARCHIVE days. Running now..."
    curl -X POST "http://localhost:3000/api/webhook/archive-trigger" \
      -H "Authorization: Bearer ${ARCHIVE_WEBHOOK_SECRET}"
fi

echo "Monitoring complete"
