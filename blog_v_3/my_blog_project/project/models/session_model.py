# project/models/session_model.py
from project.models.db_connection import get_connection

def create_session(user_id, session_id):
    db = get_connection()
    cursor = db.cursor()
    query = "INSERT INTO sessions (user_id, session_id) VALUES (%s, %s)"
    cursor.execute(query, (user_id, session_id))
    db.commit()
    cursor.close()
    db.close()

def get_user_id_by_session(session_id):
    db = get_connection()
    cursor = db.cursor()
    query = "SELECT user_id FROM sessions WHERE session_id = %s"
    cursor.execute(query, (session_id,))
    record = cursor.fetchone()
    cursor.close()
    db.close()
    if record:
        return record[0]
    return None

def delete_session(session_id):
    db = get_connection()
    cursor = db.cursor()
    query = "DELETE FROM sessions WHERE session_id = %s"
    cursor.execute(query, (session_id,))
    db.commit()
    cursor.close()
    db.close()
