# config.py

class Config:
    DEBUG = True
    # SECRET_KEY = "some-long-random-secret"
    
    # Database info
    DB_HOST = "localhost"
    DB_USER = "root"
    DB_PASSWORD = "avi19091994"
    DB_NAME = "blogdb"
    DB_POOL_NAME = "blog_avi"
    DB_POOL_SIZE = 5

    # If you're serving a React build (optional):
    # Adjust these paths as needed for your setup
    STATIC_FOLDER = "../client/build"
    STATIC_URL_PATH = "/"
