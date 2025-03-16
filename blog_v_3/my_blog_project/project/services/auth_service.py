# project/services/auth_service.py
import uuid
import bcrypt
from flask import request, abort, make_response
from project.models.session_model import (
    create_session, get_user_id_by_session, delete_session
)
from project.models.user_model import get_user_auth

def login(username, password):
    record = get_user_auth(username)  # (id, username, hashed_pass) or None
    if not record:
        abort(401, description="User not found")
    
    user_id, _, hashed_pass = record
    # Check password
    if not bcrypt.checkpw(password.encode('utf-8'), hashed_pass.encode('utf-8')):
        abort(401, description="Wrong password")

    # Create session
    session_id = str(uuid.uuid4())
    create_session(user_id, session_id)

    # Return a response with a cookie set
    resp = make_response({"status": "success", "message": "Logged in", "session_id": session_id})
    resp.set_cookie("session_id", session_id)
    return resp

def check_login_status():
    session_id = request.cookies.get('session_id')
    if not session_id:
        return {"status": "error", "message": "Not logged in"}
    user_id = get_user_id_by_session(session_id)
    if not user_id:
        return {"status": "error", "message": "Not logged in"}
    return {"status": "success", "message": "Logged in", "user_id": user_id}

def logout():
    session_id = request.cookies.get('session_id')
    if session_id:
        delete_session(session_id)
    resp = make_response({"message": "User logged out successfully"})
    # Clear the cookie
    resp.set_cookie("session_id", "", expires=0)
    return resp
