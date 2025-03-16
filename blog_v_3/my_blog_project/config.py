class Config:
    DEBUG = True
    
    # database info
    DB_HOST = "localhost"
    DB_USER = "root"
    DB_PASSWORD = "avi19091994"
    DB_NAME = "blogdb"
    DB_POOL_NAME = "blog_avi"
    DB_POOL_SIZE = 5

    # react files
    STATIC_FOLDER = "../client/build"
    STATIC_URL_PATH = "/"
