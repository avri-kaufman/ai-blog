import uuid
import bcrypt
import json
import mysql.connector as mysql
from flask import Flask, request, jsonify, abort, make_response, redirect
from datetime import datetime


pool = mysql.pooling.MySQLConnectionPool(
    host='localhost',
    user="root",
    password='avi19091994',
    database="blogdb",
    buffered=True,
    pool_size=5,
    pool_name="blog_avi"
)

app = Flask(__name__,
            static_folder="../client/build",
            static_url_path='/')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/popular_posts', methods=['GET'])
def get_popular_posts():
    db = pool.get_connection()
    cursor = db.cursor()
    limit = 3
    values = (limit, )
    query = "SELECT id, title FROM posts ORDER BY views DESC LIMIT %s"
    cursor.execute(query, values)
    records = cursor.fetchall()
    header = ["id", "title"]
    cursor.close()
    db.close()
    data = []
    for r in records:
        data.append(dict(zip(header, r)))
    return json.dumps(data)


@app.route('/increment_view/<int:post_id>', methods=['POST'])
def increment_view(post_id):
    # Increment the view count for the specified post in the database
    # Return a success response
    db = pool.get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT views FROM posts WHERE id = %s", (post_id,))
    current_views = cursor.fetchone()
    if not current_views:
        db.close()
        abort(500)

    new_views = current_views[0] + 1
    cursor.execute("UPDATE posts SET views = %s WHERE id = %s",
                   (new_views, post_id))
    db.commit()
    cursor.close()
    db.close()
    return str(new_views)


@app.route('/SignUp', methods=['POST'])
def signup():
    db = pool.get_connection()
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = bcrypt.hashpw(
        str(data['password']).encode('utf8'), bcrypt.gensalt())# TODO: need to read more about that
    created_at = datetime.now()

    query = "INSERT INTO users (username, email, password, created_at) VALUES (%s, %s, %s, %s)"
    values = (username, email, password, created_at)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_user_id = cursor.lastrowid
    cursor.close()
    db.close()

    return get_user_by_id(new_user_id)


