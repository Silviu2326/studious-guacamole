import { CommunityFidelizacionAPI } from '../api/communityFidelizacion';
import { CommunityVoiceAPI } from '../api/communityVoice';
import { CustomerSegmentationAPI } from '../api/customerSegmentation';
import { WowMomentsAPI } from '../api/wowMoments';
import { TestimonialScriptsAPI } from '../api/testimonialScripts';
import { BestReviewsAutoPublishAPI } from '../api/bestReviewsAutoPublish';
import { ProgressBasedMomentsAPI } from '../api/progressBasedMoments';
import { AIReferralProgramAPI } from '../api/aiReferralProgram';
import { PromoterMissionsAPI } from '../api/promoterMissions';
import { ReferralImpactReportsAPI } from '../api/referralImpactReports';
import { AIAdaptedSurveysAPI } from '../api/aiAdaptedSurveys';
import { AIPlaybookAPI } from '../api/aiPlaybook';
import { AutomatedComplianceMessagesAPI } from '../api/automatedComplianceMessages';
import { ApprovalManagerAPI } from '../api/approvalManager';
import { InitiativePrioritizationAPI } from '../api/initiativePrioritization';
import {
  CommunityFidelizacionSnapshot,
  CommunityVoiceConfig,
  CustomerSegment,
  WowMoment,
  ReplicationStrategy,
  TestimonialScript,
  TestimonialScriptObjective,
  TestimonialScriptFormat,
  BestReviewConfig,
  AutoPublishedReview,
  ProgressBasedMoment,
  Testimonial,
  AIReferralProgram,
  SegmentBasedReward,
  PromoterMission,
  PromoterBranding,
  MissionType,
  MissionStatus,
  ReferralROIReport,
  ReferralImpactPeriod,
  AIAdaptedSurvey,
  AIAdaptedSurveyTemplate,
  AIAdaptedSurveyStats,
  ExperienceType,
  AIPlaybook,
  AIPlaybookSuggestion,
  SuggestionStatus,
  CalendarConstraint,
  ComplianceMessageConfig,
  AutomatedComplianceMessage,
  MessageType,
  MessageTrigger,
  MessageStatus,
  ComplianceMessageTemplate,
  MilestoneData,
  RelapseData,
  ApprovalRequest,
  ApprovalConfig,
  InitiativePrioritization,
} from '../types';

