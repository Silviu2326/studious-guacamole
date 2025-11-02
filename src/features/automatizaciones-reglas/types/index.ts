export type TriggerType = 
  | 'MEMBER_CREATED' 
  | 'MEMBER_INACTIVITY' 
  | 'PAYMENT_FAILED' 
  | 'PAYMENT_SUCCESS' 
  | 'CLASS_BOOKING' 
  | 'MEMBERSHIP_EXPIRING' 
  | 'CHECK_IN' 
  | 'LEAD_CREATED'
  | 'GOAL_ACHIEVED'
  | 'SESSION_COMPLETED';

export type ActionType = 
  | 'SEND_EMAIL' 
  | 'SEND_WHATSAPP' 
  | 'SEND_SMS' 
  | 'CREATE_TASK' 
  | 'ASSIGN_TAG' 
  | 'ADD_SEGMENT' 
  | 'SEND_PUSH_NOTIFICATION'
  | 'APPLY_DISCOUNT'
  | 'SEND_REMINDER';

export interface TriggerConfig {
  days?: number;
  hours?: number;
  amount?: number;
  tags?: string[];
  categories?: string[];
  [key: string]: any;
}

export interface ActionConfig {
  template_id?: string;
  message?: string;
  subject?: string;
  assign_to?: string;
  tag_id?: string;
  segment_id?: string;
  discount_id?: string;
  [key: string]: any;
}

export interface Automation {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  trigger_type: TriggerType;
  trigger_config: TriggerConfig;
  action_type: ActionType;
  action_config: ActionConfig;
  executions_last_30d: number;
  success_rate: number;
  last_execution?: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface CreateAutomationData {
  name: string;
  description?: string;
  is_active?: boolean;
  trigger_type: TriggerType;
  trigger_config: TriggerConfig;
  action_type: ActionType;
  action_config: ActionConfig;
}

export interface UpdateAutomationData {
  name?: string;
  description?: string;
  is_active?: boolean;
  trigger_type?: TriggerType;
  trigger_config?: TriggerConfig;
  action_type?: ActionType;
  action_config?: ActionConfig;
}

export interface AutomationFilters {
  status?: 'all' | 'active' | 'inactive';
  search?: string;
  trigger_type?: TriggerType;
  action_type?: ActionType;
}

export interface TriggerOption {
  type: TriggerType;
  label: string;
  config_schema?: Record<string, any>;
}

export interface ActionOption {
  type: ActionType;
  label: string;
  config_schema?: Record<string, any>;
}

export interface AutomationStats {
  total_automations: number;
  active_automations: number;
  total_executions_30d: number;
  success_rate: number;
  most_executed?: {
    id: string;
    name: string;
    executions: number;
  };
  time_saved_hours: number;
  members_impacted: number;
}

