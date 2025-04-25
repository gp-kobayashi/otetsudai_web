ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

ALTER TABLE recruitments ENABLE ROW LEVEL SECURITY;

CREATE policy "Public comments are viewable by everyone." on comments
  for select using (true);

CREATE policy "Users can insert their own comments." on comments
  for insert with check (auth.uid() = user_id);

CREATE policy "Public recruitments are viewable by everyone." on recruitments
  for select using (true);

CREATE policy "Users can insert their own recruitments." on recruitments
  for insert with check (auth.uid() = user_id);

CREATE policy "Users can delete their own recruitments." on recruitments
  for delete using (auth.uid() = user_id);