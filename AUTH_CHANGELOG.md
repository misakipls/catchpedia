# User Authentication System - Changelog

## Overview
Implemented a comprehensive user authentication system with secure password hashing, JWT tokens, and protected routes for article submission.

## Files Added

### Authentication Utilities
- `app/utils/auth.ts` - Complete authentication utilities with password hashing, JWT management, and cookie helpers

### User Data Management
- `app/data/store-users.ts` - User data store with file-based storage (dev only)

### API Endpoints
- `app/api/auth/signup/route.ts` - User registration endpoint
- `app/api/auth/login/route.ts` - User login endpoint  
- `app/api/auth/logout/route.ts` - User logout endpoint

### Authentication Pages
- `app/auth/signup/page.tsx` - User registration page
- `app/auth/login/page.tsx` - User login page

### Protected Routes
- `app/contribute/page.tsx` - Protected article submission page (server-side auth)
- `app/contribute/ContributeClient.tsx` - Client component for article submission

## Files Modified
- `app/api/submit-article/route.ts` - Updated to require user authentication
- `app/utils/auth.ts` - Added admin authentication functions for backward compatibility

## Environment Variables

### Local Development (.env.local)
Add these variables to your `.env.local` file:
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
ADMIN_PASSWORD=admin123
```

**Important:** 
- Replace `your-super-secret-jwt-key-change-in-production` with a strong, random secret
- Use a different JWT secret for production
- Keep the admin password secure

### Production Deployment

#### Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:
   - **JWT_SECRET:** Your strong random secret (different from dev)
   - **JWT_EXPIRES_IN:** `7d` (or `1d` for shorter sessions)
   - **BCRYPT_SALT_ROUNDS:** `10`
   - **ADMIN_PASSWORD:** Your secure admin password

#### Netlify
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add the same variables as above

## Security Features

### Password Security
- **bcrypt Hashing:** Passwords are hashed with bcrypt using configurable salt rounds
- **Password Validation:** Minimum 8 characters with uppercase, lowercase, and numbers
- **No Plaintext Storage:** Passwords are never stored in plain text

### JWT Token Security
- **HttpOnly Cookies:** JWT tokens stored in HttpOnly cookies (not localStorage)
- **SameSite Protection:** CSRF protection with SameSite=Lax
- **Secure Flag:** Automatically set to `true` in production
- **Configurable Expiration:** Default 7 days, configurable via environment

### Route Protection
- **Server-Side Authentication:** All protected routes verified server-side
- **Automatic Redirects:** Unauthenticated users redirected to login
- **Next Parameter:** Supports redirecting back to intended page after login

## User Flow

### Registration
1. User visits `/auth/signup`
2. Fills out email, password, and optional display name
3. Password validated for strength
4. Account created with hashed password
5. JWT token set in HttpOnly cookie
6. Redirected to `/contribute` or intended page

### Login
1. User visits `/auth/login`
2. Enters email and password
3. Credentials verified against stored hash
4. JWT token set in HttpOnly cookie
5. Redirected to intended page

### Article Submission
1. User must be authenticated to access `/contribute`
2. Unauthenticated users redirected to `/auth/login?next=/contribute`
3. After login, redirected back to `/contribute`
4. Article submitted with authenticated user info
5. Goes to admin pending queue for review

### Logout
1. User clicks logout button
2. JWT cookie cleared
3. Redirected to home page
4. Access to protected routes blocked

## Testing Instructions

### 1. Setup Environment
```bash
# Add to .env.local
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
ADMIN_PASSWORD=admin123
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test User Registration
1. Visit `http://localhost:3000/auth/signup`
2. Fill out the registration form
3. Should create account and redirect to `/contribute`
4. Check browser cookies for `catchpedia_user`

### 4. Test Protected Routes
1. Try accessing `http://localhost:3000/contribute` without login
2. Should redirect to `/auth/login?next=/contribute`
3. Login with created account
4. Should redirect back to `/contribute`

### 5. Test Article Submission
1. From `/contribute`, submit a test article
2. Check admin dashboard at `/admin` (password: `admin123`)
3. Should see pending article in admin queue
4. Approve/reject the article

### 6. Test Logout
1. Click logout button in `/contribute`
2. Should clear cookie and redirect to home
3. Try accessing `/contribute` again
4. Should redirect to login page

## Security Recommendations

### Production Security
1. **Use HTTPS:** Ensure your production site uses HTTPS
2. **Strong JWT Secret:** Use a cryptographically secure random string
3. **Environment Variables:** Use platform secrets management
4. **Database Migration:** Replace file-based storage with proper database
5. **Rate Limiting:** Consider adding rate limiting to auth endpoints

### Database Migration
The current system uses file-based storage for development. For production:

**Recommended Options:**
- **Supabase Auth:** Complete authentication service
- **NextAuth.js:** Popular Next.js authentication library
- **PostgreSQL + Prisma:** Full control with modern ORM
- **MongoDB:** Document-based storage
- **Auth0:** Enterprise authentication service

**Migration Steps:**
1. Set up chosen database/service
2. Update `app/data/store-users.ts` to use new storage
3. Update environment variables
4. Test authentication flow
5. Deploy with new configuration

## Route Structure

### Public Routes (No Authentication Required)
- `/` - Homepage
- `/auth/signup` - User registration
- `/auth/login` - User login
- `/search` - Search functionality
- All category and article pages

### Protected Routes (Authentication Required)
- `/contribute` - Article submission (user auth)
- `/admin/*` - Admin panel (admin auth)

### API Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/submit-article` - Article submission (requires user auth)
- `POST /api/admin-login` - Admin login
- `POST /api/admin-logout` - Admin logout
- `POST /api/approve-article` - Article approval (requires admin auth)
- `POST /api/reject-article` - Article rejection (requires admin auth)

## Notes
- Both user and admin authentication systems coexist
- User authentication is required for article submission
- Admin authentication is required for article approval
- File-based storage is development-only and should be replaced for production
- All passwords are hashed with bcrypt before storage
- JWT tokens are stored in HttpOnly cookies for security
