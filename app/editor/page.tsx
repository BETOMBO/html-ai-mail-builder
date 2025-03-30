'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  Squares2X2Icon,
  PlayIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import './editor.css';
import 'grapesjs-preset-webpage';
import 'grapesjs-blocks-basic';
import 'grapesjs-plugin-forms';
import 'grapesjs-plugin-export';
import Link from 'next/link';
import UserProfile from '../components/editor/UserProfile';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface Component {
  id: string;
  type: string;
  icon: string;
  label: string;
  content: string;
}

const components: Component[] = [
  { 
    id: 'divider', 
    type: 'divider', 
    icon: '—', 
    label: 'Divider',
    content: '<hr style="margin: 15px 0; border: none; border-top: 1px solid #ccc;" />'
  },
  { 
    id: 'text', 
    type: 'text', 
    icon: 'T', 
    label: 'Text',
    content: '<p style="margin: 0; padding: 10px;">Add your text here</p>'
  },
  { 
    id: 'text-section', 
    type: 'text-section', 
    icon: '¶', 
    label: 'Text Section',
    content: '<div style="padding: 20px;"><h2 style="margin-bottom: 10px;">Section Title</h2><p>Section content goes here.</p></div>'
  },
  { 
    id: 'image', 
    type: 'image', 
    icon: '🖼', 
    label: 'Image',
    content: '<img src="https://via.placeholder.com/300x200" alt="placeholder" style="max-width: 100%; height: auto;" />'
  },
  { 
    id: 'quote', 
    type: 'quote', 
    icon: '"', 
    label: 'Quote',
    content: '<blockquote style="margin: 15px 0; padding: 15px; border-left: 4px solid #6366f1; background: #f3f4f6;"><p style="margin: 0;">Your quote here</p></blockquote>'
  },
  { 
    id: 'link', 
    type: 'link', 
    icon: '🔗', 
    label: 'Link',
    content: '<a href="#" style="color: #6366f1; text-decoration: underline;">Click here</a>'
  },
  { 
    id: 'link-block', 
    type: 'link-block', 
    icon: '🔗🔗', 
    label: 'Link Block',
    content: '<div style="padding: 15px; background: #f9fafb; border-radius: 6px;"><a href="#" style="color: #6366f1; text-decoration: none; display: block;">Link Block</a></div>'
  },
  { 
    id: 'grid', 
    type: 'grid', 
    icon: '⊞', 
    label: 'Grid Items',
    content: '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px;"><div style="padding: 20px; background: #f9fafb; border-radius: 6px;">Grid Item 1</div><div style="padding: 20px; background: #f9fafb; border-radius: 6px;">Grid Item 2</div></div>'
  },
  { 
    id: 'list', 
    type: 'list', 
    icon: '•', 
    label: 'List Items',
    content: '<ul style="margin: 15px 0; padding-left: 20px;"><li style="margin-bottom: 5px;">List item 1</li><li style="margin-bottom: 5px;">List item 2</li><li style="margin-bottom: 5px;">List item 3</li></ul>'
  },
  { 
    id: 'button', 
    type: 'button', 
    icon: '▭', 
    label: 'Button',
    content: '<a href="#" style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; text-align: center;">Button</a>'
  },
];

interface Layout {
  id: string;
  name: string;
  columns: number | string;
  content: string;
}

const layouts: Layout[] = [
  { 
    id: 'single', 
    name: 'Single Column', 
    columns: 1,
    content: '<div style="width: 100%; padding: 20px;"><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Single Column Content</div></div>'
  },
  { 
    id: 'double', 
    name: 'Two Columns', 
    columns: 2,
    content: '<div style="width: 100%; padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;"><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Column 1</div><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Column 2</div></div>'
  },
  { 
    id: 'triple', 
    name: 'Three Columns', 
    columns: 3,
    content: '<div style="width: 100%; padding: 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;"><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Column 1</div><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Column 2</div><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Column 3</div></div>'
  },
  { 
    id: 'sidebar-left', 
    name: 'Left Sidebar', 
    columns: '1:2',
    content: '<div style="width: 100%; padding: 20px; display: grid; grid-template-columns: 1fr 2fr; gap: 20px;"><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Sidebar</div><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Main Content</div></div>'
  },
  { 
    id: 'sidebar-right', 
    name: 'Right Sidebar', 
    columns: '2:1',
    content: '<div style="width: 100%; padding: 20px; display: grid; grid-template-columns: 2fr 1fr; gap: 20px;"><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Main Content</div><div style="background: #f9fafb; padding: 20px; border-radius: 6px;">Sidebar</div></div>'
  },
];

