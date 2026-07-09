import sqlite3
from contextlib import closing
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with closing(get_connection()) as conn:
        with conn:
            conn.execute('''

                CREATE TABLE IF NOT EXISTS users (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL

                )

            ''')


init_db()
