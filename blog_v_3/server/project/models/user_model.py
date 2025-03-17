# project/models/user_model.py
from project.models.db_connection import get_connection

def insert_user(username, email, hashed_password, created_at):
    db = get_connection()
    cursor = db.cursor()
    query = """
        INSERT INTO users (username, email, password, created_at)
        VALUES (%s, %s, %s, %s)
    """
    values = (username, email, hashed_password, created_at)
    cursor.execute(query, values)
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    db.close()
    return new_id

def get_user_by_id(user_id):
    db = get_connection()
    cursor = db.cursor()
    query = "SELECT username, email, created_at FROM users WHERE id = %s"
    cursor.execute(query, (user_id,))
    record = cursor.fetchone()
    cursor.close()
    db.close()
    return record  # could be None if not found

def get_user_auth(username):
    """
    Return user's id, username, and hashed password for login checks.
    """
    db = get_connection()
    cursor = db.cursor()
    query = "SELECT id, username, password FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    record = cursor.fetchone()
    cursor.close()
    db.close()
    return record
