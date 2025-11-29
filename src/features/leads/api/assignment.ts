import { Lead } from '../types';
import { AssignmentService } from '../services/assignmentService';
import type { AssignmentRule, AssignmentStats } from '../services/assignmentService';

export const getAssignmentRules = async (): Promise<AssignmentRule[]> => {
  return AssignmentService.getAssignmentRules();
};

export const createAssignmentRule = async (
  rule: Omit<AssignmentRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AssignmentRule> => {
  return AssignmentService.createRule(rule);
};

export const updateAssignmentRule = async (
  id: string,
  updates: Partial<AssignmentRule>
): Promise<AssignmentRule> => {
  return AssignmentService.updateRule(id, updates);
};

export const deleteAssignmentRule = async (id: string): Promise<void> => {
  return AssignmentService.deleteRule(id);
};

export const assignLead = async (
  leadId: string,
  ruleId?: string
): Promise<Lead> => {
  return AssignmentService.assignLead(leadId, ruleId);
};

export const reassignLead = async (
  leadId: string,
  reason: string
): Promise<Lead> => {
  return AssignmentService.reassignLead(leadId, reason);
};

export const getAssignmentStats = async (): Promise<AssignmentStats> => {
  return AssignmentService.getAssignmentStats();
};

export const getLoadByUser = async (userId: string): Promise<number> => {
  return AssignmentService.getLoadByUser(userId);
};

