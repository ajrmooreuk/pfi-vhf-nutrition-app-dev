/**
 * VHF Token Bridge — F4.2
 *
 * Loads DS-ONT instance JSONLD and applies brand tokens as CSS custom properties.
 * Reads tokenOverrides from the app skeleton ZoneComponent (ds:cmp-vhf-context-bar)
 * plus DS-ONT primitive/semantic token values if available.
 *
 * Priority order (highest wins):
 *   1. Skeleton ZoneComponent ds:tokenOverrides (VHF Viridian brand)
 *   2. DS-ONT instance primitive + semantic tokens
 *   3. viewer.css defaults (:root)
 */

import { state } from './state.js';

// Mapping from DS-ONT token names to CSS custom property names
const TOKEN_NAME_TO_CSS = {
  // Colour tokens
  'color-primary':          '--ds-color-primary',
  'color-primary-hover':    '--ds-color-primary-hover',
  'color-primary-light':    '--ds-color-primary-light',
  'color-secondary':        '--ds-color-secondary',
  'color-secondary-hover':  '--ds-color-secondary-hover',
  'surface-default':        '--ds-surface-default',
  'surface-brand':          '--ds-surface-brand',
  'surface-subtle':         '--ds-surface-subtle',
  'surface-muted':          '--ds-surface-muted',
  'text-primary':           '--ds-text-primary',
  'text-secondary':         '--ds-text-secondary',
  'text-muted':             '--ds-text-muted',
  'text-on-brand':          '--ds-text-on-brand',
  'border-default':         '--ds-border-default',
  'border-subtle':          '--ds-border-subtle',
  // Typography
  'font-family':            '--ds-font-family',
  'font-size-base':         '--ds-font-size-base',
  'font-size-sm':           '--ds-font-size-sm',
  'font-size-lg':           '--ds-font-size-lg',
  // Spacing
  'spacing-xs':             '--ds-spacing-xs',
  'spacing-sm':             '--ds-spacing-sm',
  'spacing-md':             '--ds-spacing-md',
  'spacing-lg':             '--ds-spacing-lg',
  'spacing-xl':             '--ds-spacing-xl',
  // Radius
  'radius-sm':              '--ds-radius-sm',
  'radius-md':              '--ds-radius-md',
  'radius-lg':              '--ds-radius-lg',
  'radius-full':            '--ds-radius-full',
};

/**
 * Load DS-ONT instance JSONLD and build a token map.
 * @param {string} tokenPath - Relative path to vhf-viridian-ds-instance-v1.0.0.jsonld
 * @returns {Promise<Object>} tokenMap: CSS var name → value
 */
async function loadTokensFromDSONT(tokenPath) {
  const tokenMap = {};
  try {
    const resp = await fetch(tokenPath + '?_t=' + Date.now(), { cache: 'no-store' });
    if (!resp.ok) {
      console.warn(`[tokens] DS-ONT instance not found at ${tokenPath}`);
      return tokenMap;
    }
    const jsonld = await resp.json();
    const graph = jsonld?.['@graph'] || [];

    for (const node of graph) {
      // ds:DesignToken nodes have ds:tokenName and ds:tokenValue
      if (!node['ds:tokenName']) continue;
      const name = node['ds:tokenName'];
      const value = node['ds:tokenValue'] || node['ds:resolvedValue'];
      if (!value) continue;

      const cssVar = TOKEN_NAME_TO_CSS[name];
      if (cssVar) {
        tokenMap[cssVar] = value;
      }
    }

    console.log(`[tokens] Loaded ${Object.keys(tokenMap).length} token overrides from DS-ONT`);
  } catch (err) {
    console.warn('[tokens] Failed to load DS-ONT instance:', err.message);
  }
  return tokenMap;
}

/**
 * Extract tokenOverrides from skeleton ZoneComponents.
 * The VHF context-bar component carries ds:tokenOverrides with Viridian brand values.
 * @param {Object} skeleton - Parsed skeleton
 * @returns {Object} tokenMap: CSS var name → value
 */
function extractSkeletonTokenOverrides(skeleton) {
  const tokenMap = {};
  for (const cmp of (skeleton.zoneComponents || [])) {
    const overrides = cmp['ds:tokenOverrides'];
    if (!overrides || typeof overrides !== 'object') continue;
    for (const [cssVar, value] of Object.entries(overrides)) {
      // Accept both --ds-* vars and plain names
      const key = cssVar.startsWith('--') ? cssVar : `--${cssVar}`;
      tokenMap[key] = value;
    }
  }
  const count = Object.keys(tokenMap).length;
  if (count > 0) console.log(`[tokens] ${count} token overrides from skeleton`);
  return tokenMap;
}

/**
 * Apply a token map to :root as CSS custom properties.
 * @param {Object} tokenMap - { '--ds-color-primary': '#007c74', ... }
 */
function applyTokensToRoot(tokenMap) {
  const root = document.documentElement;
  for (const [cssVar, value] of Object.entries(tokenMap)) {
    root.style.setProperty(cssVar, value);
  }
}

/**
 * Main entry point: load DS-ONT tokens + skeleton overrides, apply to :root.
 * Called by app.js during initialisation.
 *
 * @param {string} tokenPath - Path to DS-ONT JSONLD (relative to HTML file)
 * @param {Object} skeleton - Parsed skeleton (for ZoneComponent token overrides)
 */
export async function initTokenBridge(tokenPath, skeleton) {
  // 1. DS-ONT instance tokens (base brand)
  const dsontTokens = tokenPath ? await loadTokensFromDSONT(tokenPath) : {};

  // 2. Skeleton ZoneComponent overrides (highest priority, wins over DS-ONT)
  const skeletonTokens = skeleton ? extractSkeletonTokenOverrides(skeleton) : {};

  // 3. Merge and apply (skeleton wins over DS-ONT)
  const merged = { ...dsontTokens, ...skeletonTokens };
  applyTokensToRoot(merged);

  // Store for reference
  state.tokenOverrides = merged;

  console.log(`[tokens] Applied ${Object.keys(merged).length} CSS custom properties`);
}
