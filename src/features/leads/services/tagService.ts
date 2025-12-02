import { LeadTag, PREDEFINED_TAGS, TagColor } from '../types/tags';

let customTags: LeadTag[] = [];

export class TagService {
  static getPredefinedTags(): LeadTag[] {
    return [...PREDEFINED_TAGS];
  }

  static getAllTags(): LeadTag[] {
    return [...PREDEFINED_TAGS, ...customTags];
  }

  static getTagsByCategory(category: LeadTag['category']): LeadTag[] {
    return this.getAllTags().filter(tag => tag.category === category);
  }

  static getTagById(id: string): LeadTag | undefined {
    return this.getAllTags().find(tag => tag.id === id);
  }

  static getTagsByIds(ids: string[]): LeadTag[] {
    return ids
      .map(id => this.getTagById(id))
      .filter((tag): tag is LeadTag => tag !== undefined);
  }

  static createCustomTag(name: string, color: TagColor): LeadTag {
    const newTag: LeadTag = {
      id: `custom-${Date.now()}`,
      name,
      category: 'personalizado',
      color,
    };
    customTags.push(newTag);
    return newTag;
  }

  static deleteCustomTag(id: string): void {
    customTags = customTags.filter(tag => tag.id !== id);
  }

  static searchTags(query: string): LeadTag[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTags().filter(tag =>
      tag.name.toLowerCase().includes(lowerQuery)
    );
  }
}

