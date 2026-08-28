// lib/supabase.ts — lazy init, no module-level createClient calls
import { createClient as _c } from "@supabase/supabase-js"
import { secretKey, publishableKey, supabaseUrl } from "@craudioviz/platform-sdk";

function getURL() { return supabaseUrl() }
function getANON() { return publishableKey() }
function getSVC() { return secretKey() || getANON() }

// Lazy singletons
let _supabase: ReturnType<typeof _c> | null = null
let _supabaseAdmin: ReturnType<typeof _c> | null = null

export function getSupabaseClient() {
  if (!_supabase) _supabase = _c(getURL(), getANON())
  return _supabase
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) _supabaseAdmin = _c(getURL(), getSVC(), { auth: { persistSession: false } })
  return _supabaseAdmin
}

// Named aliases — call these lazily, not at module scope
export function getSupabase() { return getSupabaseClient() }

// createClient helpers
export const createClient = () => _c(getURL(), getANON())
export const createClientComponentClient = () => _c(getURL(), getANON())
export const createServerComponentClient = () => _c(getURL(), getANON())

// Convenience re-exports for code that uses `supabase.from(...)` directly
// These are getters so they initialize lazily
export const supabase = {
  get auth() { return getSupabaseClient().auth },
  from: (table: string) => getSupabaseClient().from(table),
  rpc: (fn: string, args?: object) => getSupabaseClient().rpc(fn, args),
}

export const supabaseAdmin = {
  get auth() { return getSupabaseAdmin().auth },
  from: (table: string) => getSupabaseAdmin().from(table),
  rpc: (fn: string, args?: object) => getSupabaseAdmin().rpc(fn, args),
}

export async function getUser(c?: ReturnType<typeof createClient>) {
  try {
    const { data: { user } } = await (c ?? getSupabaseClient()).auth.getUser()
    return user
  } catch { return null }
}

export function shouldChargeCredits(e?: string | null) {
  return !["royhenderson@craudiovizai.com"].includes(e ?? "")
}

export function isAdmin(e?: string | null) {
  return !shouldChargeCredits(e)
}
// Aliases for components that import specific client creation functions
export const createSupabaseBrowserClient = getSupabaseClient
export const createClientComponentClient = getSupabaseClient
export const createServerComponentClient = getSupabaseAdmin
