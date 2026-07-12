import type { ProductManifest } from './hhr';

const manifest: ProductManifest = {
  id: 'gcleadhub',
  name: 'GC Lead Hub',
  description: 'AI-powered Contractor Opportunity Intelligence Platform — an IIE Vertical Application',
  languages: ['en', 'es'],
  verticals: [
    'distressed_property',
    'multifamily',
    'commercial_real_estate',
    'industrial_property',
    'government_facilities',
    'education_facilities',
    'healthcare_facilities',
  ],
  navigation: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Opportunities', href: '/opportunities', icon: 'Target' },
    { label: 'Properties', href: '/properties', icon: 'Building2' },
    { label: 'Companies', href: '/companies', icon: 'Briefcase' },
    { label: 'Contacts', href: '/contacts', icon: 'Users' },
    { label: 'Map', href: '/map', icon: 'Map' },
    { label: 'Territories', href: '/territories', icon: 'MapPinned' },
    { label: 'Pipeline', href: '/pipeline', icon: 'Kanban' },
    { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
    { label: 'Reports', href: '/reports', icon: 'BarChart' },
    { label: 'Settings', href: '/settings', icon: 'Settings' },
  ],
  features: ['opportunities', 'crm', 'outreach', 'maps', 'watchlists', 'predictions', 'telemetry', 'campaigns', 'tasks', 'territories', 'opportunity_graph', 'lifecycle_engine', 'evidence_confidence', 'unified_search', 'daily_briefing', 'opportunity_workspace', 'oie', 'ai_reasoning', 'timeline_engine', 'continuous_monitoring', 'relationship_path_engine', 'opportunity_classification', 'relationship_engine', 'ai_crm_assistant', 'decision_maker_mapping', 'win_loss_analysis', 'bid_history', 'communication_timeline', 'outreach_engine', 'ai_writing', 'proposal_generator', 'outreach_automation', 'sequences', 'ai_coach', 'multi_channel', 'spatial_intelligence', 'opportunity_radius', 'route_optimization', 'construction_corridor', 'property_portfolio', 'project_radius', 'market_expansion', 'white_space', 'ai_territory_builder', 'time_machine', 'opportunity_forecast', 'property_intelligence', 'ownership_intelligence', 'permit_intelligence', 'tax_intelligence', 'code_enforcement', 'sales_intelligence', 'environmental_intelligence', 'utility_intelligence', 'zoning_intelligence', 'building_facts', 'ai_property_summary', 'capital_improvement_predictor', 'building_lifecycle_score', 'renovation_probability', 'contractor_history', 'document_intelligence', 'property_digital_twin', 'intelligence_query_layer', 'natural_language_search', 'query_dsl', 'visual_query_builder', 'search_templates', 'ai_search_suggestions', 'ai_query_optimizer', 'smart_recommendations', 'search_analytics', 'semantic_search', 'graph_search', 'federated_search', 'search_collections', 'cross_search_comparison', 'opportunity_delta', 'organization_admin', 'roles_permissions', 'teams', 'audit_logs', 'sso', 'api_keys', 'white_label', 'franchises', 'org_knowledge_base', 'event_driven_jobs', 'distributed_workers', 'ai_workers', 'monitoring_alerts', 'data_governance', 'webhook_delivery', 'ai_agents', 'deployment_environments', 'feature_flags', 'analytics', 'ci_cd', 'backup_dr', 'business_monitoring', 'appendices', 'roadmap', 'integration_boundaries', 'launch_checklist', 'ui_prd', 'hero_search', 'daily_briefing_ui', 'ai_copilot', 'command_palette'],
  permissions: ['owner', 'admin', 'agent', 'viewer'],
};

export default manifest;
