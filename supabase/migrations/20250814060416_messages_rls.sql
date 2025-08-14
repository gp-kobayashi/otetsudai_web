ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE policy "messages are viewable by sender_id or receiver_id " on messages
  for select using (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE policy "Users can insert their own messages." on messages
  for insert with check (auth.uid() = sender_id);

CREATE policy "Users can delete their own messages." on messages
  for delete using (auth.uid() = sender_id OR auth.uid() = receiver_id);