function EditorContent() {
  const [projectName, setProjectName] = useState('Untitled Project');
  const [activeTab, setActiveTab] = useState('layouts');
  const [showCode, setShowCode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDevice, setCurrentDevice] = useState('desktop');
  const [user, setUser] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const [showStyleManager, setShowStyleManager] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user) {
      setUser(session.user);
      fetchUserTemplates(session.user.id);
    }
  }, [session, status, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const editor = grapesjs.init({
        container: '#gjs',
        height: '100%',
        storageManager: false,
        plugins: ['gjs-preset-webpage', 'gjs-blocks-basic', 'gjs-plugin-forms', 'gjs-plugin-export'],
        pluginsOpts: {
          'gjs-preset-webpage': {},
          'gjs-blocks-basic': {},
          'gjs-plugin-forms': {},
          'gjs-plugin-export': {},
        },
        styleManager: {
          appendTo: '#style-manager-container',

          sectors: [
            {
              name: 'Dimension',
              open: false,
              buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
            },
            {
              name: 'Typography',
              open: false,
              buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'letter-spacing', 'text-align', 'text-decoration'],
            },
            {
              name: 'Decorations',
              open: false,
              buildProps: ['border-radius', 'border', 'box-shadow', 'background'],
            },
            {
              name: 'Extra',
              open: false,
              buildProps: ['opacity', 'overflow', 'position', 'display'],
            }
          ]
        },
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '768px',
            },
            {
              name: 'Mobile portrait',
              width: '320px',
              widthMedia: '320px',
            },
          ]
        },
        canvas: {
          styles: [
            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
          ],
          frameStyle: `
            .gjs-frame-wrapper { 
              padding-top: 4rem !important;
              padding-left: 2rem !important;
              padding-right: 2rem !important;
            }
          `
        },
        panels: {
          defaults: [
            {
              id: 'views',
              buttons: [
                {
                  id: 'codeViewer',
                  className: 'fa fa-code',
                  command: 'core:open-code',
                  attributes: { title: 'View Code' }
                }
              ]
            }
          ]
        },
       /* codeViewer: {
          theme: 'dark',
          lineNumbers: true,
        }*/
      });

      editor.on('block:drag:stop', (component: any) => {
        console.log('Component dropped:', component);
      });

      editor.Commands.add('core:open-code', {
        run(editor) {
          const modal = editor.Modal;
          modal.setTitle('Code');
          
          const container = document.createElement('div');
          const codeViewer = document.createElement('textarea');
          container.style.padding = '20px';
          codeViewer.style.width = '100%';
          codeViewer.style.height = '400px';
          codeViewer.style.fontFamily = 'monospace';
          codeViewer.style.fontSize = '14px';
          codeViewer.value = editor.getHtml() + '\n\n<style>\n' + editor.getCss() + '\n</style>';
          
          container.appendChild(codeViewer);
          modal.setContent(container);
          modal.open();
          
          return modal;
        }
      });

      // Add component selection handler
      editor.on('component:selected', (component: any) => {
        setSelectedComponent(component);
        setShowStyleManager(true);
      });

      // Add component deselection handler
      editor.on('component:deselected', () => {
        setSelectedComponent(null);
        setShowStyleManager(false);
      });

      setEditor(editor);
    }
  }, []);

  // Load template if ID is provided
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId || !session?.user) return;

      try {
        const response = await fetch(`/api/templates/${templateId}`);
        if (!response.ok) {
          throw new Error('Failed to load template');
        }
        const template = await response.json();
        setProjectName(template.name);
        editor?.setComponents(template.html);
        editor?.setStyle(template.css);
      } catch (error) {
        console.error('Error loading template:', error);
      }
    };

    if (editor) {
      loadTemplate();
    }
  }, [editor, templateId, session]);

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);

    try {
  
    
  
        // Enhance the prompt to specifically request responsive design
        const enhancedPrompt = `Create a responsive email template that works well on both desktop and mobile devices (width < 600px) for the following request: ${prompt}. Include necessary media queries and use table-based layout for email client compatibility. Ensure all images are fluid and text is readable on small screens.`;
  
  
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      });
      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          alert('Insufficient tokens. Please upgrade your plan to continue.');
          router.push('/settings#plans');
          return;
        }
        throw new Error(error.message || 'Failed to generate content');
      }

      const data = await response.json();
      
      if (editor) {
        editor.setComponents(data.content);
      }

      setPrompt('');
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, content: string) => {
    e.dataTransfer.setData('text/html', content);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const content = e.dataTransfer.getData('text/html');
    if (editor && content) {
      const component = editor.addComponents(content)[0];
      component.view.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDownload = () => {
    if (editor) {
      const html = editor.getHtml();
      const css = editor.getCss();
      const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Email Template</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
      a.download = `${projectName || 'email-template'}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    }
  };

  const handleDelete = () => {
    if (editor) {
      editor.setComponents('');
    }
  };

  const handleCodeView = () => {
    if (editor) {
      editor.runCommand('core:open-code');
      setShowCode(!showCode);
    }
  };

  const handleMaximize = () => {
    if (editor) {
      editor.runCommand('core:fullscreen');
    }
  };

  const handleUndo = () => {
    if (editor) {
      editor.UndoManager.undo();
    }
  };

  const handleRedo = () => {
    if (editor) {
      editor.UndoManager.redo();
    }
  };

  const handleDeviceChange = (device: string) => {
    if (editor) {
      setCurrentDevice(device);
      switch (device) {
        case 'desktop':
          editor.setDevice('Desktop');
          break;
        case 'tablet':
          editor.setDevice('Tablet');
          break;
        case 'mobile':
          editor.setDevice('Mobile portrait');
          break;
      }
    }
  };

  const fetchUserTemplates = async (userId: string) => {
    try {
      const response = await fetch(`/api/templates?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleLogin = async () => {
    const emailInput = window.prompt('Please enter your email:');
    if (!emailInput) return;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const userData = await response.json();
      setUser(userData);
      await fetchUserTemplates(userData.id);
      console.log('Logged in as:', userData);
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleSaveTemplate = async () => {
    if (!session?.user) {
      alert('Please login to save templates');
      return;
    }

    try {
      setIsGenerating(true);
      const html = editor.getHtml();
      const css = editor.getCss();

      const endpoint = templateId 
        ? `/api/templates/${templateId}`
        : '/api/templates';

      const method = templateId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          html,
          css,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      const savedTemplate = await response.json();
      alert('Template saved successfully!');

      // If this is a new template, redirect to the template's edit URL
      if (!templateId) {
        router.push(`/editor?id=${savedTemplate.id}`);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border-none focus:ring-0 text-lg font-medium text-gray-900"
              />
              <button
                onClick={handleSaveTemplate}
                disabled={!user}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  user
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save
              </button>
              {!user && (
                <button
                  onClick={handleLogin}
                  className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Login
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="border-r border-gray-200 pr-2 mr-2">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDeviceChange('desktop')}
                    className={`p-2 ${currentDevice === 'desktop' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
                    title="Desktop view"
                  >
                    <ComputerDesktopIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeviceChange('tablet')}
                    className={`p-2 ${currentDevice === 'tablet' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
                    title="Tablet view"
                  >
                    <DeviceTabletIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeviceChange('mobile')}
                    className={`p-2 ${currentDevice === 'mobile' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
                    title="Mobile view"
                  >
                    <DevicePhoneMobileIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <button 
                onClick={handleUndo}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowUturnLeftIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={handleRedo}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowUturnRightIcon className="h-5 w-5" />
              </button>
              {/* <button 
                onClick={handleMaximize}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button> */}
              <button
                onClick={handleCodeView}
                className={`p-2 ${showCode ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
              >
                <CodeBracketIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isGenerating) {
                  handleGenerateContent();
                }
              }}
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type your prompt here"
            />
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>
          </div>
            </div>

        <div className="flex-1 flex">
          <div 
            className="flex-1 bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div id="gjs" className="h-full" />
          </div>

          {/* Components Panel */}
          <div className={`border-l border-gray-200 bg-white transition-all duration-300 ${showStyleManager ? 'w-64' : 'w-64'}`}>
            <div className="h-full flex flex-col">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['layouts', 'components'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 ${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'layouts' && (
                  <div className="space-y-4">
                    {layouts.map((layout) => (
                      <div
                        key={layout.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, layout.content)}
                        className="p-4 bg-gray-50 rounded border border-gray-200 cursor-move hover:border-indigo-500 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-900">{layout.name}</div>
                        <div className="mt-2 flex gap-2">
                          {Array.isArray(layout.columns)
                            ? layout.columns.map((col, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-8 bg-gray-200 rounded"
                                  style={{ flex: parseInt(col as string) }}
                                />
                              ))
                            : Array(layout.columns)
                                .fill(0)
                                .map((_, i) => (
                                  <div key={i} className="flex-1 h-8 bg-gray-200 rounded" />
                                ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'components' && (
                  <div className="grid grid-cols-2 gap-4">
                    {components.map((component) => (
                      <div
                        key={component.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component.content)}
                        className="p-4 bg-gray-50 rounded border border-gray-200 cursor-move hover:border-indigo-500 transition-colors text-center"
                      >
                        <div className="text-2xl mb-2">{component.icon}</div>
                        <div className="text-sm text-gray-600">{component.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Style Manager Panel */}
          <div className={`border-l border-gray-200 bg-white transition-all duration-300 ${showStyleManager ? 'w-80' : 'w-0'}`}>
            <div className="h-full flex flex-col">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Style Manager</h3>
                <button
                  onClick={() => setShowStyleManager(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div id="style-manager-container" className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
} 