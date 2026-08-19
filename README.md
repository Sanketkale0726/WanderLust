# 🏡 Wanderlust — Full-Stack Travel & Property Listing Platform

> **Wanderlust** is a full-stack web application inspired by modern property-rental platforms. It allows users to explore, create, manage, update, and delete property listings through a responsive and user-friendly interface.

Built with **Node.js, Express.js, MongoDB, Mongoose, EJS, Bootstrap, and JavaScript**, the application demonstrates real-world backend architecture, database integration, authentication, authorization, validation, error handling, and CRUD operations.

---

## ✨ Features

### 🏠 Listing Management
- Create new property listings
- View all available listings
- View detailed information for individual listings
- Edit existing listings
- Delete listings
- Manage listing information such as:
  - Title
  - Description
  - Price
  - Location
  - Country
  - Image

### 🔐 Authentication & Authorization
- User registration and login
- Session-based authentication
- Protected routes
- Authorization checks
- Users can manage their own listings
- Unauthorized users are prevented from performing restricted operations

### 🛡️ Validation & Security
- Server-side request validation using **Joi**
- Protected routes and authorization middleware
- Environment variables using **dotenv**
- Sensitive credentials kept outside the source code
- Centralized error handling
- Custom error handling with `ExpressError`

### ⚡ Error Handling
- Centralized Express error-handling middleware
- Custom `ExpressError` class
- Asynchronous error handling using `wrapAsync`
- User-friendly error pages
- Proper handling of invalid routes and invalid requests

### 💬 Flash Messages
- Success messages after successful operations
- Error messages for failed operations
- Session-based flash messaging using `connect-flash`

### 🎨 Responsive UI
- Responsive design using **Bootstrap**
- Mobile-friendly layouts
- Responsive navigation bar
- Card-based listing interface
- EJS layouts using **ejs-mate**
- Clean and reusable UI components

### 🗄️ Database Integration
- MongoDB database
- Mongoose ODM
- Structured schemas and models
- CRUD operations
- Data validation
- Persistent storage for application data

### 🧩 MVC-Oriented Architecture

The application follows an **MVC-oriented structure** to separate different responsibilities:

```text
Model       → Database structure and data operations
View        → EJS templates and user interface
Controller  → Application/business logic
Routes      → HTTP endpoint definitions
Middleware  → Authentication, validation and error handling
Utils       → Reusable helper functions
```

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap
- EJS
- EJS-Mate

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication & Sessions

- Express Session
- Passport.js *(include only if actually used)*
- Connect Flash

### Validation & Error Handling

- Joi
- ExpressError
- Custom middleware
- Async error handling with `wrapAsync`

### Development Tools

- Nodemon
- VS Code
- Git
- GitHub
- Postman / API testing tools

---

## 📦 Dependencies

The project uses the following major packages:

```text
express
mongoose
ejs
ejs-mate
method-override
dotenv
connect-flash
express-session
joi
nodemon
```

> The exact dependency list should always be taken from `package.json`.

To install all dependencies:

```bash
npm install
```

For development with Nodemon:

```bash
npm run dev
```

---

## 📁 Project Structure

```text
Major_Project/
│
├── init/
│   └── Seed / initialization data
│
├── models/
│   └── Database models
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── routes/
│   ├── Listing routes
│   └── User routes
│
├── utils/
│   ├── ExpressError
│   └── wrapAsync
│
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── includes/
│
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── schema.js
```

---

# 🔄 Application Flow

```text
                    ┌──────────────────┐
                    │      Client      │
                    │ Browser / User   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Express      │
                    │      Routes      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Middleware    │
                    │ Auth / Validation│
                    │ Error Handling   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   Controllers   │
                    │ Business Logic  │
                    └────────┬─────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
          ┌──────────────┐       ┌──────────────┐
          │    Mongoose  │       │     EJS      │
          │     Models   │       │    Views     │
          └──────┬───────┘       └──────┬───────┘
                 │                      │
                 ▼                      ▼
          ┌──────────────┐       ┌──────────────┐
          │   MongoDB    │       │    Browser   │
          │   Database   │       │     UI       │
          └──────────────┘       └──────────────┘
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Wanderlust.git
```

