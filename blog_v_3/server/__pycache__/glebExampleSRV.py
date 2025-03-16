from flask import Flask, request, abort, make_response
from settings import dbpwd
import mysql.connector as mysql
import json
import uuid
import bcrypt

db = mysql.connect(
	host = "localhost",
	user = "root",
	passwd = dbpwd,
	database = "world")

print(db)

app = Flask(__name__)

@app.route('/cities', methods=['GET', 'POST'])
def manage_cities():
	if request.method == 'GET':
		return get_all_cities()
	else:
		return add_city()

@app.route('/login', methods=['POST'])
def login():
	data = request.get_json()
	print(data)
	query = "select id, username, password from users where username = %s"
	values = (data['user'], )
	cursor = db.cursor()
	cursor.execute(query, values)
	record = cursor.fetchone()
	cursor.close()
	
	if not record:
		abort(401)

	user_id = record[0]
	hashed_pwd = record[2]

	if bcrypt.hashpw(data['pass'].encode('utf-8'), hashed_pwd) != hashed_pwd:
		abort(401)

	query = "insert into sessions (user_id, session_id) values (%s, %s)"
	session_id = str(uuid.uuid4())
	values = (record[0], session_id)
	cursor = db.cursor()
	cursor.execute(query, values)
	db.commit()
	cursor.close()
	resp = make_response()
	resp.set_cookie("session_id", session_id)
	return resp

def get_all_cities():
	query = "select id, name, population from cities"
	cursor = db.cursor()
	cursor.execute(query)
	records = cursor.fetchall()
	cursor.close()
	print(records)
	# [(1, 'Herzliya', 95142), (2, 'Tel Aviv', 435855), (3, 'Jerusalem', 874186), (4, 'Bat Yam', 128898), (5, 'Ramat Gan', 153135), (6, 'Eilat', 47800), (7, 'Petah Tikva', 233577), (8, 'Tveriya', 41300)]
	header = ['id', 'name', 'population']
	data = []
	for r in records:
		data.append(dict(zip(header, r)))
	return json.dumps(data)

def get_city(id):
	query = "select id, name, population from cities where id = %s"
	values = (id,)
	cursor = db.cursor()
	cursor.execute(query, values)
	record = cursor.fetchone()
	cursor.close()
	header = ['id', 'name', 'population']
	return json.dumps(dict(zip(header, record)))

def check_login():
	session_id = request.cookies.get("session_id")
	if not session_id:
		abort(401)
	query = "select user_id from sessions where session_id = %s"
	values = (session_id,)
	cursor = db.cursor()
	cursor.execute(query, values)
	record = cursor.fetchone()
	cursor.close()
	if not record:
		abort(401)

def add_city():
	check_login()
	data = request.get_json()
	print(data)
	query = "insert into cities (name, population) values (%s, %s)"
	values = (data['name'], data['population'])
	cursor = db.cursor()
	cursor.execute(query, values)
	db.commit()
	new_city_id = cursor.lastrowid
	cursor.close()
	return get_city(new_city_id)

if __name__ == "__main__":
	app.run()