-- Production-ready SQL schema for Task & Project Management System
-- Includes proper indexes, constraints, enums, and audit fields

-- Enable UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for data consistency
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('Admin', 'Manager', 'User');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('Planned', 'Active', 'On Hold', 'Completed', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('Pending', 'In Progress', 'Completed', 'Cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table with enhanced constraints and indexes
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL CHECK (length(trim(name)) >= 2),
  email VARCHAR(150) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password VARCHAR(255) NOT NULL CHECK (length(password) >= 8),
  role user_role NOT NULL DEFAULT 'User',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Projects table with proper constraints and audit fields
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL CHECK (length(trim(name)) >= 2),
  description TEXT CHECK (length(trim(description)) <= 5000),
  start_date DATE CHECK (start_date <= end_date OR end_date IS NULL),
  end_date DATE,
  status project_status NOT NULL DEFAULT 'Planned',
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tasks table with enhanced constraints and audit fields
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL CHECK (length(trim(title)) >= 2),
  description TEXT CHECK (length(trim(description)) <= 5000),
  priority task_priority NOT NULL DEFAULT 'Medium',
  status task_status NOT NULL DEFAULT 'Pending',
  due_date DATE CHECK (due_date >= CURRENT_DATE OR due_date IS NULL),
  assigned_user UUID REFERENCES users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Comments table with constraints and audit fields
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL CHECK (length(trim(comment_text)) >= 1 AND length(trim(comment_text)) <= 2000),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Project members junction table with constraints
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'Member' CHECK (role IN ('Member', 'Lead', 'Viewer')),
  added_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(project_id, user_id)
);

-- Performance indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_user ON tasks(assigned_user) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id) WHERE is_active = true;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(assigned_user, status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_projects_created_status ON projects(created_by, status) WHERE is_active = true;

-- Trigger function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (id, name, email, password, role) 
VALUES (
  uuid_generate_v4(),
  'System Administrator',
  'admin@taskmanager.com',
  '$2a$10$rQZ8kHWKkGYKk8JzQqZqVeZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZ',
  'Admin'
) ON CONFLICT (email) DO NOTHING;

-- Create view for active data
CREATE OR REPLACE VIEW active_users AS SELECT * FROM users WHERE is_active = true;
CREATE OR REPLACE VIEW active_projects AS SELECT * FROM projects WHERE is_active = true;
CREATE OR REPLACE VIEW active_tasks AS SELECT * FROM tasks WHERE is_active = true;
CREATE OR REPLACE VIEW active_comments AS SELECT * FROM comments WHERE is_active = true;
CREATE OR REPLACE VIEW active_project_members AS SELECT * FROM project_members WHERE is_active = true;

