from supabase import create_client

def test():
    url = "https://xtjprakqvjrbdpzgsdsh.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0anByYWtxdmpyYmRwemdzZHNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2OTc1NywiZXhwIjoyMDg4NjQ1NzU3fQ.EmB10zlItnEkxpXec4pbfBuf9pzehzxPnyPp8_TsLCA"
    try:
        supabase = create_client(url, key)
        res = supabase.table("agent_templates").select("id, name").limit(5).execute()
        print("Success:", res.data)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
