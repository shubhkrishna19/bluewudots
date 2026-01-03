import React, { useState } from 'react'
import { MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react'
import { whatsappService } from '../../src/services/whatsappService'

/**
 * WhatsAppTemplateManager Component
 * Manages WhatsApp message templates for bulk messaging
 */
const WhatsAppTemplateManager = () => {
  const [templates, setTemplates] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState({ name: '', body: '' })

  const handleSaveTemplate = async () => {
    if (currentTemplate.name && currentTemplate.body) {
      const updated = isEditing
        ? templates.map((t) => (t.id === currentTemplate.id ? currentTemplate : t))
        : [...templates, { ...currentTemplate, id: Date.now() }]
      setTemplates(updated)
      setCurrentTemplate({ name: '', body: '' })
      setIsEditing(false)
    }
  }

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template)
    setIsEditing(true)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <MessageSquare className="w-5 h-5" /> WhatsApp Templates
      </h3>

      {/* Template Editor */}
      <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4 space-y-3">
        <input
          type="text"
          placeholder="Template name"
          value={currentTemplate.name}
          onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 text-white text-sm rounded focus:outline-none focus:border-purple-500"
        />
        <textarea
          placeholder="Message body (use {{variable}} for dynamic content)"
          value={currentTemplate.body}
          onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 text-white text-sm rounded focus:outline-none focus:border-purple-500 h-24"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveTemplate}
            className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded transition-colors"
          >
            {isEditing ? 'Update' : 'Create'} Template
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setCurrentTemplate({ name: '', body: '' })
                setIsEditing(false)
              }}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-2">
        {templates.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No templates created yet</p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{template.name}</p>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-2">{template.body}</p>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default WhatsAppTemplateManager
