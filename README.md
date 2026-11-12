# SkillSwap - MERN Skill Exchange Platform

Trade what you know for what you want to learn. Users list skills they can **teach** and skills they want to **learn**.
The app finds matches (mutual matches first), lets users send swap requests, and rate each other after a swap.

**Stack:** MongoDB Atlas, Express, React (Vite), Node.js, Mongoose, Tailwind CSS, JWT auth.

## Folder structure
```
skillswap/
  server/   Express REST API + Mongoose models
  client/   React app (Vite + Tailwind)
```

## Setup (about 5 minutes)

### 1. MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Database Access: add a database user (username + password).
3. Network Access: add your IP (or `0.0.0.0/0` for testing).
4. Connect > Drivers: copy the connection string.

### 2. Backend
```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env: paste MONGO_URI (put your password in, and add /skillswap before the ?), set JWT_SECRET
npm run seed              # optional demo data (login: asha@demo.com / password123)
npm run dev               # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev               # runs on http://localhost:5173
```

## Requirement checklist (where to find each in the code)

| # | Requirement | Where |
|---|---|---|
| 1 | Multiple components | `client/src/components/*` (Navbar, Footer, SkillCard, SwapModal, FormField, StarRating, Loader, ErrorMessage, ProtectedRoute) |
| 2 | Responsive design | Tailwind breakpoints (`sm:`, `md:`, `lg:`) everywhere; mobile hamburger in `Navbar.jsx` |
| 3 | Tailwind CSS | `client/vite.config.js`, `client/src/index.css` (custom theme) |
| 4 | Fetch API | `client/src/api/api.js` (wrapper used by all pages) |
| 5 | Error handling | try/catch in every request, `ErrorMessage` component, network-failure message in `api.js`, central `server/middleware/error.js` |
| 6 | Props and State | `SkillCard`, `FormField`, `StarRating` (props); `useState` in every page |
| 7 | Conditional rendering | Navbar (guest vs member), `SkillDetail` buttons, loaders, empty states, `Requests` actions by status |
| 8 | React Router + Protected Routes | `App.jsx`, `components/ProtectedRoute.jsx` (Dashboard, My skills, Matches, Requests, Profile) |
| 9 | Forms + validation | Login, Register, MySkills, Profile, SwapModal; rules in `client/src/utils/validators.js` plus server-side Mongoose validation |
| 10 | Hooks / Context API | `AuthContext.jsx`; `useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`, `useRef` (debounced search in `Browse.jsx`); custom hook `hooks/useFetch.js` |
| 11 | REST API | `server/routes/*` (auth, skills, users, swaps) with GET/POST/PUT/DELETE |
| 12 | Environment variables | `server/.env` (MONGO_URI, JWT_SECRET, PORT, CLIENT_URL), `client/.env` (VITE_API_URL); `.env` is git-ignored |
| 13 | MongoDB | Collections: users, skills, swaps |
| 14 | MongoDB Atlas | `server/config/db.js` connects using `MONGO_URI` from Atlas |
| 15 | Mongoose schemas | `server/models/User.js`, `Skill.js`, `Swap.js` (validation, enums, refs, hooks, methods) |

## API summary
| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | no | Create account |
| POST | /api/auth/login | no | Log in, returns JWT |
| GET | /api/auth/me | yes | Current user |
| GET | /api/skills | no | List with search, filters, pagination |
| GET | /api/skills/mine | yes | My skills |
| GET | /api/skills/:id | no | One skill |
| POST/PUT/DELETE | /api/skills(/:id) | yes | Create, edit, delete (owner only) |
| GET | /api/users/matches | yes | Smart matches |
| GET | /api/users/:id | no | Public profile |
| PUT | /api/users/profile | yes | Update my profile |
| GET/POST | /api/swaps | yes | My swaps / send request |
| PUT | /api/swaps/:id/status | yes | Accept, decline, complete |
| POST | /api/swaps/:id/review | yes | Rate after completion |

## Matching logic
`GET /api/users/matches` finds users who **offer** a skill that you **want**. If they also **want** something you
**offer**, it is a *mutual match* and ranks first.

## Deployment (optional bonus)
- Backend: Render/Railway. Add the same variables as `.env`; set `CLIENT_URL` to your frontend URL.
- Frontend: Vercel/Netlify. Set `VITE_API_URL=https://your-api.onrender.com/api`.

## Demo flow for your viva
1. Register two accounts (use two browsers). 2. Add skills that match each other. 3. Open **Matches**, propose a swap.
4. Accept in the other account. 5. Mark completed and rate. 6. Show the protected route redirect when logged out.
