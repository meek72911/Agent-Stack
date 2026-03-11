from supabase import create_client

def test():
    url = "https://aqjzibtflndcsdtglikh.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxanppYnRmbG5kY3NkdGdsaWtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIzNzkzOCwiZXhwIjoyMDg4ODEzOTM4fQ.n4Hk4PzxdfGW0EdAsOLAZ1VXO7II91f1FVDjVwdA2Sk"
    try:
        supabase = create_client(url, key)
        res = supabase.table("agent_templates").select("id, name").limit(5).execute()
        print("Success:", res.data)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
