import os
from supabase import create_client

def test():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        return
    try:
        supabase = create_client(url, key)
        res = supabase.table("agent_templates").select("id, name").limit(5).execute()
        print("Success:", res.data)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
