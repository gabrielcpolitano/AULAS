import { Lesson, Milestone } from './types';

export const CHALLENGE_START_DATE = '2026-01-23';
export const CHALLENGE_END_DATE = '2026-02-23';

export const LESSONS: Lesson[] = [
  // --- LARAVEL ---
  { id: 1, title: "Hello, Laravel", module: "Basics", course: 'Laravel' },
  { id: 2, title: "Your First Route and View", module: "Basics", course: 'Laravel' },
  { id: 3, title: "Create a Layout File Using Blade Components", module: "Blade", course: 'Laravel' },
  { id: 4, title: "Make a Pretty Layout Using Tailwind CSS", module: "Blade", course: 'Laravel' },
  { id: 5, title: "Style the Currently Active Navigation Link", module: "Blade", course: 'Laravel' },
  { id: 6, title: "View Data and Route Wildcards", module: "Routes", course: 'Laravel' },
  { id: 7, title: "Autoloading, Namespaces, and Models", module: "Models", course: 'Laravel' },
  { id: 8, title: "Introduction to Migrations", module: "Database", course: 'Laravel' },
  { id: 9, title: "Meet Eloquent", module: "Eloquent", course: 'Laravel' },
  { id: 10, title: "Model Factories", module: "Eloquent", course: 'Laravel' },
  { id: 11, title: "Two Key Eloquent Relationship Types", module: "Eloquent", course: 'Laravel' },
  { id: 12, title: "Pivot Tables and BelongsToMany Relationships", module: "Eloquent", course: 'Laravel' },
  { id: 13, title: "Eager Loading and the N+1 Problem", module: "Database", course: 'Laravel' },
  { id: 14, title: "All You Need to Know About Pagination", module: "UI", course: 'Laravel' },
  { id: 15, title: "Understanding Database Seeders", module: "Database", course: 'Laravel' },
  { id: 16, title: "Forms and CSRF Explained", module: "Forms", course: 'Laravel' },
  { id: 17, title: "Always Validate. Never Trust the User.", module: "Forms", course: 'Laravel' },
  { id: 18, title: "Editing, Updating, and Deleting a Resource", module: "CRUD", course: 'Laravel' },
  { id: 19, title: "Routes Reloaded - 6 Essential Tips", module: "Routes", course: 'Laravel' },
  { id: 20, title: "Starter Kits, Breeze, and Middleware", module: "Auth", course: 'Laravel' },
  { id: 21, title: "Login and Registration System: Part 1", module: "Auth", course: 'Laravel' },
  { id: 22, title: "Login and Registration System: Part 2", module: "Auth", course: 'Laravel' },
  { id: 23, title: "6 Steps to Authorization Mastery", module: "Auth", course: 'Laravel' },
  { id: 24, title: "Preview and Send Email Using Mailables", module: "Email", course: 'Laravel' },
  { id: 25, title: "Queues Are Easier Than You Think", module: "Advanced", course: 'Laravel' },
  { id: 26, title: "Get Your Build Process in Order", module: "DevOps", course: 'Laravel' },
  { id: 27, title: "From Design to Blade", module: "Project", course: 'Laravel' },
  { id: 28, title: "Blade and Tailwind Techniques", module: "Project", course: 'Laravel' },
  { id: 29, title: "Jobs, Tags, TDD, Oh My!", module: "Project", course: 'Laravel' },
  { id: 30, title: "The Everything Episode (Finale)", module: "Project", course: 'Laravel' },

  // --- POSTGRESQL ---
  { id: 101, title: "What is Database? and Types", module: "Concepts", course: 'PostgreSQL' },
  { id: 102, title: "Why PostgreSQL", module: "Concepts", course: 'PostgreSQL' },
  { id: 103, title: "PostgreSQL + DBeaver Setup", module: "Setup", course: 'PostgreSQL' },
  { id: 104, title: "Create Database & Schema", module: "Admin", course: 'PostgreSQL' },
  { id: 105, title: "Database Objects", module: "Admin", course: 'PostgreSQL' },
  { id: 106, title: "Tables, Rows, and Columns", module: "DDL", course: 'PostgreSQL' },
  { id: 107, title: "Data Types", module: "DDL", course: 'PostgreSQL' },
  { id: 108, title: "Constraints and Data Integrity", module: "DDL", course: 'PostgreSQL' },
  { id: 109, title: "Data Modeling", module: "Modeling", course: 'PostgreSQL' },
  { id: 110, title: "Create Tables", module: "DDL", course: 'PostgreSQL' },
  { id: 111, title: "Command Categories", module: "Concepts", course: 'PostgreSQL' },
  { id: 112, title: "Demonstration (DDL/DML)", module: "Lab", course: 'PostgreSQL' },
  { id: 113, title: "SELECT Command Deep Dive", module: "DQL", course: 'PostgreSQL' },
  { id: 114, title: "WHERE Clause + Operators", module: "DQL", course: 'PostgreSQL' },
  { id: 115, title: "ORDER BY, LIMIT, and FETCH", module: "DQL", course: 'PostgreSQL' },
  { id: 116, title: "Aggregate Functions", module: "DQL", course: 'PostgreSQL' },
  { id: 117, title: "NULL and COALESCE", module: "Logic", course: 'PostgreSQL' },
  { id: 118, title: "Conditional Logic", module: "Logic", course: 'PostgreSQL' },
  { id: 119, title: "String, Numeric & Date Functions", module: "Functions", course: 'PostgreSQL' },
  { id: 120, title: "Subqueries", module: "Advanced Query", course: 'PostgreSQL' },
  { id: 121, title: "Joins (Inner, Left, Right, Full)", module: "Advanced Query", course: 'PostgreSQL' },
  { id: 122, title: "Set Operators", module: "Advanced Query", course: 'PostgreSQL' },
  { id: 123, title: "CTE (Common Table Expressions)", module: "Advanced Query", course: 'PostgreSQL' },
  { id: 124, title: "Window Functions", module: "Advanced Query", course: 'PostgreSQL' },
  { id: 125, title: "Views vs Materialized Views", module: "Expert", course: 'PostgreSQL' },
  { id: 126, title: "Stored Procedures & Functions", module: "Expert", course: 'PostgreSQL' },
  { id: 127, title: "Exception Handling", module: "Expert", course: 'PostgreSQL' }
];

