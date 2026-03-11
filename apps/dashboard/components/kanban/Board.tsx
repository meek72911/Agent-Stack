"use client";
import React from 'react';
import { KanbanColumn } from './Column';
import { KanbanCard } from './Card';

type CardData = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  assignee?: string;
  priority?: string;
};

type Column = {
  id: string;
  title: string;
  color?: string;
  cards: CardData[];
};

export function Board({ initial }: { initial?: Column[] }) {
  const [columns] = React.useState<Column[]>(initial ?? [
    { 
      id: 'backlog', 
      title: 'Backlog', 
      color: '#8B5CF6',
      cards: [ 
        { id: 'c1', title: 'Research competitors', description: 'Analyze top 5 AI tools', tags:['Research', 'Low'], priority:'Low' },
        { id: 'c2', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions', tags:['DevOps'], priority:'Medium' },
      ] 
    },
    { 
      id: 'todo', 
      title: 'To Do', 
      color: '#F97316',
      cards: [ 
        { id: 'c3', title: 'Design dashboard UX', description: 'Create wireframes', tags:['Design', 'UI'], priority:'High' },
        { id: 'c4', title: 'Write API docs', description: 'Document all endpoints', tags:['Docs'], priority:'Low' },
      ] 
    },
    { 
      id: 'inprogress', 
      title: 'In Progress', 
      color: '#06B6D4',
      cards: [ 
        { id: 'c5', title: 'Build workflow engine', description: 'Core agent orchestration', tags:['Backend', 'Core'], priority:'High' },
        { id: 'c6', title: 'Test MCP integration', description: 'Connect 3+ apps', tags:['Integration'], priority:'Medium' },
      ] 
    },
    { 
      id: 'done', 
      title: 'Done', 
      color: '#10B981',
      cards: [ 
        { id: 'c7', title: 'Set up repo', description: 'Initial project structure', tags:['Setup'], priority:'Done' },
        { id: 'c8', title: 'Create landing page', description: 'Premium dark theme', tags:['Marketing', 'Design'], priority:'Done' },
      ] 
    },
  ]);

  return (
    <div 
      className="kanban-board" 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16,
        height: '100%',
        overflowX: 'auto',
      }}
    >
      {columns.map((col) => (
        <KanbanColumn 
          key={col.id} 
          title={col.title} 
          color={col.color}
          cards={col.cards}
        />
      ))}
    </div>
  );
}