export const CommunityFidelizacionService = {
  async getSnapshot(period: CommunityFidelizacionSnapshot['period']) {
    return CommunityFidelizacionAPI.getSnapshot(period);
  },
  // US-CF-01: Configuración de Voz de Comunidad
  async getCommunityVoiceConfig(trainerId?: string) {
    return CommunityVoiceAPI.getConfig(trainerId);
  },
  async saveCommunityVoiceConfig(config: Partial<CommunityVoiceConfig>) {
    return CommunityVoiceAPI.saveConfig(config);
  },
  // US-CF-02: Segmentación de Clientes
  async getCustomerSegments() {
    return CustomerSegmentationAPI.getSegments();
  },
  async getSegmentSummary() {
    return CustomerSegmentationAPI.getSegmentSummary();
  },
  // US-CF-03: Momentos Wow
  async getWowMoments() {
    return WowMomentsAPI.getMoments();
  },
  async getWowMoment(momentId: string) {
    return WowMomentsAPI.getMoment(momentId);
  },
  async captureWowMoment(momentData: Omit<WowMoment, 'id' | 'capturedAt' | 'status'>) {
    return WowMomentsAPI.captureMoment(momentData);
  },
  async analyzeWowMomentWithAI(momentId: string) {
    return WowMomentsAPI.analyzeMomentWithAI(momentId);
  },
  async createReplicationStrategy(momentId: string, strategy: Omit<ReplicationStrategy, 'id' | 'createdAt'>) {
    return WowMomentsAPI.createReplicationStrategy(momentId, strategy);
  },
  async updateWowMoment(momentId: string, updates: Partial<WowMoment>) {
    return WowMomentsAPI.updateMoment(momentId, updates);
  },
  // US-CF-04: Guiones IA para testimonios
  async getTestimonialScripts() {
    return TestimonialScriptsAPI.getScripts();
  },
  async getTestimonialScript(scriptId: string) {
    return TestimonialScriptsAPI.getScript(scriptId);
  },
  async generateTestimonialScript(params: {
    objective: TestimonialScriptObjective;
    format: TestimonialScriptFormat;
    voiceConfig?: CommunityVoiceConfig;
    clientContext?: {
      clientId?: string;
      clientName?: string;
      objective?: string;
      progress?: string;
    };
  }) {
    return TestimonialScriptsAPI.generateScript(params);
  },
  async updateTestimonialScript(scriptId: string, updates: Partial<TestimonialScript>) {
    return TestimonialScriptsAPI.updateScript(scriptId, updates);
  },
  async exportTestimonialScriptToTeleprompter(scriptId: string) {
    return TestimonialScriptsAPI.exportToTeleprompter(scriptId);
  },
  // US-CF-05: Publicación automática de mejores reseñas
  async getBestReviewConfig() {
    return BestReviewsAutoPublishAPI.getBestReviewConfig();
  },
  async saveBestReviewConfig(config: Partial<BestReviewConfig>) {
    return BestReviewsAutoPublishAPI.saveBestReviewConfig(config);
  },
  async identifyBestReviews(
    testimonials: Testimonial[],
    criteria: BestReviewConfig['criteria'],
    minScore: number,
    minRecencyDays: number,
  ) {
    return BestReviewsAutoPublishAPI.identifyBestReviews(testimonials, criteria, minScore, minRecencyDays);
  },
  async autoPublishBestReviews(config: BestReviewConfig, testimonials: Testimonial[]) {
    return BestReviewsAutoPublishAPI.autoPublishBestReviews(config, testimonials);
  },
  async getAutoPublishedReviews() {
    return BestReviewsAutoPublishAPI.getAutoPublishedReviews();
  },
  async refreshAutoPublish(config: BestReviewConfig, testimonials: Testimonial[]) {
    return BestReviewsAutoPublishAPI.refreshAutoPublish(config, testimonials);
  },
  // US-CF-06: Momentos ideales según progreso real
  async getClientProgressData(clientId: string) {
    return ProgressBasedMomentsAPI.getClientProgressData(clientId);
  },
  async detectProgressBasedMoments(clientIds: string[]) {
    return ProgressBasedMomentsAPI.detectProgressBasedMoments(clientIds);
  },
  async getProgressBasedMoments() {
    return ProgressBasedMomentsAPI.getProgressBasedMoments();
  },
  // US-CF-07: Programas de Referidos IA con adaptación por segmentos
  async getAIReferralProgram() {
    return AIReferralProgramAPI.getAIReferralProgram();
  },
  async enableAI(programId: string) {
    return AIReferralProgramAPI.enableAI(programId);
  },
  async generateSegmentRewards(programId: string) {
    return AIReferralProgramAPI.generateSegmentRewards(programId);
  },
  async analyzeWithAI(programId: string) {
    return AIReferralProgramAPI.analyzeWithAI(programId);
  },
  async updateSegmentReward(programId: string, segmentReward: SegmentBasedReward) {
    return AIReferralProgramAPI.updateSegmentReward(programId, segmentReward);
  },
  // US-CF-08: Misiones personalizadas para promotores
  async getPromoterMissions() {
    return PromoterMissionsAPI.getMissions();
  },
  async getPromoterBrandings() {
    return PromoterMissionsAPI.getPromoterBrandings();
  },
  async createMission(promoterId: string, missionType: MissionType, missionData: Partial<PromoterMission>) {
    return PromoterMissionsAPI.createMission(promoterId, missionType, missionData);
  },
  async assignMission(missionId: string, promoterId: string) {
    return PromoterMissionsAPI.assignMission(missionId, promoterId);
  },
  async updateMissionStatus(missionId: string, status: MissionStatus) {
    return PromoterMissionsAPI.updateMissionStatus(missionId, status);
  },
  async reviewMission(missionId: string, approved: boolean, feedback?: string) {
    return PromoterMissionsAPI.reviewMission(missionId, approved, feedback);
  },
  async brandPromoter(promoterId: string, branding: Partial<PromoterBranding>) {
    return PromoterMissionsAPI.brandPromoter(promoterId, branding);
  },
  // US-CF-09: Reportes IA de Impacto de Referidos
  async getReferralROIReport(period: ReferralImpactPeriod = '30d') {
    return ReferralImpactReportsAPI.getReferralROIReport(period);
  },
  async generateReferralROIReport(period: ReferralImpactPeriod) {
    return ReferralImpactReportsAPI.generateReferralROIReport(period);
  },
  // US-CF-10: Encuestas IA Adaptadas por Experiencia
  async getAIAdaptedSurveyTemplates() {
    return AIAdaptedSurveysAPI.getTemplates();
  },
  async getAIAdaptedSurveyTemplate(templateId: string) {
    return AIAdaptedSurveysAPI.getTemplateById(templateId);
  },
  async getAIAdaptedSurveys() {
    return AIAdaptedSurveysAPI.getSurveys();
  },
  async getAIAdaptedSurvey(surveyId: string) {
    return AIAdaptedSurveysAPI.getSurveyById(surveyId);
  },
  async generateAdaptedSurvey(
    templateId: string,
    clientId: string,
    experienceId: string,
    experienceType: ExperienceType,
  ) {
    return AIAdaptedSurveysAPI.generateAdaptedSurvey(templateId, clientId, experienceId, experienceType);
  },
  async sendAIAdaptedSurvey(surveyId: string) {
    return AIAdaptedSurveysAPI.sendSurvey(surveyId);
  },
  async getAIAdaptedSurveyStats(period: ReferralImpactPeriod = '30d') {
    return AIAdaptedSurveysAPI.getSurveyStats(period);
  },
  async updateAIAdaptedSurveyTemplate(templateId: string, updates: Partial<AIAdaptedSurveyTemplate>) {
    return AIAdaptedSurveysAPI.updateTemplate(templateId, updates);
  },
  // User Story: AI Playbook - Retos y eventos basados en estilo y calendario
  async getAIPlaybook(trainerId?: string) {
    return AIPlaybookAPI.getPlaybook(trainerId);
  },
  async updateAIPlaybook(updates: Partial<AIPlaybook>) {
    return AIPlaybookAPI.updatePlaybook(updates);
  },
  async getAIPlaybookSuggestions(playbookId: string) {
    return AIPlaybookAPI.getSuggestions(playbookId);
  },
  async generateAIPlaybookSuggestions(
    playbookId: string,
    voiceConfig?: CommunityVoiceConfig,
    calendarConstraints?: CalendarConstraint,
  ) {
    return AIPlaybookAPI.generateSuggestions(playbookId, voiceConfig, calendarConstraints);
  },
  async acceptAIPlaybookSuggestion(suggestionId: string, scheduledFor?: string) {
    return AIPlaybookAPI.acceptSuggestion(suggestionId, scheduledFor);
  },
  async rejectAIPlaybookSuggestion(suggestionId: string, reason?: string) {
    return AIPlaybookAPI.rejectSuggestion(suggestionId, reason);
  },
  async updateAIPlaybookSuggestionStatus(
    suggestionId: string,
    status: SuggestionStatus,
    scheduledFor?: string,
  ) {
    return AIPlaybookAPI.updateSuggestionStatus(suggestionId, status, scheduledFor);
  },
  async analyzeStyleAndCalendar(voiceConfig: CommunityVoiceConfig, calendarConstraints: CalendarConstraint) {
    return AIPlaybookAPI.analyzeStyleAndCalendar(voiceConfig, calendarConstraints);
  },
  // User Story: Mensajes automatizados de cumplimiento
  async getComplianceMessageConfig(trainerId?: string) {
    return AutomatedComplianceMessagesAPI.getConfig(trainerId);
  },
  async updateComplianceMessageConfig(config: Partial<ComplianceMessageConfig>) {
    return AutomatedComplianceMessagesAPI.updateConfig(config);
  },
  async getComplianceMessages(filters?: {
    clientId?: string;
    type?: MessageType;
    status?: MessageStatus;
    trigger?: MessageTrigger;
  }) {
    return AutomatedComplianceMessagesAPI.getMessages(filters);
  },
  async getComplianceMessage(messageId: string) {
    return AutomatedComplianceMessagesAPI.getMessage(messageId);
  },
  async createComplianceMessage(
    clientId: string,
    type: MessageType,
    trigger: MessageTrigger,
    milestoneData?: MilestoneData,
    relapseData?: RelapseData,
  ) {
    return AutomatedComplianceMessagesAPI.createMessage(clientId, type, trigger, milestoneData, relapseData);
  },
  async sendComplianceMessage(messageId: string) {
    return AutomatedComplianceMessagesAPI.sendMessage(messageId);
  },
  async updateComplianceMessageStatus(messageId: string, status: MessageStatus) {
    return AutomatedComplianceMessagesAPI.updateMessageStatus(messageId, status);
  },
  async getComplianceMessageTemplates(type?: MessageType) {
    return AutomatedComplianceMessagesAPI.getTemplates(type);
  },
  async createComplianceMessageTemplate(
    template: Omit<ComplianceMessageTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return AutomatedComplianceMessagesAPI.createTemplate(template);
  },
  async updateComplianceMessageTemplate(
    templateId: string,
    updates: Partial<ComplianceMessageTemplate>,
  ) {
    return AutomatedComplianceMessagesAPI.updateTemplate(templateId, updates);
  },
  async detectMilestones(clientId: string) {
    return AutomatedComplianceMessagesAPI.detectMilestones(clientId);
  },
  async detectRelapses(clientId: string) {
    return AutomatedComplianceMessagesAPI.detectRelapses(clientId);
  },
  // US-CF-21: Aprobación de testimonios y mensajes antes de publicar
  async getApprovalRequests() {
    return ApprovalManagerAPI.getAll();
  },
  async getPendingApprovals() {
    return ApprovalManagerAPI.getPending();
  },
  async getApprovalConfig() {
    return ApprovalManagerAPI.getConfig();
  },
  async updateApprovalConfig(config: Partial<ApprovalConfig>) {
    const currentConfig = await ApprovalManagerAPI.getConfig();
    return ApprovalManagerAPI.updateConfig({ ...currentConfig, ...config });
  },
  async approveRequest(approvalId: string, approvedBy: string) {
    return ApprovalManagerAPI.approve(approvalId, approvedBy);
  },
  async rejectRequest(approvalId: string, reason: string, rejectedBy: string) {
    return ApprovalManagerAPI.reject(approvalId, reason, rejectedBy);
  },
  // US-CF-22: IA que aprende qué iniciativas generan mayor retención y referidos
  async getInitiativePrioritization(period: CommunityFidelizacionSnapshot['period'] = '30d') {
    return InitiativePrioritizationAPI.getPrioritization(period);
  },
  async generateInitiativePrioritization(period: CommunityFidelizacionSnapshot['period'] = '30d') {
    return InitiativePrioritizationAPI.generatePrioritization(period);
  },
};









