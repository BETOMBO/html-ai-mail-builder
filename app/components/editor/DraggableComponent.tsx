import React from 'react';

interface DraggableComponentProps {
  id: string;
  type: string;
  icon: string;
  label: string;
}

export default function DraggableComponent({ id, type, icon, label }: DraggableComponentProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        id,
        type,
        label,
      })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-4 bg-gray-50 rounded border border-gray-200 cursor-move hover:border-indigo-500 hover:scale-102 active:scale-98 transition-all text-center"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
} 