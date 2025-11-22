import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tag } from '../../types/training';

interface TagInputProps {
  tags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
  suggestions?: Tag[];
  placeholder?: string;
  autoFocus?: boolean;
  onBlur?: () => void;
}

const DEFAULT_SUGGESTIONS: Tag[] = [
  { id: 'force', label: 'Fuerza', color: 'blue', category: 'intensity' },
  { id: 'hypertrophy', label: 'Hipertrofia', color: 'green', category: 'intensity' },
  { id: 'cardio', label: 'Cardio', color: 'red', category: 'intensity' },
  { id: 'mobility', label: 'Movilidad', color: 'yellow', category: 'pattern' },
  { id: 'power', label: 'Potencia', color: 'purple', category: 'intensity' },
];

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "Añadir tag...",
  autoFocus = false,
  onBlur
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (onBlur) onBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const filteredSuggestions = suggestions.filter(
    suggestion =>
      suggestion.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.find(t => t.id === suggestion.id)
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // Check if it matches a suggestion exactly
      const match = suggestions.find(s => s.label.toLowerCase() === inputValue.toLowerCase());
      if (match) {
        onAddTag(match);
      } else {
        // Create new tag
        const newTag: Tag = {
          id: `custom-${Date.now()}`,
          label: inputValue.trim(),
          color: 'gray',
          category: 'other'
        };
        onAddTag(newTag);
      }
      setInputValue('');
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemoveTag(tags[tags.length - 1].id);
    } else if (e.key === 'Escape') {
      if(onBlur) onBlur();
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[120px]">
      <div 
        className="flex flex-wrap gap-1 items-center cursor-text bg-white rounded border border-blue-200 p-0.5 min-h-[24px]"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <span 
            key={tag.id} 
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
          >
            #{tag.label}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveTag(tag.id);
              }}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X size={8} />
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-[40px] text-xs border-none outline-none focus:ring-0 p-0 bg-transparent placeholder-gray-400 h-5"
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white rounded-md shadow-lg border border-gray-100 mt-1 z-50 max-h-40 overflow-y-auto">
          {filteredSuggestions.map(suggestion => (
            <button
              key={suggestion.id}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              onClick={() => {
                onAddTag(suggestion);
                setInputValue('');
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
            >
              <div className={`w-2 h-2 rounded-full bg-blue-400`} />
              {suggestion.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