@app.route('/user/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    db = pool.get_connection()
    query = "select username, email, created_at from users where id = %s"
    value = (user_id,)
    cursor = db.cursor()
    cursor.execute(query, value)
    record = cursor.fetchone()
    cursor.close()
    db.close()
    record = list(record)
    record[2] = record[2].strftime("%Y-%m-%d %H:%M:%S")
    header = ['username', "email", "created_at"]
    return json.dumps(dict(zip(header, record)))


@app.route('/Login', methods=['POST'])
def login():
    db = pool.get_connection()
    data = request.get_json()
    query = "select id, username, password from users where username = %s"
    values = (data['user'],)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()

    if not record:
        db.close()
        abort(401)

    user_id = record[0]
    hashed_pwd = record[2]

    if not bcrypt.checkpw(data['password'].encode('utf-8'), hashed_pwd.encode('utf-8')):
        db.close()
        abort(401)

    query = "insert into  sessions (user_id, session_id) values (%s, %s)"
    session_id = str(uuid.uuid4())
    values = (record[0], session_id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()
    resp = make_response(
        {"status": "success", "message": "Logged in successfully", "session_id": session_id})#why do we need session id twice
    resp.set_cookie("session_id", value=session_id)
    return resp


@app.route('/login_status', methods=['GET'])
def check_login_status():
    db = pool.get_connection()
    session_id = request.cookies.get('session_id')
    if session_id:
        cursor = db.cursor()
        query = "SELECT user_id FROM sessions WHERE session_id = %s"
        values = (session_id,)
        cursor.execute(query, values)
        result = cursor.fetchone()
        cursor.close()
        db.close()
        if result:
            return {"status": "success", "message": "Logged in", "user_id": result[0]}
    db.close()
    return {"status": "error", "message": "Not logged in"}


@app.route('/Logout', methods=['POST'])
def logout():
    db = pool.get_connection()
    session_id = request.cookies.get('session_id')

    if session_id:
        # Remove session record from the sessions table
        query = "DELETE FROM sessions WHERE session_id = %s"
        values = (session_id,)
        cursor = db.cursor()
        cursor.execute(query, values)
        db.commit()
        cursor.close()

    # Clear session cookies
    resp = make_response("user logout seccesfuly")
    resp.set_cookie("session_id", "", expires=0)
    db.close()
    return resp


@app.route('/posts', methods=['GET'])
def get_all_posts():
    try:
        db = pool.get_connection()
        cursor = db.cursor()
        query = """
        SELECT posts.id, posts.title, posts.content, posts.user_id, categories.name, posts.created_at, posts.updated_at 
        FROM Posts AS posts
        LEFT JOIN categories ON posts.category_id = categories.id
        """
        cursor.execute(query)
        records = cursor.fetchall()
        header = ["id", "title", "content", "user_id",
                  "category_name", "created_at", "updated_at"]

        data = []
        for record in records:
            record = list(record)
            record[4] = record[4] if record[4] else 'Category not found'
            record[5] = record[5].strftime("%Y-%m-%d %H:%M:%S")
            record[6] = record[6].strftime("%Y-%m-%d %H:%M:%S")
            data.append(dict(zip(header, record)))

        cursor.close()
        db.close()
        return json.dumps(data)
    except Exception as ex:
        print(ex)


@app.route('/posts', methods=['POST'])
def add_new_post():
    login_status = check_login_status()

    if login_status["status"] == "error":
        return make_response(jsonify({'message': 'You need to log in to add a new post.'}), 401)

    user_id = login_status["user_id"]

    db = pool.get_connection()
    data = request.get_json()
    query = 'insert into Posts (title, content, user_id, category_id) values(%s, %s, %s, %s)'
    values = (data['title'], data['content'], user_id, 1)

    cursor = db.cursor()
    cursor.execute(query, values)

    db.commit()

    new_post_id = cursor.lastrowid
    cursor.close()
    db.close()

    return get_single_post(new_post_id)


@app.route('/posts/<post_id>', methods=['PUT'])
def edit_post(post_id):
    login_status = check_login_status()

    if login_status["status"] == "error":
        return make_response(jsonify({'message': 'You need to log in to edit a post.'}), 401)

    user_id = login_status["user_id"]

    db = pool.get_connection()
    data = request.get_json()

    cursor = db.cursor()

    # Get the original post to check the author
    query = 'SELECT user_id FROM Posts WHERE id = %s'
    values = (post_id,)
    cursor.execute(query, values)
    result = cursor.fetchone()

    if result is None or result[0] != user_id:
        return make_response(jsonify({'message': 'You are not authorized to edit this post.'}), 403)

    # Update the post
    query = 'UPDATE Posts SET title = %s, content = %s WHERE id = %s'
    # need to update last update
    values = (data['title'], data['content'], post_id)
    cursor.execute(query, values)

    db.commit()

    cursor.close()
    db.close()

    return get_single_post(post_id)


@app.route('/posts/<post_id>', methods=['GET'])
def get_single_post(post_id):
    db = pool.get_connection()
    cursor = db.cursor()
    query = "SELECT p.id, p.title, p.content, p.user_id, p.category_id, p.created_at, p.updated_at, u.username AS author, c.name AS category_name FROM Posts p JOIN users u ON p.user_id = u.id JOIN categories c ON p.category_id = c.id WHERE p.id = %s"
    values = (post_id,)
    cursor.execute(query, values)
    record = cursor.fetchone()

    if not record:
        db.close()
        abort(404)

    record = list(record)

    record[5] = record[5].strftime("%Y-%m-%d %H:%M:%S")
    record[6] = record[6].strftime("%Y-%m-%d %H:%M:%S")
    header = ["id", "title", "content", "user_id", "category_id",
              "created_at", "updated_at", "author", "category_name"]

    cursor.close()
    db.close()
    return json.dumps(dict(zip(header, record)))


@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    db = pool.get_connection()
    cursor = db.cursor()

    # Get the session_id from the request cookies
    session_id = request.cookies.get('session_id')

    if not session_id:
        return {"status": "error", "message": "Not logged in"}, 403

    # Fetch the logged-in user_id
    query = "SELECT user_id FROM sessions WHERE session_id = %s"
    values = (session_id,)
    cursor.execute(query, values)
    result = cursor.fetchone()

    if not result:
        return {"status": "error", "message": "Not logged in"}, 403

    user_id = result[0]

    # Fetch the author of the post
    query = "SELECT user_id FROM Posts WHERE id = %s"
    values = (post_id,)
    cursor.execute(query, values)
    result = cursor.fetchone()

    if not result:
        return {"status": "error", "message": "Post not found"}, 404

    post_author_id = result[0]

    # Compare logged-in user_id and post author's user_id
    if user_id != post_author_id:
        return {"status": "error", "message": "Permission denied"}, 403

    # Delete comments associated with the post
    query = "DELETE FROM comments WHERE post_id = %s"
    values = (post_id,)
    cursor.execute(query, values)

    # Delete the post
    query = "DELETE FROM Posts WHERE id = %s"
    cursor.execute(query, values)

    db.commit()
    cursor.close()
    db.close()

    return {"status": "success", "message": "Post deleted"}, 200


@app.route('/posts/<post_id>/comments', methods=['GET'])
def get_comments_by_post(post_id):
    db = pool.get_connection()
    cursor = db.cursor()
    query = "SELECT c.id, c.content, c.user_id, c.created_at, u.username AS author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = %s"
    values = (post_id,)
    cursor.execute(query, values)
    records = cursor.fetchall()

    if not records:
        db.close()
        abort(404)

    data = []
    for record in records:
        record = list(record)
        record[3] = record[3].strftime("%Y-%m-%d %H:%M:%S")
        header = ["id", "content", "user_id", "created_at", "author"]
        data.append(dict(zip(header, record)))

    cursor.close()
    db.close()
    return json.dumps(data)


@app.route('/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    login_status = check_login_status()

    if login_status["status"] == "error":
        return make_response(jsonify({'message': 'You need to log in to add a comment.'}), 401)

    user_id = login_status["user_id"]

    db = pool.get_connection()
    data = request.get_json()
    content = data['content']

    cursor = db.cursor()
    query = "INSERT INTO comments (content, user_id, post_id, created_at) VALUES (%s, %s, %s, Now())"
    values = (content, user_id, post_id)
    cursor.execute(query, values)
    db.commit()

    new_comment_id = cursor.lastrowid
    cursor.close()
    db.close()

    return get_single_comment(new_comment_id)


def get_single_comment(comment_id):
    db = pool.get_connection()
    cursor = db.cursor()
    query = "SELECT c.id, c.content, c.user_id, c.created_at, u.username AS author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = %s"
    values = (comment_id,)
    cursor.execute(query, values)
    record = cursor.fetchone()

    if not record:
        db.close()
        abort(404)

    record = list(record)
    record[3] = record[3].strftime("%Y-%m-%d %H:%M:%S")
    header = ["id", "content", "user_id", "created_at", "author"]
    result = dict(zip(header, record))

    cursor.close()
    db.close()
    return json.dumps(result)


@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')

    if not query:
        return make_response(jsonify({"message": "Query parameter 'q' is required!"}), 400)

    try:
        db = pool.get_connection()
        cursor = db.cursor()

        # Using LIKE for a case-insensitive search in a standard SQL fashion.
        # Adjust the SQL syntax according to your database system if necessary.
        search_query = """
        SELECT posts.id, posts.title, posts.content, posts.user_id, categories.name AS category_name, posts.created_at, posts.updated_at 
        FROM Posts AS posts
        LEFT JOIN categories ON posts.category_id = categories.id
        WHERE posts.content LIKE %s
        """
        search_value = ("%" + query + "%",)

        cursor.execute(search_query, search_value)
        records = cursor.fetchall()
        header = ["id", "title", "content", "user_id",
                  "category_name", "created_at", "updated_at"]

        data = []
        for record in records:
            record = list(record)
            record[4] = record[4] if record[4] else 'Category not found'
            record[5] = record[5].strftime("%Y-%m-%d %H:%M:%S")
            record[6] = record[6].strftime("%Y-%m-%d %H:%M:%S")
            data.append(dict(zip(header, record)))

        cursor.close()
        db.close()
        return json.dumps(data)

    except Exception as ex:
        print(ex)
        return make_response(jsonify({"message": "An error occurred while searching."}), 500)


if __name__ == "__main__":
    app.run()
