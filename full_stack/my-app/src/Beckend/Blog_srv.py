import uuid
import bcrypt
import json
from settings import dbpwd
import mysql.connector as mysql
from flask_cors import CORS
from flask import Flask, request, abort, make_response, redirect
from datetime import datetime
from functools import wraps
from flask import g


pool = mysql.pooling.MySQLConnectionPool(
    host="localhost",
    user="root",
    password=dbpwd,
    database="blogdb",
    buffered=True,
    pool_size=5,
    pool_name="blog_avi"
)


# db = mysql.connect(
#     host="database-avi.cbrdyb6rueag.eu-central-1.rds.amazonaws.com",
#     user="admin",
#     password="19091994Avi",
#     database="blogdb",
# )

app = Flask(__name__)

@app.route('/SignUp', methods=['POST'])
def signup():
    db = pool.get_connection()
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = bcrypt.hashpw(
        str(data['password']).encode('utf8'), bcrypt.gensalt())
    created_at = datetime.now()

    query = "INSERT INTO users (username, email, password, created_at) VALUES (%s, %s, %s, %s)"
    values = (username, email, password, created_at)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_user = cursor.lastrowid
    cursor.close()
    db.close()
    return get_user_by_id(new_user)


def get_user_by_id(user_id):
    db = pool.get_connection()
    query = "select username, email, password, created_at from users where id = %s"
    value = (user_id,)
    cursor = db.cursor()
    cursor.execute(query, value)
    record = cursor.fetchone()
    cursor.close()
    db.close()
    record = list(record)
    record[3] = record[3].strftime("%Y-%m-%d %H:%M:%S")
    header = ['username', "email", "hash_passowrd", "created_at"]
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
        abort(401)

    user_id = record[0]
    hashed_pwd = record[2]

    if not bcrypt.checkpw(data['password'].encode('utf-8'), hashed_pwd.encode('utf-8')):
        abort(401)

    query = "insert into  sessions (user_id, session_id) values (%s, %s)"
    session_id = str(uuid.uuid4())
    values = (record[0], session_id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    db.close()
    resp = make_response()
    resp.set_cookie("session_id", value=session_id)
    return resp


# def login_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         db = pool.get_connection()
#         session_id = request.cookies.get('session_id')
#         if session_id is None:
#             abort(401)
#         cursor = db.cursor()
#         query = "SELECT user_id FROM sessions WHERE session_id = %s"
#         values = (session_id,)
#         cursor.execute(query, values)
#         result = cursor.fetchone()
#         cursor.close()
#         if result is None:
#             abort(401)
#         g.user_id = result[0]
#         db.close()
#         return f(*args, **kwargs)
#     return decorated_function


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
    db = pool.get_connection()
    try:
        
        curser = db.cursor()
        query = "SELECT id, title, content, user_id, category_id, created_at, updated_at FROM Posts"
        curser.execute(query)
        records = curser.fetchall()
        header = ["id", "title", "content", "user_id",
                  "category_id", "created_at", "updated_at"]

        data = []
        for record in records:
            record = list(record)
            query = "SELECT name FROM categories WHERE id = %s"
            values = (str(record[4]),)
            curser.execute(query, values)
            category_name = curser.fetchone()
            if category_name:
                record[4] = category_name[0]
            else:
                record[4] = 'Category not found'
            record[5] = record[5].strftime("%Y-%m-%d %H:%M:%S")
            record[6] = record[6].strftime("%Y-%m-%d %H:%M:%S")
            data.append(dict(zip(header, record)))

        curser.close()
        db.close()
        return json.dumps(data)
    except Exception as ex:
        print(ex)


@app.route('/posts', methods=['POST'])
#@login_required
def add_new_post():
    db = pool.get_connection()
    data = request.get_json
    query = 'insert into Posts (title, content, user_id, category_id)values(%s, %s, %s, %s)'
    values = (data['title'], data['content'], 1, 1)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_post_id = cursor.lastrowid
    cursor.close()
    db.close()
    return get_single_post(new_post_id)


@app.route('/posts/<post_id>', methods=['GET'])
def get_single_post(post_id):
    db = pool.get_connection()
    cursor = db.cursor()
    query = "SELECT id, title, content, user_id, category_id, created_at, updated_at FROM Posts WHERE id = %s"
    values = (post_id,)
    cursor.execute(query, values)
    record = cursor.fetchone()

    if not record:
        abort(404)

    record = list(record)

    # Fetch the category name
    query = "SELECT name FROM categories WHERE id = %s"
    values = (str(record[4]),)
    cursor.execute(query, values)
    category_name = cursor.fetchone()
    if category_name:
        record[4] = category_name[0]
    else:
        record[4] = 'Category not found'

    record[5] = record[5].strftime("%Y-%m-%d %H:%M:%S")
    record[6] = record[6].strftime("%Y-%m-%d %H:%M:%S")
    header = ["id", "title", "content", "user_id",
              "category_id", "created_at", "updated_at"]

    cursor.close()
    db.close()
    return json.dumps(dict(zip(header, record)))

# need to fix the js code on the search post... button
# @app.route('/search', methods=['GET'])
# def search():
#     try:
#         query = request.args.get('q')
#         cursor = db.cursor()
#         search_query = f"SELECT id, title, content, user_id, category_id, created_at, updated_at FROM Posts WHERE content LIKE '%%{query}%%'"
#         cursor.execute(search_query)
#         records = cursor.fetchall()

#         if not records:
#             abort(404)

#         header = ["id", "title", "content", "user_id",
#                   "category_id", "created_at", "updated_at"]
#         data = []
#         for record in records:
#             record = list(record)

#             # Fetch the category name
#             query = "SELECT name FROM categories WHERE id = %s"
#             values = (str(record[4]),)
#             cursor.execute(query, values)
#             category_name = cursor.fetchone()
#             if category_name:
#                 record[4] = category_name[0]
#             else:
#                 record[4] = 'Category not found'

#             record[5] = record[5].strftime("%Y-%m-%d %H:%M:%S")
#             record[6] = record[6].strftime("%Y-%m-%d %H:%M:%S")
#             data.append(dict(zip(header, record)))

#         cursor.close()
#         return json.dumps(data)

#     except Exception as ex:
#         print(ex)


if __name__ == "__main__":
    app.run()
