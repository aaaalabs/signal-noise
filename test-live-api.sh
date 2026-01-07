#!/bin/bash

echo "🧪 Testing LIVE /api/tasks endpoint..."
echo ""

# Get token from sessionData
TOKEN="<your token here>" # removed hard coded token from here for better security measure

echo "📡 Calling https://signal-noise.app/api/tasks"
echo ""

curl -s -D - "https://signal-noise.app/api/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | head -30

echo ""
echo "📊 Parsing response..."
echo ""

RESPONSE=$(curl -s "https://signal-noise.app/api/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

TASK_COUNT=$(echo "$RESPONSE" | grep -o '"tasks":\[' | wc -l)
VERSION=$(echo "$RESPONSE" | grep -o '"version":[0-9]*' | grep -o '[0-9]*')

echo "Task count in response: checking..."
echo "Version in response: $VERSION"
echo ""

# Count tasks properly
echo "$RESPONSE" | python3 -c "
import sys
import json
try:
    data = json.load(sys.stdin)
    print(f\"✅ Task count: {len(data.get('data', {}).get('tasks', []))}\")
    print(f\"✅ Version: {data.get('version', 'none')}\")
    print(f\"✅ First task: {data.get('data', {}).get('tasks', [{}])[0].get('text', 'none')}\")
    print(f\"✅ First task timestamp: {data.get('data', {}).get('tasks', [{}])[0].get('timestamp', 'none')}\")
except Exception as e:
    print(f\"❌ Error: {e}\")
"

echo ""
echo "🔍 Expected from Redis:"
echo "   Tasks: 279"
echo "   Version: 12360"
echo "   First task: Test4 (2025-11-02T08:54:45.515Z)"
