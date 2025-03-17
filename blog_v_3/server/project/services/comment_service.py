# project/services/comment_service.py
from flask import abort
from project.models.comment_model import (
    fetch_comments_by_post, insert_comment, fetch_comment_by_id
)

def get_comments_for_post(post_id):
    records = fetch_comments_by_post(post_id)
    if not records:
        # This could mean either no comments or post doesn't exist,
        # but from original code, it 404's if empty:
        abort(404, description="No comments found")
    return records

def add_comment_to_post(post_id, user_id, content):
    new_comment_id = insert_comment(content, user_id, post_id)
    return fetch_comment_by_id(new_comment_id)
