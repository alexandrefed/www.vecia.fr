#!/bin/bash
# EMERGENCY FIX: Restart PM2 to load new CSS hashes
# Run this on your VPS: ssh your-vps "bash -s" < emergency-restart.sh

echo "🚨 EMERGENCY: Restarting PM2 to fix CSS 404 errors..."

cd /home/alex/vecia-website || exit 1

echo "📋 Current PM2 status:"
pm2 status

echo "🛑 Stopping vecia-website..."
pm2 stop vecia-website

echo "🗑️  Deleting old process..."
pm2 delete vecia-website

echo "🔄 Starting fresh..."
pm2 start ecosystem.config.cjs

echo "💾 Saving PM2 config..."
pm2 save

echo "✅ PM2 restarted!"
echo ""
echo "📊 New status:"
pm2 status

echo ""
echo "🔍 Testing health endpoint..."
sleep 2
curl -s http://127.0.0.1:4321/api/health.json | jq '.' || echo "⚠️  Health check failed"

echo ""
echo "✅ DONE! Check https://www.vecia.fr now"
