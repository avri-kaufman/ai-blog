# project/services/user_service.py
import bcrypt
from datetime import datetime
from project.models.user_model import insert_user, get_user_by_id as model_get_user_by_id

def signup_user(username, email, password):
    hashed_pwd = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    created_at = datetime.now()
    new_user_id = insert_user(username, email, hashed_pwd.decode('utf-8'), created_at)
    return new_user_id

def get_user_by_id(user_id):
    record = model_get_user_by_id(user_id)
    # record is (username, email, created_at)
    return record
