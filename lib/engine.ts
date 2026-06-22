import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Fail-safe for build time
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Engine will be unavailable.")
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Standardized way to call any of your 10 Index Intelligence Engine (IIE) functions
 */
export const invokeEngine = async (functionName: string, payload: object) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.')
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  })

  if (error) {
    console.error(`Engine Error [${functionName}]:`, error)
    throw error
  }
  return data
}

// Pre-configured function calls for common operations
export const processLead = (message: string, metadata?: object) =>
  invokeEngine('process-lead', { message, metadata })

export const qualifyLead = (leadId: string) =>
  invokeEngine('qualify-ai', { id: leadId })

export const suggestReply = (leadId: string, context?: string) =>
  invokeEngine('suggest-reply', { leadId, context })

export const analyzeConversation = (messages: string[]) =>
  invokeEngine('analyze-conversation', { messages })

export const checkSLA = () =>
  invokeEngine('sla-clock', {})

export const getWeeklyReport = () =>
  invokeEngine('generate-weekly-report', {})

export const getMonthlySummary = () =>
  invokeEngine('generate-monthly-summary', {})

export const checkRevenueLeakage = () =>
  invokeEngine('alert-revenue-leakage', {})

export const executeNBA = (leadId: string) =>
  invokeEngine('nba-executor', { leadId })

export const createCheckout = (items: any[]) =>
  invokeEngine('create-checkout', { items })