export const MILESTONES: Milestone[] = [
  // Laravel Milestones
  { id: 1, name: "L: Fundamentos UI", description: "Configuração e Blade.", maxLessonId: 5, course: 'Laravel', features: ["Rotas", "Layouts", "Tailwind"] },
  { id: 2, name: "L: DB & Eloquent", description: "O coração do Laravel.", maxLessonId: 13, course: 'Laravel', features: ["Eloquent", "Migrations", "Relationships"] },
  { id: 3, name: "L: CRUD & Auth", description: "Segurança e gestão.", maxLessonId: 23, course: 'Laravel', features: ["Forms", "Breeze", "Authorization"] },
  { id: 4, name: "L: Master", description: "Projeto final e TDD.", maxLessonId: 30, course: 'Laravel', features: ["Queues", "Email", "Deploy"] },
  
  // PostgreSQL Milestones
  { id: 101, name: "SQL: Beginner", description: "Fundamentos e DDL.", maxLessonId: 112, course: 'PostgreSQL', features: ["Setup", "Modeling", "Constraints"] },
  { id: 102, name: "SQL: Intermediate", description: "Queries e Lógica.", maxLessonId: 119, course: 'PostgreSQL', features: ["Aggregates", "Functions", "Where/Order"] },
  { id: 103, name: "SQL: Advanced", description: "Relacionamentos complexos.", maxLessonId: 124, course: 'PostgreSQL', features: ["Joins", "CTEs", "Window Functions"] },
  { id: 104, name: "SQL: Expert", description: "Programação em DB.", maxLessonId: 127, course: 'PostgreSQL', features: ["Stored Procedures", "Views", "Exception Handling"] }
];