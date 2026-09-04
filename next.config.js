/** @type {import('next').NextConfig} */
const nextConfig = {
  // 2026-08-29: required for @craudioviz/platform-sdk. The SDK ships raw
  // TypeScript and Next does not run node_modules through SWC by default, so
  // any import carrying a `type` re-export fails the build without this.
  transpilePackages: ["@craudioviz/platform-sdk"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
}

// 2026-08-30: Next 15 compiles instrumentation.ts for the EDGE runtime as well
// as node, so the vault env-shim's `crypto` import is pulled into an edge
// bundle even though register() returns early off nodejs. Marking it
// unavailable for the edge compilation is what stops it. The import must stay
// a BARE `crypto` specifier: webpack rejects the `node:` scheme before
// resolve.fallback is ever consulted, so `node:crypto` fails here too.

// 2026-09-05 Next 16: webpack config removed.
//
// Turbopack is the default builder in Next 16 and refuses to start when a
// webpack config exists with no turbopack equivalent.
//
// This block existed only to disable the crypto fallback on the edge runtime.
// It is scaffolding for a problem Turbopack does not have: node:crypto resolves
// correctly on edge. Proven on javari-logo and javari-forge, both of which built
// and deployed on 16.3.4 with it deleted.
//
// Thirty-seven repos carried a byte-identical copy - one sha256 across all of
// them - so this is one fix applied thirty-seven times, not thirty-seven fixes.
module.exports = { ...nextConfig };
