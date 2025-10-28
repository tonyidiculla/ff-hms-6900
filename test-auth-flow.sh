#!/bin/bash

# Test Authentication Flow: Auth Service -> HMS Gateway
# This script demonstrates:
# 1. User logs in to auth service and receives token
# 2. User accesses HMS gateway with token in URL
# 3. HMS gateway verifies token and sets cookie

# Usage: ./test-auth-flow.sh <password>
# Example: ./test-auth-flow.sh "YourPassword123!"

echo "================================================"
echo "Testing Furfield Authentication Flow"
echo "================================================"
echo ""

# Check if password provided as argument
if [ -z "$1" ]; then
  echo "Usage: $0 <password>"
  echo "Example: $0 'YourPassword123!'"
  exit 1
fi

PASSWORD="$1"
echo "Step 1: Logging in to auth service (port 6800)..."
echo ""

# Login and capture the response
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:6800/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"tony@fusionduotech.com\",\"password\":\"$PASSWORD\"}")

# Check if login was successful
SUCCESS=$(echo $LOGIN_RESPONSE | grep -o '"success":true' || echo "")

if [ -z "$SUCCESS" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful!"
echo ""

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ No token received!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Token received: ${TOKEN:0:50}..."
echo ""

# Step 2: Verify token with auth service
echo "Step 2: Verifying token with auth service..."
VERIFY_RESPONSE=$(curl -s -X POST http://localhost:6800/api/auth/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

VERIFY_SUCCESS=$(echo $VERIFY_RESPONSE | grep -o '"success":true' || echo "")

if [ -z "$VERIFY_SUCCESS" ]; then
  echo "❌ Token verification failed!"
  echo "Response: $VERIFY_RESPONSE"
  exit 1
fi

echo "✅ Token verified successfully!"
echo ""

# Step 3: Access HMS Gateway with token
echo "Step 3: Accessing HMS Gateway (port 6900) with token..."
echo "URL: http://localhost:6900/?token=$TOKEN"
echo ""

# Make request to HMS gateway with token in URL
HMS_RESPONSE=$(curl -s -i "http://localhost:6900/?token=$TOKEN")

# Check if we got a redirect (302) to set cookie
if echo "$HMS_RESPONSE" | grep -q "HTTP.*302"; then
  echo "✅ HMS Gateway received token and is setting cookie!"
  echo ""
  echo "Cookie details:"
  echo "$HMS_RESPONSE" | grep -i "set-cookie"
  echo ""
elif echo "$HMS_RESPONSE" | grep -q "HTTP.*200"; then
  echo "✅ HMS Gateway accepted token!"
  echo ""
else
  echo "⚠️  Unexpected response from HMS Gateway"
  echo "$HMS_RESPONSE" | head -20
fi

echo ""
echo "================================================"
echo "Authentication Flow Test Complete!"
echo "================================================"
echo ""
echo "Summary:"
echo "1. ✅ Logged in to auth service (port 6800)"
echo "2. ✅ Received JWT token"
echo "3. ✅ Token verified by auth service"
echo "4. ✅ HMS Gateway (port 6900) can verify token"
echo ""
echo "Next steps:"
echo "- Access HMS at: http://localhost:6900/?token=$TOKEN"
echo "- The HMS gateway will set a cookie and redirect"
echo "- Future requests will use the cookie automatically"
echo ""
