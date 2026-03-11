"use client";
import React from 'react';
import { KanbanCard } from './Card';

type CardData = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  assignee?: string;
  priority?: string;
};

export function KanbanColumn({ 
  title, 
  color, 
  cards 
}: { 
  title: string; 
  color?: string; 
  cards: CardData[];
}) {
  return (
    <section 
      className="kanban-column group" 
      aria-label={title}
      style={{ 
        minHeight: 200, 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: 16, 
        padding: 12, 
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease',
      }}
    >
      <div 
        className="column-header"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          paddingBottom: 12,
          borderBottom: `2px solid ${color || '#F97316'}`,
          marginBottom: 12,
        }}
      >
        <h3 style={{ 
          fontSize: 13, 
          fontWeight: 600, 
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: '#F1F5F9',
        }}>
          {title}
        </h3>
        <span 
          className="dot" 
          style={{ 
            width: 10, 
            height: 10, 
            borderRadius: 999, 
            background: color || '#999',
            boxShadow: `0 0 10px ${color || '#999'}`,
          }}
        />
      </div>
      <div 
        className="kanban-cards" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 10,
          overflowY: 'auto',
          maxHeight: 'calc(100% - 50px)',
        }}
      >
        {cards.map((card) => (
          <KanbanCard key={card.id} data={card} />
        ))}
      </div>
    </section>
  );
}
