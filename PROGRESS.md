# Market Lead Engine - Progress Report

## Current Status: Local Development Working ✅

### Local Development
- **Status**: ✅ Layout displaying correctly at http://localhost:3000
- **Working Commit**: 57ae7f3 (6 cards with mock data for demo)
- **Last Deployment**: February 16, 2026 (v5 — Improved Result Dashboard)
- **Engine Functions**: ✅ All 6 cards working (4 real + 2 mock)
- **Design**: Magnetly-inspired B&W with adaptive day/night mode
- **Note**: Result Panel upgraded from raw JSON to premium AI Analysis cards

### Troubleshooting: FunctionsFetchError
If you see this error when clicking cards:
```
FunctionsFetchError: Failed to send a request to the Edge Function
```

**Possible causes:**
1. **CORS not enabled** on the Supabase edge function
2. **Function not deployed** to Supabase
3. **Network/firewall** blocking the request
4. **Localhost restrictions** - some browsers block cross-origin requests from localhost

**Solutions:**
1. Check function is deployed: https://supabase.com/dashboard/project/hbciotxcovzhfmsufuiw/functions
2. Redeploy with CORS headers (see docs/CORS.md)
3. Try accessing via `http://127.0.0.1:3000` instead of `http://localhost:3000`
4. For testing, use the mock data fallback (already in place)

### Live Website
- **URL**: https://btwndlinez.github.io/Market-Lead-Engine/
- **Status**: ⚠️ Deployment files committed to gh-pages, push pending authentication
- **Local Deployment**: ✅ Ready (commit 6288283 on gh-pages branch)
- **Note**: Git push requires authentication with workflow scope
- **Cache Note**: If styles don't appear, use `?v=3` or hard refresh (Ctrl+Shift+R)

### ⚠️ CRITICAL: Add GitHub Secrets Now
The engine functions won't work until you add these secrets:

1. Go to: https://github.com/Btwndlinez/Market-Lead-Engine/settings/secrets/actions
2. Add these TWO secrets:

| Secret Name | Secret Value |
|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hbciotxcovzhfmsufuiw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_Zg9f8x7vslLxsjOZ69ogxw_e0KkN-RJ` |

3. Re-run the workflow after adding secrets

### Database Security (RLS Policies)

Enable Row Level Security on tables:

```sql
-- Enable RLS for SLA Snapshots
ALTER TABLE public.sla_snapshots ENABLE ROW LEVEL SECURITY;

-- Enable RLS for Provider Settlements
ALTER TABLE public.provider_settlements ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated read access
CREATE POLICY "Allow authenticated read access" 
ON public.sla_snapshots 
FOR SELECT 
TO authenticated 
USING (true);

