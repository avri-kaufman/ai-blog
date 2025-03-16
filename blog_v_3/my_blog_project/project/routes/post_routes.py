# project/routes/post_routes.py
from flask import Blueprint, request, jsonify, abort
from project.services.post_service import (
    get_popular_posts, increment_view, get_all_posts,
    create_new_post, get_single_post, edit_post, delete_post, search_in_posts
)
from project.services.auth_service import check_login_status

post_bp = Blueprint("post_bp", __name__)

@post_bp.route("/popular_posts", methods=["GET"])
def popular_posts():
    records = get_popular_posts(limit=3)
    data = []
    for r in records:
        data.append({"id": r[0], "title": r[1]})
    return jsonify(data)

@post_bp.route("/increment_view/<int:post_id>", methods=["POST"])
def increment_view_count(post_id):
    new_count = increment_view(post_id)
    return str(new_count)

@post_bp.route("/posts", methods=["GET"])
def list_all_posts():
    records = get_all_posts()
    data = []
    for r in records:
        # r = (id, title, content, user_id, category_name, created_at, updated_at)
        data.append({
            "id": r[0],
            "title": r[1],
            "content": r[2],
            "user_id": r[3],
            "category_name": r[4] if r[4] else "Category not found",
            "created_at": r[5].strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": r[6].strftime("%Y-%m-%d %H:%M:%S"),
        })
    return jsonify(data)

@post_bp.route("/posts", methods=["POST"])
def add_new_post():
    # Must be logged in
    status = check_login_status()
    if status["status"] == "error":
        return jsonify({"message": "You need to log in to add a new post."}), 401
    
    data = request.get_json()
    user_id = status["user_id"]
    title = data["title"]
    content = data["content"]

    new_post_id = create_new_post(title, content, user_id)
    post = get_single_post(new_post_id)  # returns the DB record
    
    # post = (id, title, content, user_id, category_id, created_at, updated_at, author, category_name)
    result = {
        "id": post[0],
        "title": post[1],
        "content": post[2],
        "user_id": post[3],
        "category_id": post[4],
        "created_at": post[5].strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": post[6].strftime("%Y-%m-%d %H:%M:%S"),
        "author": post[7],
        "category_name": post[8],
    }
    return jsonify(result)

@post_bp.route("/posts/<int:post_id>", methods=["GET"])
def get_one_post(post_id):
    record = get_single_post(post_id)
    # record = (id, title, content, user_id, category_id, created_at, updated_at, author, category_name)
    result = {
        "id": record[0],
        "title": record[1],
        "content": record[2],
        "user_id": record[3],
        "category_id": record[4],
        "created_at": record[5].strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": record[6].strftime("%Y-%m-%d %H:%M:%S"),
        "author": record[7],
        "category_name": record[8],
    }
    return jsonify(result)

@post_bp.route("/posts/<int:post_id>", methods=["PUT"])
def update_existing_post(post_id):
    status = check_login_status()
    if status["status"] == "error":
        return jsonify({"message": "You need to log in to edit a post."}), 401

    data = request.get_json()
    title = data["title"]
    content = data["content"]

    post_record = edit_post(post_id, title, content, status["user_id"])
    # post_record is the updated one
    result = {
        "id": post_record[0],
        "title": post_record[1],
        "content": post_record[2],
        "user_id": post_record[3],
        "category_id": post_record[4],
        "created_at": post_record[5].strftime("%Y-%m-%d %H:%M:%S"),
        "updated_at": post_record[6].strftime("%Y-%m-%d %H:%M:%S"),
        "author": post_record[7],
        "category_name": post_record[8],
    }
    return jsonify(result)

@post_bp.route("/posts/<int:post_id>", methods=["DELETE"])
def remove_post(post_id):
    status = check_login_status()
    if status["status"] == "error":
        return {"status": "error", "message": "Not logged in"}, 403
    
    success = delete_post(post_id, status["user_id"])
    if not success:
        abort(404, description="Post not found")  # or handle differently
    return {"status": "success", "message": "Post deleted"}, 200

@post_bp.route("/search", methods=["GET"])
def search():
    query_str = request.args.get('q')
    if not query_str:
        return {"message": "Query parameter 'q' is required!"}, 400
    
    records = search_in_posts(query_str)
    data = []
    for r in records:
        # r = (id, title, content, user_id, category_name, created_at, updated_at)
        data.append({
            "id": r[0],
            "title": r[1],
            "content": r[2],
            "user_id": r[3],
            "category_name": r[4] if r[4] else "Category not found",
            "created_at": r[5].strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": r[6].strftime("%Y-%m-%d %H:%M:%S"),
        })
    return jsonify(data)
