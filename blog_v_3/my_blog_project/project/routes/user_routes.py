# project/routes/user_routes.py
from flask import Blueprint, request, jsonify, abort
from project.services.user_service import signup_user, get_user_by_id
from project.services.auth_service import login, check_login_status, logout

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/SignUp", methods=["POST"])
def signup():
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = data["password"]

    new_user_id = signup_user(username, email, password)
    user_record = get_user_by_id(new_user_id)
    # user_record is (username, email, created_at)
    result = {
        "username": user_record[0],
        "email": user_record[1],
        "created_at": user_record[2].strftime("%Y-%m-%d %H:%M:%S")
    }
    return jsonify(result)

@user_bp.route("/user/<user_id>", methods=["GET"])
def get_user_info(user_id):
    record = get_user_by_id(user_id)
    if not record:
        abort(404, description="User not found")
    result = {
        "username": record[0],
        "email": record[1],
        "created_at": record[2].strftime("%Y-%m-%d %H:%M:%S")
    }
    return jsonify(result)

@user_bp.route("/Login", methods=["POST"])
def user_login():
    data = request.get_json()
    username = data["user"]
    password = data["password"]
    return login(username, password)

@user_bp.route("/login_status", methods=["GET"])
def login_status():
    status = check_login_status()
    return jsonify(status)

@user_bp.route("/Logout", methods=["POST"])
def user_logout():
    return logout()
