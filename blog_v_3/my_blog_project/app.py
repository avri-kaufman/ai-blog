# app.py
from flask import Flask
from config import Config

# Import your Blueprints
from project.routes.user_routes import user_bp
from project.routes.post_routes import post_bp
from project.routes.comment_routes import comment_bp

def create_app():
    app = Flask(__name__,
                static_folder=Config.STATIC_FOLDER,
                static_url_path=Config.STATIC_URL_PATH)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Register your blueprints:
    # user routes: /SignUp, /Login, etc.
    app.register_blueprint(user_bp)
    # post routes: /posts, /increment_view, etc.
    app.register_blueprint(post_bp)
    # comment routes: /posts/<id>/comments, etc.
    app.register_blueprint(comment_bp)

    # Optional index route to serve React
    @app.route('/')
    def index():
        # Serve the main index.html of your React build
        return app.send_static_file('index.html')

    return app
