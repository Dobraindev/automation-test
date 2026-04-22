#!/usr/bin/env bash
# 매일 호스트 중복 접속 제어 검증 (로컬 cron 용)
#
# 사용법:
#   crontab -e
#   0 9 * * * cd /Users/harry/e2e-automation && ./scripts/daily-access-control.sh >> logs/access-control.log 2>&1

set -e

cd "$(dirname "$0")/.."

# URL 인자로 받을 수 있음 (기본: develop-dev)
BASE_URL="${1:-https://develop-dev.dubuhealth.in}"
export BASE_URL

mkdir -p logs
LOG_FILE="logs/access-control-$(date +%Y%m%d).log"

echo "=== $(date) / BASE_URL=$BASE_URL ===" | tee -a "$LOG_FILE"

# Playwright 실행
if npx playwright test --project='배포전TC-access-control' --workers=1 2>&1 | tee -a "$LOG_FILE"; then
  echo "✅ PASS $(date)" | tee -a "$LOG_FILE"
  exit 0
else
  echo "❌ FAIL $(date)" | tee -a "$LOG_FILE"
  # Slack 알림 (SLACK_WEBHOOK_URL 환경변수 설정 시)
  if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"🚨 TC-21 호스트 중복 접속 제어 실패 (URL: $BASE_URL)\"}" \
      "$SLACK_WEBHOOK_URL" || true
  fi
  exit 1
fi
