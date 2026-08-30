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
// 2026-08-29: the duplicate pair at the bottom of this file was removed, and THESE
// were removed too — both definitions were wrong in the same way.
//
// Each call built a NEW client. lib/supabase/client.ts across this platform is a
// module-level singleton for a hard-won reason: multiple client instances race on
// the chunked auth cookie and clobber each other, which is what broke OAuth
// sessions once already. A factory that mints a fresh client per call reintroduces
// exactly that.
//
// The lazy singleton getters above are the correct shape, so the aliases below
// point at them.

// Convenience re-exports for code that uses `supabase.from(...)` directly
// These are getters so they initialize lazily
export const supabase = {
  get auth() { return getSupabaseClient().auth },
  from: (table: string) => getSupabaseClient().from(table),
  // 2026-08-29: `args` is typed object and rpc's parameter resolves to never
  // without generated Database types, so TS2345. Cast at the boundary rather than
  // widening the public signature — callers still see `object`.
  rpc: (fn: string, args?: object) => getSupabaseClient().rpc(fn, args as never),
}

export const supabaseAdmin = {
  get auth() { return getSupabaseAdmin().auth },
  from: (table: string) => getSupabaseAdmin().from(table),
  rpc: (fn: string, args?: object) => getSupabaseAdmin().rpc(fn, args as never),
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
// Aliases for components that import specific client creation functions.
//
// 2026-08-29: createClientComponentClient and createServerComponentClient were
// DECLARED TWICE in this file — once at line 28 as fresh-client factories, once
// here as singleton aliases. TS2451 four times, so the module never compiled, and
// because it never compiled every importer of '@/lib/supabase' failed with TS2307.
// Three more errors in this repo were that one cause wearing a different message.
//
// Kept the singleton aliases and deleted the factories: a fresh client per call
// races on the chunked auth cookie, which is what broke OAuth sessions before.
export const createSupabaseBrowserClient = getSupabaseClient
export const createClientComponentClient = getSupabaseClient
export const createServerComponentClient = getSupabaseAdmin
