"use client";
import React from 'react';
import { gsap } from 'gsap';

export function KanbanCard({ 
  data 
}: { 
  data: { 
    id: string; 
    title: string; 
    description?: string; 
    tags?: string[]; 
    assignee?: string; 
    priority?: string;
  } 
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -4,
        scale: 1.02,
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.3)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };
    
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'High': return '#F97316';
      case 'Medium': return '#FBBF24';
      case 'Low': return '#8B5CF6';
      case 'Done': return '#10B981';
      default: return '#94A3B8';
    }
  };

  return (
    <div 
      ref={cardRef}
      style={{ 
        padding: 12, 
        borderRadius: 12, 
        border: '1px solid rgba(255,255,255,0.06)', 
        background: 'linear-gradient(135deg, rgba(13,15,23,0.9) 0%, rgba(26,27,33,0.9) 100%)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <strong style={{ 
          fontSize: 14, 
          fontWeight: 500,
          color: '#F1F5F9',
          lineHeight: 1.4,
        }}>
          {data.title}
        </strong>
        {data.priority && (
          <span 
            style={{ 
              fontSize: 10, 
              padding: '2px 6px', 
              borderRadius: 4, 
              background: getPriorityColor(data.priority) + '30',
              color: getPriorityColor(data.priority),
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {data.priority}
          </span>
        )}
      </div>
      
      {data.description && (
        <div style={{ 
          fontSize: 11, 
          color: '#94A3B8',
          lineHeight: 1.4,
        }}>
          {data.description}
        </div>
      )}
      
      {data.tags && data.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
          {data.tags.slice(0, 3).map((t, i) => (
            <span 
              key={t + i} 
              style={{ 
                fontSize: 10, 
                padding: '2px 6px', 
                borderRadius: 999, 
                background: 'rgba(255,255,255,0.08)',
                color: '#CBD5E1',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
      
      {/* Subtle gradient bottom border */}
      <div style={{
        height: 2,
        borderRadius: '0 0 8px 8px',
        background: 'linear-gradient(90deg, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0.2) 100%)',
        marginTop: 4,
      }} />
    </div>
  );
}
