# project/models/comment_model.py
from project.models.db_connection import get_connection

def fetch_comments_by_post(post_id):
    db = get_connection()
    cursor = db.cursor()
    query = """
        SELECT c.id, c.content, c.user_id, c.created_at, u.username AS author
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = %s
    """
    cursor.execute(query, (post_id,))
    records = cursor.fetchall()
    cursor.close()
    db.close()
    return records

def insert_comment(content, user_id, post_id):
    db = get_connection()
    cursor = db.cursor()
    query = """
        INSERT INTO comments (content, user_id, post_id, created_at)
        VALUES (%s, %s, %s, NOW())
    """
    cursor.execute(query, (content, user_id, post_id))
    db.commit()
    new_id = cursor.lastrowid
    cursor.close()
    db.close()
    return new_id

def fetch_comment_by_id(comment_id):
    db = get_connection()
    cursor = db.cursor()
    query = """
        SELECT c.id, c.content, c.user_id, c.created_at, u.username AS author
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = %s
    """
    cursor.execute(query, (comment_id,))
    record = cursor.fetchone()
    cursor.close()
    db.close()
    return record
