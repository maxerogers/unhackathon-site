import sqlite3
conn = sqlite3.connect("data.db")

conn.execute("CREATE TABLE entries (type, email, ideas INT)")
conn.commit()