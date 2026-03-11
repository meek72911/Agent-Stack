import os
import psycopg2
from urllib.parse import urlparse

# Get the DB URL
# The password has a %40 in it, we need to unquote it for psycopg2 to understand if passing explicitly,
# but passing the DSN directly is fine for psycopg2
db_url = "postgresql://postgres:8796105115%40Bb@db.xtjprakqvjrbdpzgsdsh.supabase.co:5432/postgres"

# Path to SQL migration
sql_path = r"c:\Users\vipul\OneDrive\Desktop\nebulla\agentstack-full\agentstack\supabase\migrations\00000000000005_fix_onboarding_trigger.sql"

try:
    print("Connecting to Supabase DB...")
    # Add connect_timeout to avoid hanging
    conn = psycopg2.connect(db_url, connect_timeout=10)
    conn.autocommit = True
    print("Connected successfully.")

    with open(sql_path, "r", encoding="utf-8") as f:
        sql = f.read()

    with conn.cursor() as cur:
        print("Executing migration SQL...")
        cur.execute(sql)
        # Fetch the results from the final SELECT statement if any
        if cur.description:
            rows = cur.fetchall()
            for r in rows:
                print("Result:", r)
        else:
            print("Migration SQL executed successfully.")

except Exception as e:
    print(f"Error executing SQL: {e}")
finally:
    if 'conn' in locals() and conn is not None:
        conn.close()
        print("Connection closed.")
