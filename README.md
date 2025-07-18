# 🏋️‍♂️ PulseFit – Your Personal Fitness Journey Companion

**PulseFit** is a personalized fitness tracking web application built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with Clerk for seamless authentication. It helps users plan, monitor, and optimize their health journey through powerful tools such as workout tracking, meal planning, goal setting, and progress visualization.

---

## 🚀 Features

- 🔐 **Authentication & User Management**  
  Secure sign-in/sign-up with Clerk, including support for OAuth (Google, etc.)

- 🏃 **Workout Tracker**  
  Log workouts, set types/duration, and monitor weekly activity.

- 🥗 **Meal Planner**  
  Track daily meals, calories, and nutritional information.

- 🎯 **Goal Tracker**  
  Set and monitor fitness goals (e.g., weight loss, strength, endurance).

- 📈 **Progress Dashboard**  
  Interactive dashboard with graphs, summaries, and progress bars for daily/weekly metrics.

- 🧠 **Profile Customization**  
  Personalized experience based on user data and preferences.

---

## 📁 Project Structure

```
PulseFit/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── clerk-react/
│   └── (Clerk-integrated Vite + TS setup)
├── .env.local
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React, Material-UI, Clerk Authentication
- **Backend**: Node.js, Express (future integration)
- **Database**: LocalStorage (development), MongoDB (planned)
- **Build Tool**: Vite
- **Authentication**: Clerk

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abrarwarunkar/PulseFit.git
cd PulseFit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file and add your Clerk publishable key:

```env
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Run the app

```bash
npm start
```

The app should now be running at `http://localhost:3000`

---

## 📌 Roadmap / Upcoming Features

- 🔄 MongoDB integration for persistent data
- 🩺 AI-powered health insights and recommendations
- 📱 Mobile responsiveness and PWA support
- 📊 Advanced analytics and trend reports
- 🤝 Integration with wearable fitness devices (e.g., Fitbit, Apple Health)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Clerk.dev](https://clerk.dev) – Authentication
- [Material UI](https://mui.com) – UI Components
- [Chart.js](https://www.chartjs.org/) – Graphs and visualizations
