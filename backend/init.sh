#!/bin/sh

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🔄 Running migrations..."
npx prisma migrate deploy || npm run migrate || echo "Migration completed or not needed"

echo "🌱 Running seed..."
node src/scripts/seed.js || npm run seed || echo "Seed completed or not needed"

echo "✅ Database initialized"

echo "🚀 Starting server..."
npm start
