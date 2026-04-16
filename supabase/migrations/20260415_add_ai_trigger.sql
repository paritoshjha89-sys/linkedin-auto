-- Enable the pg_net extension to allow HTTP calls from the database
CREATE EXTENSION IF NOT EXISTS "net";

-- 1. Create a function to wrap the HTTP call to our Edge Function
CREATE OR REPLACE FUNCTION public.trigger_ai_analysis()
RETURNS TRIGGER AS $$
BEGIN
  -- We only trigger analysis for inbound messages
  IF NEW.direction = 'inbound' THEN
    PERFORM
      net.http_post(
        url := 'https://' || current_setting('app.settings.project_ref') || '.supabase.co/functions/v1/analyze-linkedin-reply',
        headers := jsonb_build_object(
          'Content-Type', 'application/json', 
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
      );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the trigger to the messages table
DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_ai_analysis();
