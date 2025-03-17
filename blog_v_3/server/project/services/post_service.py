# project/services/post_service.py
from flask import abort
from project.models.post_model import (
    fetch_popular_posts, increment_post_views, fetch_all_posts, insert_post,
    fetch_post_by_id, fetch_post_author, update_post, delete_post_and_comments,
    search_posts
)

def get_popular_posts(limit=3):
    return fetch_popular_posts(limit)

def increment_view(post_id):
    new_count = increment_post_views(post_id)
    if new_count is None:
        abort(500, description="Post not found")
    return new_count

def get_all_posts():
    return fetch_all_posts()

def create_new_post(title, content, user_id, category_id=1):
    return insert_post(title, content, user_id, category_id)

def get_single_post(post_id):
    record = fetch_post_by_id(post_id)
    if not record:
        abort(404, description="Post not found")
    return record

def edit_post(post_id, title, content, current_user_id):
    # Check if current_user_id is the post author
    author_id = fetch_post_author(post_id)
    if author_id is None:
        abort(404, description="Post not found")
    if author_id != current_user_id:
        abort(403, description="Not authorized to edit this post")

    update_post(post_id, title, content)
    return fetch_post_by_id(post_id)

def delete_post(post_id, current_user_id):
    # Check author
    author_id = fetch_post_author(post_id)
    if not author_id:
        abort(404, description="Post not found")
    if author_id != current_user_id:
        abort(403, description="Permission denied")

    # Delete post and its comments
    delete_post_and_comments(post_id)
    return True

def search_in_posts(query_str):
    return search_posts(query_str)
