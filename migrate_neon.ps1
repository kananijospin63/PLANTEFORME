$env:DATABASE_URL = "postgresql://neondb_owner:npg_aRuP2d7WDUsF@ep-bold-grass-bewndmgu.c-9.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
Set-Location "d:\jovim code+\planteforme\backend"
Write-Host "DATABASE_URL set, running migrate deploy..."
npx prisma migrate deploy
Write-Host "Exit: $LASTEXITCODE"
