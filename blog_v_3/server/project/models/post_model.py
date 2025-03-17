# project/models/post_model.py
from project.models.db_connection import get_connection

def fetch_popular_posts(limit=3):
    db = get_connection()
    cursor = db.cursor()
    query = "SELECT id, title FROM posts ORDER BY views DESC LIMIT %s"
    cursor.execute(query, (limit,))
    records = cursor.fetchall()
    cursor.close()
    db.close()
    return records

def increment_post_views(post_id):
    """
    Returns new view count or None if post not found.
    """
    db = get_connection()
    cursor = db.cursor()
    cursor.execute("SELECT views FROM posts WHERE id = %s", (post_id,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        db.close()
        return None
    
    current_views = row[0]
    new_views = current_views + 1
    cursor.execute("UPDATE posts SET views = %s WHERE id = %s", (new_views, post_id))
    db.commit()
    cursor.close()
    db.close()
    return new_views

def fetch_all_posts():
    db = get_connection()
    cursor = db.cursor()
    query = """
    SELECT p.id, p.title, p.content, p.user_id, c.name AS category_name,
           p.created_at, p.updated_at
    FROM Posts p
    LEFT JOIN categories c ON p.category_id = c.id
    """
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    db.close()
    return records

def insert_post(title, content, user_id, category_id=1):
    db = get_connection()
    cursor = db.cursor()
    query = """
        INSERT INTO Posts (title, content, user_id, category_id, created_at, updated_at)
        VALUES (%s, %s, %s, %s, NOW(), NOW())
    """
    cursor.execute(query, (title, content, user_id, category_id))
    db.commit()
    post_id = cursor.lastrowid
    cursor.close()
    db.close()
    return post_id

def fetch_post_by_id(post_id):
    db = get_connection()
    cursor = db.cursor()
    query = """
        SELECT p.id, p.title, p.content, p.user_id, p.category_id,
               p.created_at, p.updated_at, u.username AS author,
               c.name AS category_name
        FROM Posts p
        JOIN users u ON p.user_id = u.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = %s
    """
    cursor.execute(query, (post_id,))
    record = cursor.fetchone()
    cursor.close()
    db.close()
    return record

def fetch_post_author(post_id):
    """
    Returns user_id of the post's author or None if not found.
    """
    db = get_connection()
    cursor = db.cursor()
    query = "SELECT user_id FROM Posts WHERE id = %s"
    cursor.execute(query, (post_id,))
    row = cursor.fetchone()
    cursor.close()
    db.close()
    if row:
        return row[0]
    return None

def update_post(post_id, title, content):
    db = get_connection()
    cursor = db.cursor()
    query = """
        UPDATE Posts
        SET title = %s, content = %s, updated_at = NOW()
        WHERE id = %s
    """
    cursor.execute(query, (title, content, post_id))
    db.commit()
    cursor.close()
    db.close()

def delete_post_and_comments(post_id):
    db = get_connection()
    cursor = db.cursor()

    # First delete comments for that post
    cursor.execute("DELETE FROM comments WHERE post_id = %s", (post_id,))
    # Then delete the post
    cursor.execute("DELETE FROM Posts WHERE id = %s", (post_id,))
    db.commit()
    
    cursor.close()
    db.close()

def search_posts(query_str):
    db = get_connection()
    cursor = db.cursor()
    query = """
        SELECT p.id, p.title, p.content, p.user_id, c.name AS category_name,
               p.created_at, p.updated_at
        FROM Posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.content LIKE %s
    """
    cursor.execute(query, ("%" + query_str + "%",))
    records = cursor.fetchall()
    cursor.close()
    db.close()
    return records
