/**
 * VHF App State — shared singleton
 *
 * Simple mutable state object shared across all ES modules.
 * All modules import { state } from './state.js' and read/write directly.
 */

export const state = {
  // Skeleton
  skeleton: null,
  zoneRegistry: new Map(),
  navLayerRegistry: new Map(),
  actionIndex: new Map(),
  visibleZones: new Set(),

  // Active instance
  activeInstanceId: 'PFI-VHF',
  userRole: 'coach',           // 'coach' | 'client'

  // Active data selections
  activeClient: null,          // Selected client/persona object
  activePlan: null,            // Selected plan JSONLD

  // Loaded data
  personas: [],                // Array from test-personas.jsonld
  recipes: [],                 // Array from test-recipes.jsonld
  plans: [],                   // Array of loaded plan JSONLD objects

  // Tokens
  tokenOverrides: {},          // CSS var overrides from skeleton + DS-ONT (merged, applied)
  dsOntTokenNodes: [],         // Raw ds:DesignToken nodes from DS-ONT JSONLD (for admin overlay)
  skeletonTokenOverrides: {},  // Token overrides from skeleton ZoneComponent only

  // UI state
  chatEnabled: false,
  isLoading: true,
  loadError: null,
};
