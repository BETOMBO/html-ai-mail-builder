import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CanvasProps {
  onDrop: (item: any) => void;
  children?: React.ReactNode;
}

export default function Canvas({ onDrop, children }: CanvasProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const item = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop(item);
    } catch (error) {
      console.error('Error parsing dropped item:', error);
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm min-h-[600px] border-2 border-dashed transition-colors ${
        isDraggingOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{
        scale: isDraggingOver ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {children || (
        <div className="h-full flex items-center justify-center text-gray-400">
          Drag components here or enter a prompt to update
        </div>
      )}
    </motion.div>
  );
} 