import React from 'react';
import { UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Template {
  id: string;
  name: string;
  createdAt: string;
}

interface UserProfileProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
  templates: Template[];
  onLoadTemplate: (template: Template) => void;
  onLogout: () => void;
}

export default function UserProfile({ user, templates, onLoadTemplate, onLogout }: UserProfileProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-indigo-100 rounded-full p-2">
          <UserIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Your Templates</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onLoadTemplate(template)}
              className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <DocumentTextIcon className="h-4 w-4 text-gray-400" />
              <span className="truncate">{template.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="w-full mt-4 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 