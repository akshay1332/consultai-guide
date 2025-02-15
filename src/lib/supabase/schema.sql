-- Create diet_plans table
CREATE TABLE diet_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  diet_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for diet_plans
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own diet plans" ON diet_plans;
DROP POLICY IF EXISTS "Users can insert their own diet plans" ON diet_plans;
DROP POLICY IF EXISTS "Users can update their own diet plans" ON diet_plans;

-- Create new policies
CREATE POLICY "Enable read access for own diet plans"
  ON diet_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users"
  ON diet_plans FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for own diet plans"
  ON diet_plans FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete access for own diet plans"
  ON diet_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_diet_plans_updated_at ON diet_plans;

-- Create trigger
CREATE TRIGGER update_diet_plans_updated_at
  BEFORE UPDATE ON diet_plans
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 