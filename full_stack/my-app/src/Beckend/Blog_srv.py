import uuid
import bcrypt
import json
from settings import dbpwd
import mysql.connector as mysql
from flask import Flask, request,jsonify,  abort, make_response, redirect
from datetime import datetime
from functools import wraps



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

@app.route('/get_user_by_id/<user_id>', methods=['GET'])
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
    resp = make_response({"status": "success", "message": "Logged in successfully", "session_id": session_id})
    resp.set_cookie("session_id", value=session_id)
    return resp


@app.route('/check_login_status', methods=['GET'])
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
    values = (data['title'], data['content'], post_id)#need to update last update
    cursor.execute(query, values)

    db.commit()

    cursor.close()
    db.close()

    return get_single_post(post_id)



@app.route('/posts/<post_id>', methods=['GET'])
def get_single_post(post_id):
    db = pool.get_connection()
    cursor = db.cursor()
    query = "SELECT p.id, p.title, p.content, p.user_id, p.category_id, p.created_at, p.updated_at, u.username AS author FROM Posts p JOIN users u ON p.user_id = u.id WHERE p.id = %s"
    values = (post_id,)
    cursor.execute(query, values)
    record = cursor.fetchone()

    if not record:
        db.close()
        abort(404)

    record = list(record)

    record[5] = record[5].strftime("%Y-%m-%d %H:%M:%S")
    record[6] = record[6].strftime("%Y-%m-%d %H:%M:%S")
    header = ["id", "title", "content", "user_id", "category_id", "created_at", "updated_at", "author"]

    cursor.close()
    db.close()
    return json.dumps(dict(zip(header, record)))



@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    db = pool.get_connection()
    cursor = db.cursor()

    # Get the session_id from the request cookies
    session_id = request.cookies.get('session_id')

    if session_id:
        # Fetch the logged-in user_id
        query = "SELECT user_id FROM sessions WHERE session_id = %s"
        values = (session_id,)
        cursor.execute(query, values)
        result = cursor.fetchone()

        if result:
            user_id = result[0]
            # Fetch the author of the post
            query = "SELECT user_id FROM Posts WHERE id = %s"
            values = (post_id,)
            cursor.execute(query, values)
            result = cursor.fetchone()

            if result:
                post_author_id = result[0]
                # Compare logged-in user_id and post author's user_id
                if user_id == post_author_id:
                    # If match, proceed to delete the post
                    query = "DELETE FROM Posts WHERE id = %s"
                    values = (post_id,)
                    cursor.execute(query, values)
                    db.commit()
                    cursor.close()
                    db.close()
                    return {"status": "success", "message": "Post deleted"}, 200
                else:
                    return {"status": "error", "message": "Permission denied"}, 403
            else:
                return {"status": "error", "message": "Post not found"}, 404
        else:
            return {"status": "error", "message": "Not logged in"}, 403
    else:
        return {"status": "error", "message": "Not logged in"}, 403


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
        header = ["id", "conte\nt", "user_id", "created_at", "author"]
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
    query = "INSERT INTO comments (content, user_id, post_id) VALUES (%s, %s, %s, Now())"
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


if __name__ == "__main__":
    app.run()