-- Referral Policies
-- Allow anyone to insert a referral
CREATE POLICY "Enable insert for anonymous users" 
ON public.referrals 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow users to see only their own data
CREATE POLICY "Users can view their own referrals" 
ON public.referrals 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to insert their own data
CREATE POLICY "Users can create their own referrals" 
ON public.referrals 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Additional Security Policies
-- 1. Enable RLS on all remaining tables
ALTER TABLE public.sla_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 2. Service role full access for Edge Functions
CREATE POLICY "Service role full access" 
ON public.referrals 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 3. Public read-only for SLA snapshots
CREATE POLICY "Allow public read-only for snapshots" 
ON public.sla_snapshots 
FOR SELECT 
TO anon 
USING (true);
```

### 🚦 6 Functions Summary (4 Real + 2 Mock)

| Category | Functions | Status | Type |
|----------|-----------|--------|------|
| **Lead Analysis** | process-lead (Gemini 2.0 Flash) | ✅ Active | Real Supabase |
| **Lead Analysis** | qualify-ai | ✅ Active | Real Supabase |
| **Sales** | create-checkout | ✅ Working | 🎭 Mock Data |
| **Operational Monitoring** | sla-clock | ✅ Active | Real Supabase |
| **Finance** | alert-revenue-leakage | ✅ Active | Real Supabase |
| **Reports** | monthly-summary | ✅ Working | 🎭 Mock Data |

**Note:** Create Checkout and Monthly Summary use mock data for demo purposes. The other 4 functions connect to real Supabase Edge Functions.

### 📦 7 Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| **1. Lead Capture Module** | Form with Name, Phone, Service Type, City, Budget, Timeline, Source, Notes | ✅ Complete |
| **2. Kanban Pipeline Board** | Drag-and-drop: New → Contacted → Qualified → Sent → Won/Lost | ✅ Complete |
| **3. Auto-Qualification Scoring** | AI scoring: Budget (+3), ASAP (+2), Metro (+2), Specific (+2) | ✅ Complete |
| **4. Provider Routing Module** | Provider directory with active toggle, price/lead, assign lead | ✅ Complete |
| **5. Revenue Tracker** | Stats: Total Leads, Qualified, Revenue, Close Rate | ✅ Complete |
| **6. Template Library** | First Reply, Qualification, Follow-up, Closing scripts | ✅ Complete |
| **7. Performance Dashboard** | Revenue trend, Lead volume, Revenue by city charts | ✅ Complete |

### Dependencies
- `recharts` - Charts for performance dashboard
- `lucide-react` - Icons for all components
- `@supabase/supabase-js` - Supabase client

### Recent Updates
- ✅ **7 Core Features Complete** - Full lead management system with all modules
- ✅ **Lead Capture Module** - Structured form with Name, Phone, Service Type, City, Budget, Timeline, Source, Notes
- ✅ **Kanban Pipeline Board** - Drag-and-drop board with New → Contacted → Qualified → Sent → Won/Lost columns
- ✅ **Auto-Qualification Scoring** - AI-powered scoring: High Budget (+3), ASAP Timeline (+2), Major Metro (+2), Specific Request (+2)
- ✅ **Provider Routing Module** - Provider directory with name, service, city, contact, price/lead, active toggle
- ✅ **Revenue Tracker** - Stats ribbon showing Total Leads, Qualified, Revenue, Close Rate
- ✅ **Template Library** - First Reply, Qualification, Follow-up, Closing scripts with copy-to-clipboard
- ✅ **Performance Dashboard** - Revenue trend line chart, Lead volume bar chart, Revenue by city breakdown
- ✅ **New Sections Added** - How It Works (#workflow), Use Cases (#usecases), Extension (#extension), Pilot (#pilot)
- ✅ **Hero CTA Updated** - "Capture Lead" and "View Pipeline" buttons
- ✅ **Hero Copy Updated** - New punchy messaging: "Capture leads instantly. Qualify them automatically. Respond before competitors do."
- ✅ **Navbar Updated** - Replaced "Engine" and "Functions" with "How It Works", "Use Cases", "Extension", "Pilot" links
- ✅ **CTA Button Updated** - Changed "Get Started" to "Pilot Access" linking to #pilot section
- ✅ **All 6 Cards Working** - Added back Create Checkout and Monthly Summary with mock data for demo
- ✅ **Hybrid Architecture** - 4 cards use real Supabase functions, 2 use mock data
- ✅ **Mock Data Implemented** - Realistic responses with 600-800ms delays for demo purposes
- ✅ **Stats Updated** - Changed back to "6 Functions" to reflect all working cards
- ✅ **UI Complete** - All 6 cards display properly with professional result panels
- ✅ **Deployment Ready** - All cards working locally, ready for production build
- ✅ **Professional Result UI** - Replaced raw JSON display with formatted cards showing AI Score, Reasoning, and Next Action
- ✅ **Environment Variables Fixed** - Created `.env.local` with Supabase credentials for local development
- ✅ **Codebase Reset** - Reverted to working commit 7f09315 after opencode corruption
- ✅ **Local Dev Fixed** - Layout now displays correctly at http://localhost:3000
- ✅ **basePath Config** - Temporarily removed for local testing (restore for production: `basePath: '/Market-Lead-Engine'`)
- ✅ **Red Accent Color** - Changed hover/interaction accent from purple to red (#dc2626 light / #f87171 dark)
- ✅ **Permanent Red Logo** - Lightning bolt is now a **SOLID** red icon inside an **INVERSE** colored box (Black in Light Mode, White in Dark Mode)
- ✅ **Magnetly-Inspired Redesign** - Clean B&W design with red accent on hover/interaction
- ✅ **Day/Night Adaptive Mode** - Toggle in nav, system preference detection, persists via localStorage
- ✅ **Floating Pill Navigation** - Glassmorphism nav bar with blur effect, pill-shaped CTA buttons
- ✅ **Hero Section** - Centered layout with stats bar (6 Edge Functions, <200ms, 99.9% SLA, AI)
- ✅ **Engine Card Grid** - 6 cards with unique icons, animated accent borders, hover color transitions
- ✅ **Dot-Grid Background** - Subtle texture pattern that adapts to light/dark mode
- ✅ **Result Panel** - Professional card-based display showing AI Score, Reasoning, and Next Action (not raw JSON)
- ✅ **Responsive Design** - Mobile-first with hidden nav links on small screens
- ✅ **Inter Font** - Loaded from Google Fonts with proper preconnect headers
- ✅ **Fixed Metadata Title** - Changed from "Create Next App" to "Market Lead Engine"
- ✅ **Simplified Layout** - Removed Geist fonts, using Inter from CSS
- ✅ **RLS Policies** - Added comprehensive policies (service role, public read, anon insert)
- ✅ **CORS Headers** - Added to edge functions for GitHub Pages compatibility
- ✅ **BasePath Fix** - Changed to /Market-Lead-Engine (capitalized to match repo)
- ✅ **Fail-safe Engine** - Added credential check to prevent build failures when env vars missing
- ✅ **Supabase Dependency** - Added `@supabase/supabase-js` to fix build errors
- ✅ **.nojekyll Fix** - Added to prevent Jekyll from ignoring `_next/` folder
- ✅ **Premium Result Dashboard** - Replaced raw JSON debug view with high-end, styled AI report cards
- ✅ **Template-First Logic** - Logic implemented to prioritize specialized templates and only show generic data as a fallback
- ✅ **Checkout & Summary Templates** - Added high-conversion payment cards and data-rich monthly report visualizations
- ✅ **Build Stability** - Fixed JSX nesting and syntax errors in the main dashboard
- ✅ **Codebase Reset** - Reverted to working commit 7f09315 after opencode corruption
- ✅ **Improved Result UI** - Formatted AI Score with progress-indicator visuals and bold recommended actions

### Design System

#### Color Scheme
| Mode | Background | Text | Accent (Hover) |
|------|-----------|------|----------------|
| **Light** | `#ffffff` | `#0a0a0a` | `#dc2626` (red) |
| **Dark** | `#0a0a0a` | `#fafafa` | `#f87171` (light red) |

