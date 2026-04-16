-- Enable Realtime for the Inbox and Lead status updates
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table leads;
