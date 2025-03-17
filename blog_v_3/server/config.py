import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = True
    
    # database info
    DB_HOST = os.getenv("DB_HOST")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")
    DB_POOL_NAME = os.getenv("DB_POOL_NAME")
    DB_POOL_SIZE = int(os.getenv('DB_POOL_SIZE'))

    # react files
    STATIC_FOLDER = "../client/build"
    STATIC_URL_PATH = "/"