Move into the project directory:

```bash
cd Wanderlust
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all dependencies specified in:

```text
package.json
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory:

```text
.env
```

Add your environment-specific configuration:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=your_session_secret
```

> Never commit `.env` to GitHub.

A template is provided as:

```text
.env.example
```

---

## 4. Start the Application

### Development Mode

```bash
npm run dev
```

### Normal Mode

```bash
node app.js
```

The application will start on the configured port.

For example:

```text
http://localhost:8080
```

---

# 🗃️ Database

Wanderlust uses **MongoDB** as its primary database and **Mongoose** as the ODM.

The application stores information such as:

```text
Users
Listings
Reviews
Sessions
```

depending on the enabled modules in the current implementation.

### Example Listing Data

```json
{
  "title": "Beautiful Mountain Retreat",
  "description": "A peaceful stay surrounded by nature.",
  "price": 2500,
  "location": "Pune",
  "country": "India"
}
```

---

# 🔐 Environment Variables

The application uses environment variables to keep sensitive configuration outside the source code.

Example:

```env
MONGO_URL=your_mongodb_connection_string
SECRET=your_secret_key
```

### Security Rule

Never commit:

```text
.env
```

to GitHub.

Instead, commit:

```text
.env.example
```

with placeholder values.

---

# 🧪 Development & Testing

The application can be tested locally using:

- Browser
- Postman
- API testing tools
- MongoDB database tools

Typical operations include:

```text
GET     → Retrieve listings
POST    → Create listings
PUT     → Update listings
DELETE  → Delete listings
```

---

# 📌 Key Backend Concepts Demonstrated

This project demonstrates practical implementation of:

- RESTful routing
- CRUD operations
- MVC architecture
- Middleware
- Authentication
- Authorization
- Sessions
- Cookies
- Flash messages
- Server-side validation
- Database relationships
- Mongoose schemas
- MongoDB CRUD operations
- Async/await
- Error handling
- Custom error classes
- Environment configuration
- EJS templating
- Responsive frontend design

---

# 🧠 What I Learned

Through this project, I gained practical experience in:

- Designing a full-stack web application
- Building RESTful APIs
- Working with Express.js
- Connecting Node.js applications to MongoDB
- Designing Mongoose schemas
- Implementing authentication and authorization
- Handling asynchronous operations
- Implementing centralized error handling
- Validating user input
- Structuring applications using MVC principles
- Creating reusable EJS layouts
- Managing sessions and flash messages
- Using Git and GitHub for version control
- Preparing applications for deployment

---

# 🔮 Future Improvements

Possible future enhancements include:

- ⭐ Rating and review system
- 🗺️ Interactive maps
- 🔍 Advanced search and filtering
- ❤️ Wishlist functionality
- 💳 Online payment integration
- 📧 Email notifications
- 📱 Progressive Web App support
- ☁️ Cloud-based image storage
- 📊 Admin dashboard
- 🔔 Real-time notifications
- 🧭 Location-based recommendations

---

# 📸 Screenshots

Add screenshots of the major pages here:

### Home Page

```text
Add screenshot here
```

### Listing Details

```text
Add screenshot here
```

### Create Listing

```text
Add screenshot here
```

### Login / Signup

```text
Add screenshot here
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git add .
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is created for educational and portfolio purposes.

---

# 👨‍💻 Author

**Sanket Kale**

### Full-Stack Web Developer

Interested in:

- Full-Stack Development
- Backend Development
- MongoDB
- Node.js
- Express.js
- Software Engineering

---

## ⭐ If You Like This Project

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

### Built With ❤️ Using

```text
HTML • CSS • JavaScript • Bootstrap
Node.js • Express.js • EJS
MongoDB • Mongoose
Git • GitHub
```
