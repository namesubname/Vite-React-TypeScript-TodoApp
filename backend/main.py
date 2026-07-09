from flask import Flask, jsonify, request
from database import get_connection
from contextlib import closing
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return "Сервер запущен!"


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email: str = data.get("email")
    password: str = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email и Password обязательны!"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2')

    try:
        with closing(get_connection()) as conn:
            with conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_password))

                return jsonify({"message": "Пользователь успешно зарегистрирован"}), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "Этот Email/Login уже занят"}), 400

    except Exception as e:
        return jsonify({"error": f"Ошибка сервера: {str(e)}"}), 500


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    login_input = data.get("login")
    password_input = data.get("password")

    if not login_input or not password_input:
        return jsonify({"error": "Логин и пароль обязательны для заполнения"}), 400

    try:
        user_dict = None

        with closing(get_connection()) as conn:
            with conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT * FROM users WHERE email = ?", (login_input,))

                user = cursor.fetchone()

                if user is not None:
                    user_dict = dict(user)

        if user_dict is None:
            return jsonify({"error": "Пользователь с таким логином не найден"}), 401

        if not check_password_hash(user_dict["password"], password_input):
            return jsonify({"error": "Неверный пароль"}), 401

        return jsonify({
            "message": "Авторизация прошла успешно!",
            "user": {
                "id": user_dict["id"],
                "username": user_dict["email"]
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"Ошибка сервера: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
