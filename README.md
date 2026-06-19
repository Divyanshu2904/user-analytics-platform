# CausalFunnel User Analytics Platform

CausalFunnel User Analytics is a full-stack, lightweight user behavior analytics platform (similar to Mixpanel / Hotjar) designed to capture and visualize real-time visitor interactions. It tracks page views, scroll depths, page load speeds, and click coordinates, consolidating them into an interactive Next.js dashboard featuring session timelines, responsive heatmaps, and automated heuristic UX advice.

This project was built as a Full Stack Engineer technical assessment for **CausalFunnel**.

---

## 🔗 Live Deployment & Interactive Demo Links

> [!IMPORTANT]
> To test the system in real-time, click on the **Live Demo Site** links below, navigate through pages, and perform some clicks. Then, open the **Live Dashboard** and click **Sync Database** or **Refresh Coordinates** to see your activities update live!

* **Live Analytics Dashboard (Vercel)**: [https://user-analytics-platform-green.vercel.app/](https://user-analytics-platform-green.vercel.app/)
* **Live Demo Site (Render - Hosted on Backend)**: 
  * 🏠 **Home Page**: [https://user-analytics-platform.onrender.com/index.html](https://user-analytics-platform.onrender.com/index.html)
  * ℹ️ **About Page**: [https://user-analytics-platform.onrender.com/about.html](https://user-analytics-platform.onrender.com/about.html)
  * ✉️ **Contact Page**: [https://user-analytics-platform.onrender.com/contact.html](https://user-analytics-platform.onrender.com/contact.html)
* **Backend API base (Render)**: [https://user-analytics-platform.onrender.com/api](https://user-analytics-platform.onrender.com/api)

---

## 🚀 Key Capabilities

1. **Vanilla JS Spy Tracker (`tracker/tracker.js`)**:
   - Zero-dependency script embeddable on any webpage.
   - Automatically initializes session IDs inside `sessionStorage` (persistent across tabs/page refreshes during a session).
   - Records page views, click positions, scroll depths, and performance load speed (via Navigation Timing API).
   - Automatically resolves API endpoints dynamically, sending events to `localhost` in development and to Render API in production.
   
2. **Robust Backend REST API (`backend/`)**:
   - Node.js + Express with MongoDB Atlas database models.
   - Highly scalable event ingestion controller allowing batch event insertion.
   - Aggregated reporting APIs for sessions, session timelines, spatial click density maps, and heuristic insights.
   - Hosts and serves the static `demo-site` pages on the web so recruiters can run test actions instantly.

3. **Multi-page Demo Site (`demo-site/` / `backend/public/`)**:
   - A modern 3-page site (Home, About, Contact) pre-integrated with the tracking script.
   - Designed with deep scroll-depth milestones and interactive elements (forms, buttons) to generate authentic telemetry data.

4. **Next.js 14 Dashboard (`frontend/`)**:
   - Styled with premium **CausalFunnel brand colors** (vibrant whites, subtle slate-gray panels, and purple/blue/cyan accents).
   - **Metrics Panel**: High-level counters for total sessions, total clicks, average duration, and a device breakdown with custom icons (Laptop 💻, Smartphone 📱, Tablet 📟).
   - **Chronological User Journey**: Interactive sidebar drawer presenting an event-by-event timeline for any selected session.
   - **Visual Click Heatmap**: Overlays registered coordinates onto a responsive wireframe representing your web pages. Page paths are formatted into clean indicators (HOME, ABOUT, CONTACT).
   - **AI Design Advisor**: Algorithmic heuristic analysis flagging high page load latency, low element engagement, or poor scroll depths.
   - **Active Sync Indicator**: Animates the database sync circle whenever a manual or auto-refresh query (every 5 seconds) runs.
   - **Natural Page Scroll**: Standard vertical and horizontal scrolling designed to prevent layout clipping on mobile viewports or side-by-side split screens.

---

## 🛠️ Tech Stack

- **Tracker**: Vanilla JavaScript (ES6)
- **Backend API & Web Server**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas
- **Dashboard Frontend**: Next.js 14 (App Router), TailwindCSS, Lucide React (icons)

---

## 📁 Project Structure

```text
user-analytics-platform/
│
├── backend/                    # Node.js + Express Server
│   ├── config/db.js            # MongoDB Mongoose Configuration
│   ├── controllers/            # Event & aggregation API logic
│   ├── models/Event.js         # Mongoose Event schema
│   ├── routes/eventRoutes.js   # API route definitions
│   ├── public/                 # Served static files (demo-site & tracker)
│   ├── .env.example            # Environment variables template
│   └── server.js               # Ingestion entry point & web host
│
├── tracker/
│   └── tracker.js              # Vanilla JS tracking script
│
├── demo-site/                  # Source copy of the multi-page test website
│   ├── css/style.css           # Premium demo site layout
│   ├── index.html              # Home page
│   ├── about.html              # Scroll depth test page
│   └── contact.html            # Interactive contact form
│
└── frontend/                   # Next.js 14 Dashboard App
    ├── src/
    │   ├── app/                # App Router pages (Dashboard, Heatmap, Insights)
    │   ├── components/         # Reusable dashboard widgets (Layouts, Timelines)
    │   └── utils/api.js        # Dynamic API fetch layer with normalizers
    └── package.json
```

---

## ⚙️ Getting Started (Local Run)

### 1. Database Configuration
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Connect** -> **Connect your application** and copy your MongoDB connection string.
3. Open `backend/.env` and update `MONGODB_URI` with your connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/analytics?retryWrites=true&w=majority
   ```

### 2. Run the Backend API & Web Server
Navigate to the `backend` directory, install packages, and start the ingestion server:
```bash
cd backend
npm install
npm run dev
```
The console will output:
```text
Server is running on port 5000
MongoDB Connection Successful
```

### 3. Run the Next.js Dashboard
Open a new terminal tab, navigate to the `frontend` folder, install packages, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to access the dashboard.

### 4. Trigger Telemetry Data (Demo Site)
1. Open the file `demo-site/index.html` directly in your browser (double-click the file) or access it locally via `http://localhost:5000/index.html`.
2. Click on headings, buttons, and links.
3. Navigate to **About** and scroll down to the bottom (this registers scroll depth milestones).
4. Go to **Contact**, click around the form inputs, and hit the Submit button.
5. Go back to your Dashboard at `http://localhost:3000` and click **Sync Database** or **Refresh Coordinates**. You will immediately see your session, click heatmaps, and design alerts appear in real-time!

---

## 💡 Important Architectural Decisions

### 1. Click Normalization & Responsive Heatmaps
Standard click-tracking systems suffer from **coordinate shifting**: a click at `(960, 400)` represents the dead center on a 1920px width monitor, but lands completely off-screen on a mobile device. 
To resolve this:
- The `tracker.js` captures both absolute click coordinates (`x`, `y`) and the viewport dimensions at the time of interaction (`window_width`, `window_height`).
- The frontend computes relative percentages: `left: (click.x / click.window_width) * 100` and `top: (click.y / click.window_height) * 100`.
- The dashboard overlays dots on the mockup using these percentage values, ensuring click alignment is mathematically preserved regardless of browser scaling.

### 2. Scroll Depth Milestones (Debounced)
Tracking scrolls on every pixel leads to excessive database writes and server bottlenecks. To optimize performance:
- The tracker monitors scroll movements, but only triggers events at key thresholds: **25%**, **50%**, **75%**, and **100%**.
- Each milestone is sent exactly once per page view, minimizing bandwidth and ensuring a clean event count in MongoDB.

### 3. Session Isolation
We utilize browser `sessionStorage` rather than `localStorage` to store the unique `session_id`. This aligns with industry standards, ensuring that when a visitor closes their browser tab, their session automatically terminates. If they open the site in a new tab, a brand-new session lifecycle begins.
