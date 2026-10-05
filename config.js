/* Cloud sync + Google login (optional). Paste the two values from Supabase → Project Settings → API.
   The anon key is public by design; your data is protected by the row-level-security rules in supabase/schema.sql.
   Leave both empty and the app simply works offline with browser storage. */
window.FP_CONFIG = {
  SUPABASE_URL: 'https://uxlnozcwycntvylhvngh.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bG5vemN3eWNudHZ5bGh2bmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExODYwNzQsImV4cCI6MjEwNjc2MjA3NH0.teq_fpI6WJx9WbSIPdJRGQ2P-shXge2cV9LVwErVP-Q'
};