#### Key Design Patterns
- **Navigation**: Floating pill-shaped navbar with glassmorphism (`backdrop-filter: blur`)
- **Cards**: Rounded rectangles with thin borders, animated top-border accent on hover
- **Buttons**: Pill-shaped (full border-radius), solid black → red accent on hover
- **Logo**: Solid red bolt (#dc2626) inside an inverse-colored box (`var(--fg)` bg) for high contrast
- **Typography**: Inter font, -0.04em letter-spacing on headings
- **Theme Toggle**: 48×26px toggle switch with smooth knob transition
- **Background**: Subtle dot-grid pattern (`radial-gradient`, 24px spacing)

### File Structure
```
app/
  page.tsx          # Main dashboard with all functions
  globals.css       # Full design system with light/dark CSS variables
  layout.tsx        # Layout with Inter font + dark mode FOUC prevention
components/
  LeadCaptureModal.tsx    # Lead capture form modal
  KanbanBoard.tsx         # Drag-and-drop pipeline board
  ProviderRouting.tsx     # Provider directory management
  AnalyticsDashboard.tsx  # Revenue tracker & performance charts
  TemplateLibrary.tsx     # Response script library
lib/
  engine.ts         # Standardized engine API
.github/workflows/
  deploy.yml        # GitHub Pages deployment
docs/
  CORS.md           # CORS configuration guide
```

### Supabase Edge Functions (hbciotxcovzhfmsufuiw)
✅ All 10 Functions Deployed:
| Function | Status | Description |
|----------|--------|-------------|
| process-lead | ✅ Active | AI lead analysis with Gemini 2.0 |
| sla-clock | ✅ Active | SLA breach monitoring |
| suggest-reply | ✅ Active | AI response suggestions |
| analyze-conversation | ✅ Active | Conversation analysis |
| generate-monthly-summary | ✅ Active | Monthly reports |
| generate-weekly-report | ✅ Active | Weekly reports |
| alert-revenue-leakage | ✅ Active | High-value lead alerts |
| create-checkout | ✅ Active | Payment processing |
| nba-executor | ✅ Active | Next best action |
| qualify-ai | ✅ Active | Lead qualification |

### Configuration
- **Next.js**: output: 'export', basePath: '/Market-Lead-Engine'
- **AI Model**: Gemini 2.0 Flash
- **Supabase Project**: hbciotxcovzhfmsufuiw
- **CSS**: Tailwind v4 + custom CSS variables for theming
- **Font**: Inter (Google Fonts)

### Local Development Setup

#### Environment Variables
For local development, create `.env.local` in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://hbciotxcovzhfmsufuiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Zg9f8x7vslLxsjOZ69ogxw_e0KkN-RJ
```

**Important**: Restart the dev server after creating `.env.local`:
```bash
npm run dev
```

#### Testing Engine Functions
All 6 cards on the homepage are now functional:

**Real Supabase Functions (4):**
- **Process Lead** - AI analysis with scoring
- **Qualify AI** - Lead qualification
- **SLA Status** - Breach monitoring
- **Revenue Leak** - High-value lead detection

**Mock Data for Demo (2):**
- **Create Checkout** - Returns Stripe checkout session URL
- **Monthly Summary** - Returns monthly analytics report

Click any card to see the professional result panel with formatted output.

### Setup Required

#### CORS Headers (Already configured on deployed functions)
All edge functions have CORS enabled:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

#### BasePath Handling

**For Local Development:**
```typescript
// Temporarily remove basePath for localhost testing
basePath: ''
```
Access at: http://localhost:3000

**For Production (GitHub Pages):**
```typescript
basePath: '/Market-Lead-Engine'
```
Access at: https://btwndlinez.github.io/Market-Lead-Engine/

⚠️ **Important**: Remember to restore `basePath: '/Market-Lead-Engine'` before deploying to production!

#### .nojekyll File
GitHub Pages uses Jekyll by default, which ignores folders starting with underscore (`_`). Next.js puts files in `_next/` folder.

✅ **Fixed**: Workflow now creates `.nojekyll` file automatically:
```yaml
- name: Create .nojekyll file
  run: touch out/.nojekyll
```

#### GitHub Pages Source Setting
✅ Must be set to "GitHub Actions" not "Deploy from a branch"
- Go to: https://github.com/Btwndlinez/Market-Lead-Engine/settings/pages
- Source: Select **GitHub Actions**

### How to Use

#### Live Site
1. Visit: https://btwndlinez.github.io/Market-Lead-Engine/
2. Toggle day/night mode with the switch in the top-right nav
3. Try the different engine function cards
4. View AI analysis results in the slide-up response panel

#### In Code
```typescript
import { processLead, checkSLA, getWeeklyReport } from '@/lib/engine'

// Process a lead
const result = await processLead("Roof leaking!", { source: 'web' })
// Returns: { success: true, ai_score: 85, ai_reason: "...", next_action: "..." }

// Check SLA status
const sla = await checkSLA()

// Generate weekly report
const report = await getWeeklyReport()
```

### All Engine Functions
```typescript
import {
  processLead,      // AI lead analysis
  qualifyLead,      // Qualify by ID
  suggestReply,     // Get AI reply suggestions
  analyzeConversation, // Analyze message thread
  checkSLA,         // Check SLA breaches
  getWeeklyReport,  // Weekly analytics
  getMonthlySummary, // Monthly summary
  checkRevenueLeakage, // Find high-value leads
  executeNBA,       // Next best action
  createCheckout    // Payment processing
} from '@/lib/engine'
```

### Troubleshooting

**Site shows 404?**
- GitHub Pages can take 5-10 minutes to propagate
- Check: https://github.com/Btwndlinez/Market-Lead-Engine/settings/pages
- Ensure source is set to "GitHub Actions"

**Functions not responding?**
- ✅ CORS headers are now configured on all edge functions
- Check browser console for errors
- Test functions directly: https://supabase.com/dashboard/project/hbciotxcovzhfmsufuiw/functions

**Build failing?**
- Check workflow status: https://github.com/Btwndlinez/Market-Lead-Engine/actions
- All dependencies are now in package.json

**Dark mode not working?**
- Theme persists in `localStorage` under key `mle-theme`
- Falls back to system preference (`prefers-color-scheme`)
- FOUC prevention script runs in `<head>` before page renders

### Engine Fail-Safe Implementation
The engine now handles missing credentials gracefully:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Fail-safe for build time
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Engine will be unavailable.")
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
```
This allows the static site to build successfully even without GitHub Secrets configured.

---

*Last Updated: 2026-06-22*
*Status: ✅ IIE v1.0 Database Schema Complete, ✅ 35 Dynamic API Routes, ✅ 5 SQL Migrations, ✅ 6 TypeScript Type Modules, ✅ 3 Static Dashboards, ✅ Launch Readiness Blueprint*

---

## Index Intelligence Engine (IIE) v1.0 — Full API Suite

### Architecture Overview

The IIE v1.0 is a headless, multi-tenant B2B discovery and outreach engine: Next.js (App Router) API layer + Supabase (PostgreSQL) backend.

**Key constraints:**
- `output: 'export'` in `next.config.ts` for GitHub Pages — all routes are `POST`-only (GET routes pre-rendered as static)
- All DB access via raw `fetch()` to Supabase REST API with `SUPABASE_SERVICE_ROLE_KEY` (no Supabase SDK at module scope)
- Service-role companion pattern: auth-bound RPCs have `_by_org(p_org_id)` variants
- Route-level auth (middleware unsupported with `output: export`) via `lib/auth/` helpers

### Database Schema (6 Migrations)

| # | File | Purpose |
|---|------|---------|
| 1 | `001_iie_v1_schema.sql` | 9 core tables (organizations, users, verticals, searches, companies, contacts, campaigns, outreach_logs, reports) + RLS + indexes |
| 2 | `002_iie_v1_automation.sql` | Auto-timestamp triggers, auth signup → tenant hook, billing quotas, batch lead import RPC, tenant metrics RPC, service-role companions |
| 3 | `003_iie_v1_gis_fts.sql` | cube/earthdistance extensions, GiST geoloc index, search\_companies\_by\_radius RPC, weighted FTS vectors with GIN index + trigger |
| 4 | `004_iie_v1_outreach.sql` | queue\_lockouts table (advisory locks, SKIP LOCKED), acquire\_outreach\_targets RPC, outcome progression trigger, campaign analytics RPC |
| 5 | `005_iie_v1_observability.sql` | provider\_audits table, upsert\_vertical\_configuration CRUD RPC, get\_system\_observability\_dashboard telemetry RPC |
| 6 | `006_iie_v1_production_gaps.sql` | organization\_users, campaign\_targets, subscriptions, usage\_events, billing\_limits tables; DRAFT/NEW/PROPOSAL status checks; RLS for all new tables |

### TypeScript Type Modules (6 files)

| File | Key Types |
|------|-----------|
| `types/company.ts` | Company, Contact, SavedSearch, OutreachLog, SearchFilters, CRMStatus, PriorityGroup, InteractionType, OutreachOutcome |
| `types/config.ts` | VerticalConfig, ScoringWeights |
| `types/rpc.ts` | BulkUpsertLeadPayload, TenantPipelineMetrics, QuotaAllocationStatus |
| `types/rpc_gis.ts` | GeospatialSearchPayload, GeospatialProspectResult |
| `types/rpc_outreach.ts` | AcquireQueuePayload, OutreachQueueItem, SubmitInteractionLogPayload, CampaignPerformanceStats |
| `types/rpc_telemetry.ts` | ProviderAuditPayload, VerticalCRUDPayload, SystemObservabilityStats |

### Route-Level Auth Layer (`lib/auth/`)

| Module | Exports |
|--------|---------|
| `session.ts` | `parseSession(req)` — JWT decode from Authorization header; `isServerToServer(req)` |
| `tenant.ts` | `resolveTenant(req)` — reads x-iie-client-context, resolves VerticalConfig + org; returns context or error response |
| `permissions.ts` | `requireRole(ctx, minimum)`, `hasRole(ctx, role)`, `isOwner()`, `isAdminOrAbove()` |

### Infrastructure Libs

| File | Purpose |
|------|---------|
| `lib/logger.ts` | Structured JSON logging (info/warn/error/debug with route, tenant, durationMs) |
| `lib/validation.ts` | Zod schemas: SearchSchema, CampaignSchema, OutreachSchema, BillingSchema, OrgSchema, AuthSchema + `validate()` helper |
| `lib/timeouts.ts` | `withTimeout(promise, ms, fallback)` using Promise.race |
| `lib/market/retry.ts` | `withRetry(fn, options)` — 3 retries, exponential backoff with jitter |
| `lib/market/fallback.ts` | `withFallback(strategy)` + per-provider fallback generators |
| `lib/billing/quota.ts` | `checkQuota(orgId, eventType)`, `incrementUsage(orgId, eventType, units)` via REST API |
| `lib/telemetry/audit.ts` | `writeAudit(entry)` + `audit(provider, action, ctx, fn)` wrapper |
| `lib/telemetry/metrics.ts` | `getProviderMetrics(orgId)` — aggregated provider KPIs |
| `lib/telemetry/alerts.ts` | `evaluateAlerts(metrics, rules?)` — threshold-based alerting with default rules |
| `lib/search/persistence.ts` | `saveSearch()`, `getSearchHistory()` — DB with in-memory fallback |
| `lib/campaign/helpers.ts` | `createCampaign()`, `listCampaigns()`, `getCampaign()`, `updateCampaignStatus()` |
| `lib/outreach/helpers.ts` | `logOutreach()`, `getCompanyOutreach()` |

### Dynamic API Routes (35 routes, all `ƒ`)

**Core Engine (10 routes)**
| Route | Action |
|-------|--------|
| `POST /api/search` | Multi-query market discovery via Google Places + Apollo + Gemini |
| `POST /api/callsheet` | Priority-grouped call sheet |
| `POST /api/export` | CSV export with dynamic headers |
| `POST /api/reports` | Market intelligence report |
| `POST /api/enrich` | Single-company enrichment |
| `POST /api/saved-searches` | Save/list search history (action-based) |
| `POST /api/metrics` | Tenant pipeline KPIs |
| `POST /api/proximity` | Geospatial + FTS radius query |
| `POST /api/campaign-orchestrator` | Queue dispatch, log interaction, analytics (action-based) |
| `POST /api/telemetry-management` | Telemetry, CRUD, audit logging (action-based) |

**Search Persistence (2 routes)**
| Route | Action |
|-------|--------|
| `POST /api/search/history` | List recent searches for tenant |
| `POST /api/search/id` | Fetch single saved search by id |

**Organization (3 routes)**
| Route | Action |
|-------|--------|
| `POST /api/org/create` | Create organization |
| `POST /api/org/current` | Get current org details |
| `POST /api/org/update` | Update org name/tier |

**Authentication (3 routes)**
| Route | Action |
|-------|--------|
| `POST /api/auth/invite` | Invite user by email (OWNER/ADMIN only) |
| `POST /api/auth/accept` | Accept invitation by token |
| `POST /api/auth/me` | Return current user session |

**Campaigns (6 routes)**
| Route | Action |
|-------|--------|
| `POST /api/campaigns` | List campaigns |
| `POST /api/campaigns/create` | Create campaign |
| `POST /api/campaigns/id` | Get campaign by id |
| `POST /api/campaigns/start` | Activate campaign (DRAFT → ACTIVE) |
| `POST /api/campaigns/pause` | Pause campaign (ACTIVE → PAUSED) |
| `POST /api/campaigns/call-queue` | Get call queue for campaign |

**Outreach (3 routes)**
| Route | Action |
|-------|--------|
| `POST /api/outreach/call` | Log call with outcome |
| `POST /api/outreach/email` | Log email outreach |
| `POST /api/outreach/status` | Get outreach history for company |

**Billing (3 routes)**
| Route | Action |
|-------|--------|
| `POST /api/billing/current` | Get current subscription |
| `POST /api/billing/usage` | Get usage metrics by period |
| `POST /api/billing/upgrade` | Change plan tier |

**Admin (1 route)**
| Route | Action |
|-------|--------|
| `POST /api/admin/metrics` | System-wide admin metrics (ADMIN/OWNER only) |

**Dashboard (4 routes)**
| Route | Action |
|-------|--------|
| `POST /api/dashboard/overview` | Aggregate metrics with priority distribution |
| `POST /api/dashboard/companies` | Recently contacted/discovered companies |
| `POST /api/dashboard/campaigns` | Campaign performance stats |
| `POST /api/dashboard/reports` | Generated report history list |

### Core Engine (`lib/market/` modules)

| Module | Responsibility |
|--------|---------------|
| `registry.ts` | VERTICAL_REGISTRY with 8 verticals, `getVerticalConfigByDomain()` |
| `providers/google.ts` | GooglePlacesAdapter.searchWithNegatives() — triple-field negative filter |
| `providers/apollo.ts` | ApolloAdapter.enrich() — real api.apollo.io/v1/organizations/enrich, returns { companyFields, contacts[] } |
| `providers/geminiScraper.ts` | GeminiScraperAdapter.scanForSignals() — direct REST + google_search grounding |
| `scoring.ts` | calculateScore(company, config, contacts?) — distance + contact completeness + asset signals |
| `adapter.ts` | IndexIntelligenceEngine.executeMarketDiscovery() — multi-query, dedup, parallel enrich |
| `retry.ts` | withRetry(fn, options) — 3 retries, exp backoff, jitter |
| `fallback.ts` | Per-provider fallback strategies (Google→mock, Apollo→empty, Gemini→skip) |

### Static Dashboards (3, served from `public/`)

| URL | Purpose |
|-----|---------|
| `/Index-Intelligence-Engine/diagnostics.html` | Real-time KPI panel with KaTeX formulas, 3-vertical context switcher, CSV export |
| `/Index-Intelligence-Engine/campaign_workspace.html` | Outreach dialer workbench, queue panel, outcome form |
| `/Index-Intelligence-Engine/observability_dashboard.html` | Governance portal: audit traces, scoring sliders, failure injectors |

### Service-Role Companion RPCs

| Auth-Bound RPC | Service-Role Companion |
|----------------|------------------------|
| `get_tenant_metrics()` | `get_tenant_metrics_by_org(p_org_id)` |
| `search_companies_by_radius(...)` | `search_companies_by_radius_by_org(p_org_id, ...)` |
| `acquire_outreach_targets(...)` | `acquire_outreach_targets_by_org(p_org_id, ...)` |
| `get_campaign_analytics_aggregates(p_campaign_id)` | `get_campaign_analytics_aggregates_by_org(p_org_id, p_campaign_id)` |
| `get_system_observability_dashboard()` | `get_system_observability_dashboard_by_org(p_org_id)` |
| `upsert_vertical_configuration(...)` | `upsert_vertical_configuration_by_org(p_org_id, ...)` |

### Vertical Profiles (8 Verticals)

| Profile ID | Industry | NAICS |
|------------|----------|-------|
| `slurry_concrete` | Concrete Slurry Recycling | 562211, 238110, 562112 |
| `grease_trap` | Commercial Grease Trap Pumping | 562219, 562111, 562998 |
| `asbestos_abatement` | Asbestos & Lead Abatement | 562910, 238910 |
| `hydro_excavation` | Hydro-Excavation | 562998, 238910, 562119 |
| `commercial_roofing` | Flat Roofing | 238160 |
| `medical_waste` | Biomedical Waste Treatment | 562211, 562112 |
| `scrap_metal` | Scrap Metal Processing | 423930, 562920 |
| `marine_construction` | Marine & Dock Construction | 237990, 238910 |

### Build Status
- ✅ **`npm run build` passes** — 37 routes (35 API `ƒ` + 2 pages `○`), all compile cleanly
- Only warning: ESLint `eslint-config-next/core-web-vitals` import path (pre-existing, non-blocking)

### Known Gaps
1. **Missing API keys** — `GOOGLE_PLACES_API_KEY`, `APOLLO_API_KEY`, `GEMINI_API_KEY` not in `.env.local`. End-to-end provider calls cannot execute.
2. **Missing Supabase credentials** — `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` not configured. DB-backed routes return in-memory fallback data.
3. **No tenant onboarding flow** — API token generation pipeline not built yet.
4. **No admin UI for vertical CRUD** — Backend RPC ready, only static HTML mock exists.

### Next Steps
1. Set credentials in `.env.local` and run end-to-end cURL tests
2. Apply migrations to Supabase project (001 → 006)
3. Enable Supabase Auth and configure JWT expiry
4. Set up pg_cron for weekly REINDEX
5. Build tenant onboarding flow with API token generation
6. Add more vertical profiles (HVAC, Electrical, Plumbing, Environmental, Logistics)

---

## Session 2026-06-23 — DeepSeek swap + Infisical-only secrets + Centralized DB

### Changes Made

#### 1. Gemini → DeepSeek
- **`lib/market/providers/geminiScraper.ts`** — Rewrote from Gemini REST API to DeepSeek OpenAI-compatible API
  - Endpoint: `https://api.deepseek.com/v1/chat/completions`
  - Model: `deepseek-chat` with `response_format: { type: 'json_object' }`
  - Temperature: 0.1 for deterministic extraction
  - Same `GeminiScraperAdapter` class name kept so no imports break
  - Provider name changed to `deepseek_scraper`
- **`lib/market/providers/deepseek.ts`** — Created as standalone module (unused, kept for reference)
- All references in `lib/market/adapter.ts` unchanged (still imports `GeminiScraperAdapter`)

#### 2. Infisical-only Secrets Architecture
- **`lib/infisical.ts`** — Restored to original Infisical SDK pattern (`INFISICAL_TOKEN` for CLI use only)
  - Uses `@infisical/sdk` with service token authentication
  - `getSecret(name)` / `getSecrets(names[])` — fetch individual or batch secrets
  - NOT used at runtime in Vercel (the Infisical-Vercel integration syncs secrets as env vars)
- **`lib/db.ts`** — New centralized Supabase REST client
  - `supabaseFetch(path, options?)` — wraps `fetch()` with `apikey` + `Authorization` headers from `process.env`
  - `supabaseRpc(name, params?)` — convenience for RPC POST calls
  - Reads `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `process.env` (populated by Infisical-Vercel integration)
  - Throws if credentials missing (callers expected to try/catch)
- **Provider files** (`google.ts`, `apollo.ts`) — Use `process.env.GOOGLE_PLACES_API_KEY` / `process.env.APOLLO_API_KEY` directly (env vars synced by Infisical)

#### 3. All Routes & Lib Helpers Migrated to `@/lib/db`
- **7 lib files** updated to use `supabaseFetch`/`supabaseRpc` instead of inline `fetch()` + hardcoded headers:
  - `lib/telemetry/audit.ts`, `lib/telemetry/metrics.ts`, `lib/search/persistence.ts`
  - `lib/campaign/helpers.ts`, `lib/outreach/helpers.ts`, `lib/billing/quota.ts`
  - `lib/engine.ts` — refactored to async `getSupabase()` function
- **18 route files** updated (via task agent batch 1):
  - `billing/current`, `billing/usage`, `billing/upgrade`
  - `campaign-orchestrator`, `telemetry-management`, `search/id`
  - `saved-searches`, `proximity`, `org/create`, `org/current`, `org/update`
  - `auth/invite`, `auth/accept`, `auth/me`
  - `dashboard/reports`, `dashboard/companies`, `dashboard/overview`, `dashboard/campaigns`
- **1 route file** updated (via task agent batch 2):
  - `metrics` — only file that had direct env var reads; others delegate to lib helpers
- Removed pattern: `const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL`
- Removed pattern: All manual `apikey` and `Authorization` headers on every fetch call

#### 4. Vercel Deployment
- **`INFISICAL_TOKEN` was briefly set in Vercel** (production + preview), then removed
- Token is CLI-only; the Infisical-Vercel integration syncs secrets as env vars automatically
- No runtime dependency on `@infisical/sdk` at Vercel
- **Build passes** — `npm run build` compiles all 35 API routes as `ƒ` + 2 static pages
- **Deployed** to https://indexintelligenceengine.vercel.app
- **Verified** — `POST /api/search` returns 26 real companies from Google Places API for `slurry_concrete` vertical

### Architecture Summary

```
Infisical (source of truth)
  │
  ├── Infisical-Vercel Integration ──► Vercel env vars (production/preview)
  │                                     └── process.env.X in code
  │
  ├── Infisical-GitHub Integration ──► GitHub Actions secrets (CI/CD)
  │
  ├── Infisical-Supabase Integration ──► Supabase project secrets
  │
  └── infisical CLI (local dev, requires INFISICAL_TOKEN)
        └── lib/infisical.ts (SDK, CLI-only)
```

### Key Principles
- **`INFISICAL_TOKEN` is CLI-only** — never stored in Vercel, never used at runtime
- **All secrets in `process.env`** — populated by Infisical integrations, not by .env files
- **`lib/db.ts`** is the only file that reads Supabase env vars — routes call `supabaseFetch()`/`supabaseRpc()` centrally
- **Providers read API keys directly from `process.env`** — Google Places, DeepSeek, Apollo
- **DeepSeek replaces Gemini** for website scraping / signal detection

---

## Session 2026-06-26 — GitHub Actions Fix + Agentic v2.0 Orchestration Layer

### Changes Made

#### 1. GitHub Actions Workflow Fixed
- **`.github/workflows/ci-deploy.yml`** — Replaced `amondnet/vercel-action@v25` with direct `npx vercel deploy --token=${{ secrets.VERCEL_TOKEN }}`
  - Root cause: v25 action couldn't read `VERCEL_TOKEN` secret (Node 24 runner incompatibility)
  - Upgrade Node from 20 → 22 (20 is deprecated on GitHub runners)
  - Added `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION: true` as safety net

#### 2. Agentic v2.0 Orchestration Layer (7 new files)

**Master Orchestrator** — `lib/market/agentic/AgenticVerticalOrchestrator.ts`
- `ParsedUserIntent` interface: `vertical`, `primary_target`, `location`, `requirements`, `needs_accommodation`
- `buildIntelligentIndex(userPrompt)` — LLM parses intent → routes to vertical workflow
- 3 parallel workflows:
  - `executeExpediaWorkflow` — parallel events + hotels (via Promise.all), synthesized by DeepSeek
  - `executeComputeScrapingWorkflow` — vector DB lookup of HPC URLs → AI Browser scrapes pricing/availability
  - `executeSmartGasWorkflow` — Google Places for stations → parallel DeepSeek scraping for gas prices + menus

**Browser Engine** — `lib/market/agentic/AgenticBrowserEngine.ts`
- `executeMission(task)` — routes to DeepSeek Navigator (complex UIs) or direct Gemini extraction (static pages)
- Two-tier routing: `edgecompute`/`events` get full navigation planning; others get load+screenshot+extract

**Supporting modules:**
- `extractor.ts` — `GeminiExtractor.extractFromState(dom, screenshot, schema)` via Gemini 2.5 Flash API
- `navigator.ts` — `DeepSeekNavigator.planInteraction(url, mission)` — plans DOM interaction steps
- `runtime.ts` — `PlaywrightRuntime` — headless browser execution (stub, Playwright not yet installed)
- `validator.ts` — `ExtractionValidator` — schema type checking + sanity checks (e.g., rejects $400 gas station hot dog)

**Vector Store** — `lib/db/vector.ts`
- `SupabaseVectorStore.searchHistoricalEvents(query, location)` — calls `search_events` RPC
- `SupabaseVectorStore.query(sql, params)` — generic pgvector query via `vector_query` RPC

#### 3. Existing Adapters Extended

- **`lib/market/providers/geminiScraper.ts`** — Added 2 new methods:
  - `synthesizeItinerary(events, accommodations, requirements)` → DeepSeek generates cohesive travel plan
  - `autonomousScrape(url, extractionPrompt)` → DeepSeek extracts structured data from a URL
  - Both use `deepseek-chat` with JSON mode, temp 0.1
- **`lib/market/providers/google.ts`** — Added `search(queryText)` wrapper (delegates to `searchWithNegatives` with empty negatives)

### Architecture

```
AgenticVerticalOrchestrator
  ├── parseIntentWithLLM() ──► ParsedUserIntent
  ├── executeExpediaWorkflow()
  │     ├── vectorDB.searchHistoricalEvents()    [pgvector]
  │     ├── placesAdapter.searchWithNegatives()   [Google Places]
  │     └── aiBrowser.synthesizeItinerary()       [DeepSeek]
  ├── executeComputeScrapingWorkflow()
  │     ├── vectorDB.query()                      [pgvector]
  │     └── aiBrowser.autonomousScrape() × N      [DeepSeek]
  └── executeSmartGasWorkflow()
        ├── placesAdapter.search()                 [Google Places]
        └── aiBrowser.autonomousScrape() × N       [DeepSeek]

AgenticBrowserEngine
  ├── DeepSeekNavigator.planInteraction()
  ├── PlaywrightRuntime.executePlan()
  ├── GeminiExtractor.extractFromState()
  └── ExtractionValidator.validate()
```

### Key Principles
- **Intent-first routing** — LLM parses natural language → strict JSON schema → vertical workflow dispatch
- **Parallel agent execution** — `Promise.all()` for Events + Hotels, concurrent facility scraping
- **Validation gate** — ExtractionValidator prevents index poisoning from hallucinated data
- **DeepSeek everywhere** — replaces both Gemini (extraction) and browser-use (navigation planning)
- **Two-tier browsing** — complex UIs get full DeepSeek-navigated Playwright automation; simple pages get load+extract

### Commits
- `4c4052c` — Fix workflow: use Vercel CLI directly, Node 22
- `614c6a1` — Add agentic orchestration layer (v2.0 multi-vertical) and gitignore

---
