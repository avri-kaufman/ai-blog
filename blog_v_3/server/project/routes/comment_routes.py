# project/routes/comment_routes.py
from flask import Blueprint, request, jsonify
from project.services.comment_service import (
    get_comments_for_post, add_comment_to_post
)
from project.services.auth_service import check_login_status

comment_bp = Blueprint("comment_bp", __name__)

# GET /posts/<post_id>/comments
@comment_bp.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments_by_post(post_id):
    records = get_comments_for_post(post_id)
    data = []
    for r in records:
        # r = (comment_id, content, user_id, created_at, author)
        data.append({
            "id": r[0],
            "content": r[1],
            "user_id": r[2],
            "created_at": r[3].strftime("%Y-%m-%d %H:%M:%S"),
            "author": r[4],
        })
    return jsonify(data)

# POST /posts/<post_id>/comments
@comment_bp.route("/posts/<int:post_id>/comments", methods=["POST"])
def add_comment(post_id):
    status = check_login_status()
    if status["status"] == "error":
        return jsonify({"message": "You need to log in to add a comment."}), 401

    data = request.get_json()
    user_id = status["user_id"]
    content = data["content"]

    new_comment = add_comment_to_post(post_id, user_id, content)
    # new_comment = (id, content, user_id, created_at, author)
    result = {
        "id": new_comment[0],
        "content": new_comment[1],
        "user_id": new_comment[2],
        "created_at": new_comment[3].strftime("%Y-%m-%d %H:%M:%S"),
        "author": new_comment[4],
    }
    return jsonify(result)
