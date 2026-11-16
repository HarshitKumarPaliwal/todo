# To-Do App (MERN: MongoDB + Express + React + Node)

## Folder structure
```
todo-app/
├── backend/            -> Express + MongoDB + JWT (port 3200)
│   ├── index.js        -> saari APIs (signup, login, tasks CRUD)
│   ├── dbconfig.js     -> MongoDB connection
│   └── .env            -> MONGO_URI, FRONTEND_URL, PORT
└── frontend/           -> React + Vite (port 5173)
    ├── .env            -> VITE_API_URL
    └── src/
        ├── main.jsx, App.jsx   -> routes
        ├── components/         -> Login, SignUp, List, Addtask, UpdateTask, NavBar, Protected
        └── Style/              -> CSS files
```

## Run kaise kare
1. `backend/.env` kholo aur `MONGO_URI` me apni MongoDB Atlas string daalo.
2. Terminal 1:
   ```
   cd backend
   npm install
   npm run dev
   ```
3. Terminal 2:
   ```
   cd frontend
   npm install
   npm run dev
   ```
4. Browser me kholo: http://localhost:5173

## Flow
- SignUp/Login -> server JWT token banakar **cookie** me bhejta hai
- Frontend har request me `credentials: "include"` bhejta hai, taaki cookie jaye
- `verifyJWTToken` middleware token check karta hai
- `Protected` component bina login ke pages block karta hai (localStorage "login" se)

## Code me kya FIX kiya (original se)
1. Backend: `cookieParser()` aur `e.json()` duplicate the, ek rakha.
2. Backend `/login`: user na milne par response nahi jata tha, ab `else` add kiya.
3. Backend `/signup`: ab cookie bhi server se set hoti hai.
4. NavBar: Logout `<Link>` me `to="/login"` add kiya (bina `to` ke error aata hai).
5. Login: password input `type="password"` kiya.
6. UpdateTask: input `value={... || ""}` kiya (warning avoid karne ke liye).

## Aage ke liye improvements (abhi nahi kiye, code same rakhne ke liye)
- Password hash karo (bcrypt), abhi plain text save ho raha hai
- JWT secret `"Google"` ko `.env` me daalo
- Har user ko sirf apne tasks dikhao
