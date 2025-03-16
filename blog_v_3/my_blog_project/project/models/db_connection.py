# project/models/db_connection.py
import mysql.connector as mysql
from mysql.connector import pooling
from config import Config

# Create a global pool using credentials from config
db_pool = pooling.MySQLConnectionPool(
    host=Config.DB_HOST,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD,
    database=Config.DB_NAME,
    buffered=True,
    pool_size=Config.DB_POOL_SIZE,
    pool_name=Config.DB_POOL_NAME
)

def get_connection():
    """Get a connection from the pool."""
    return db_pool.get_connection()
