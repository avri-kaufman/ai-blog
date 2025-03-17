- **Backend**:
  - **Flask** server with routes split by Blueprints (users, posts, comments).
  - Services containing business logic (auth, user, post, comment).
  - Models for direct DB queries (`db_connection.py`, etc.).
- **Frontend** ():
  - **React** app.
  - Communicates with Flask via API endpoints.

---

## Features

1. **User Authentication**:  
   - Register a new user (`/SignUp`)  
   - Login (`/Login`) and session management with cookies  
   - Logout (`/Logout`)

2. **Posts**:
   - Create a new post (needs login)  
   - Read all posts  
   - Edit or delete your own posts  
   - View count increment

3. **Comments**:
   - Add a comment to a post  
   - Fetch comments for a post

4. **Search**:
   - Basic text search on post content (`/search?q=...`)

5. **React Frontend**:
   - Modern single-page app (SPA)  
   - Communicates with Flask via JSON endpoints

---

## Getting Started

### Prerequisites
- **Python 3.7+**  
- **Node.js + npm** (or **yarn**)  
- **MySQL** server  
- (Optional) **virtualenv** or similar Python environment manager  

1. **Clone** the repository:
   ```bash
   git clone https://github.com/avri-kaufman/ai-blog.git

   ```

2. **Navigate** to the backend folder:
   ```bash
   cd server
   ```

3. **Create and activate a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or on Windows
   venv\Scripts\activate
   ```

---

## Backend Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure MySQL**:  
   - Create a MySQL database named `blogdb` (or update `config.py` to match yours).  
   - Run any schema scripts (if you have a `.sql` file setting up your tables).

3. **(Optional) Use .env**:  
   - Create a `.env` file with your secrets (DB credentials, etc.).  
   - Update `config.py` to load environment variables from `.env`.

4. **Run migrations** (if applicable):  
   - If you have a migrations script or use something like Alembic, run it to create tables. Otherwise, ensure your DB has the required schema.

---

## Frontend Setup

1. **Go to the `frontend` folder**:
   ```bash
   cd ../frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the React dev server**:
   ```bash
   npm start
   ```
   - By default, this runs at [http://127.0.0.1:3000](http://127.0.0.1:3000).

---

## Environment Variables

You can store sensitive info in a `.env` file (or environment variables) so they’re **not** committed to version control. For example:

```bash
# .env
FLASK_DEBUG=True
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=blogdb
DB_POOL_NAME=blog_avi
DB_POOL_SIZE=5
```

Then in `config.py`, load them via [python-dotenv](https://pypi.org/project/python-dotenv/):

```python
from dotenv import load_dotenv
load_dotenv()
```

---

## Database Schema

Here are the main tables:

1. **users**  
   - id, username, email, password, created_at

2. **sessions**  
   - session_id, user_id

3. **categories**  
   - id, name

4. **posts**  
   - id, title, content, user_id, category_id, views, created_at, updated_at

5. **comments**  
   - id, content, user_id, post_id, created_at

Refer to any migrations or `.sql` files for the exact schema definition.

---

## Running in Development

1. **Start the Flask Server**:
   ```bash
   # in my_blog_project folder
   python run.py
   ```
   This should run on [http://127.0.0.1:5000](http://127.0.0.1:5000) by default.

2. **Start the React App**:
   ```bash
   # in frontend folder
   npm start
   ```
   This runs on [http://127.0.0.1:3000](http://127.0.0.1:3000).

In development, you’ll have two servers:
- **Flask** on port 5000  
- **React** on port 3000  

You can configure a **proxy** in `package.json` or use environment variables to make requests from React to Flask.

---
