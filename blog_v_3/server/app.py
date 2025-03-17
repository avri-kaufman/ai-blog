from flask import Flask
from config import Config
from project.routes.user_routes import user_bp
from project.routes.post_routes import post_bp
from project.routes.comment_routes import comment_bp

def create_app():
    app = Flask(__name__,
                static_folder=Config.STATIC_FOLDER,
                static_url_path=Config.STATIC_URL_PATH)
    
    app.config.from_object(Config)
    
    app.register_blueprint(user_bp)
    app.register_blueprint(post_bp)
    app.register_blueprint(comment_bp)

    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    return app
