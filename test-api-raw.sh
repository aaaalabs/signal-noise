#!/bin/bash

TOKEN="snk_c47480431db571b9da61338152fdd56edbcc7ebddce23c550617c6ce72e0eaa3"

echo "🧪 Testing /api/tasks with curl..."
echo ""

RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" https://signal-noise.app/api/tasks)

echo "📡 Raw Response:"
echo "$RESPONSE" | jq -r '.'
echo ""

VERSION=$(echo "$RESPONSE" | jq -r '.version')
TASKS=$(echo "$RESPONSE" | jq -r '.data.tasks | length')

echo "📊 Parsed:"
echo "   Version: $VERSION"
echo "   Tasks: $TASKS"
echo ""

echo "🔍 Expected from Redis:"
echo "   Version: 12362"
echo "   Tasks: 277"
echo ""

if [ "$VERSION" != "12362" ]; then
  echo "🚨 STALE DATA!"
  echo "   Difference: $((12362 - VERSION)) versions behind"
fi
