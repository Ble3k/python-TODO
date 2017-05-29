import time
import datetime

from flask import Flask, request, render_template, jsonify, json
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./db/tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String)
    name = db.Column(db.String)
    description = db.Column(db.String)
    priority = db.Column(db.Integer)

    def __init__(self, date, name, description, priority):
        self.date = date
        self.name = name
        self.description = description
        self.priority = priority

    def serialize(self):
		return {
    		'date': self.date,
    		'name': self.name,
    		'description': self.description,
    		'priority': self.priority,
    	}


def dynamic_data_entry(name, description, priority):
	unix = time.time()
	date = str(datetime.datetime.fromtimestamp(unix).strftime('%Y-%m-%d %H:%M:%S'))

	task = Task(date, name, description, priority)

	db.session.add(task)
	db.session.commit()


def read_from_db():
	return [row.serialize() for row in Task.query.all()]


db.create_all()

@app.route('/')
def start_page():
	return render_template('/index.html')


@app.route('/tasks', methods=['GET', 'POST'])
def manipulate_tasks():
	if request.method == 'POST':
		name = request.get_json(force=True)['name']
		description = request.get_json(force=True)['description']
		priority = request.get_json(force=True)['priority']

		dynamic_data_entry(name, description, priority)

		return jsonify(read_from_db())
	elif request.method == 'GET':
		return jsonify(read_from_db())


if __name__ == '__main__':
	app.run(debug=True)

