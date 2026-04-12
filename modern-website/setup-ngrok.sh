#!/bin/bash

echo "🚀 Setting up BeeZee with Ngrok for payment testing..."
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ Ngrok not found. Please install it first:"
    echo "   npm install -g ngrok"
    echo "   or download from https://ngrok.com/download"
    exit 1
fi

# Check if app is running on port 3000
if ! curl -s http://localhost:3000 --connect-timeout 3 > /dev/null; then
    echo "❌ App not running on port 3000"
    echo "   Please start your app first: npm run dev"
    exit 1
fi

echo "✅ App is running on port 3000"
echo ""

# Start ngrok
echo "🔗 Starting ngrok tunnel..."
ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok to start
echo "⏳ Waiting for ngrok URL..."
sleep 5

# Extract the ngrok URL
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    echo "   Check ngrok.log for errors"
    kill $NGROK_PID 2>/dev/null
    exit 1
fi

echo "✅ Ngrok URL: $NGROK_URL"
echo ""

# Update .env.local with the ngrok URL
ENV_FILE=".env.local"

# Create backup
if [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_FILE.backup"
    echo "📁 Backed up existing .env.local to .env.local.backup"
fi

# Update or add NGROK_URL
if grep -q "NGROK_URL=" "$ENV_FILE"; then
    # Update existing NGROK_URL
    sed -i "s|NGROK_URL=.*|NGROK_URL=$NGROK_URL|g" "$ENV_FILE"
    echo "✅ Updated existing NGROK_URL in .env.local"
else
    # Add NGROK_URL to end of file
    echo "" >> "$ENV_FILE"
    echo "NGROK_URL=$NGROK_URL" >> "$ENV_FILE"
    echo "✅ Added NGROK_URL to .env.local"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your app: npm run dev"
echo "   2. Test subscription flow"
echo "   3. Payment will redirect to: $NGROK_URL/api/kyshi/payment-success"
echo ""
echo "📝 Ngrok is running in background (PID: $NGROK_PID)"
echo "   Stop it with: kill $NGROK_PID"
echo "   View logs with: tail -f ngrok.log"
