/**
 * VHF Skeleton Loader — F2.2
 *
 * Adapted from PFC app-skeleton-loader.js for the VHF standalone app.
 * Loads, parses, and merges the VHF app skeleton JSONLD.
 * Builds zone and nav registries for the browser viewer.
 *
 * Standalone: no REGISTRY_BASE_PATH, all paths are relative to the HTML file.
 * State is shared via the vhfState module export.
 */

import { state } from './state.js';

// ========================================
// PARSING
// ========================================

/**
 * Parse a JSONLD app skeleton into structured data.
 * @param {Object} jsonld - Raw JSONLD with @graph array
 * @returns {{ application, zones, navLayers, navItems, actions, zoneComponents }}
 */
export function parseAppSkeleton(jsonld) {
  const graph = jsonld?.['@graph'] || [];
  return {
    application:    graph.find(n => n['@type'] === 'ds:Application') || null,
    zones:          graph.filter(n => n['@type'] === 'ds:AppZone'),
    navLayers:      graph.filter(n => n['@type'] === 'ds:NavLayer'),
    navItems:       graph.filter(n => n['@type'] === 'ds:NavItem'),
    actions:        graph.filter(n => n['@type'] === 'ds:Action'),
    zoneComponents: graph.filter(n => n['@type'] === 'ds:ZoneComponent'),
  };
}

// ========================================
// REGISTRY BUILDING
// ========================================

/**
 * Build navigation and zone registries from a parsed skeleton.
 * Populates state.zoneRegistry, state.navLayerRegistry, state.actionIndex.
 * @param {Object} skeleton - Parsed skeleton
 */
export function buildSkeletonRegistries(skeleton) {
  // Zone registry: zoneId → { zone, components[] }
  state.zoneRegistry = new Map();
  for (const zone of skeleton.zones) {
    state.zoneRegistry.set(zone['ds:zoneId'], { zone, components: [] });
  }

  // Attach components to zones
  for (const cmp of skeleton.zoneComponents) {
    const zoneRef = cmp['ds:placedInZone']?.['@id'];
    if (!zoneRef) continue;
    const entry = [...state.zoneRegistry.values()].find(e => e.zone['@id'] === zoneRef);
    if (entry) {
      entry.components.push(cmp);
      entry.components.sort((a, b) => (a['ds:renderOrder'] || 0) - (b['ds:renderOrder'] || 0));
    }
  }

  // Nav layer registry: layerId → { layer, items[] }
  state.navLayerRegistry = new Map();
  for (const layer of skeleton.navLayers) {
    state.navLayerRegistry.set(layer['ds:layerId'], { layer, items: [] });
  }

  // Attach nav items to layers
  for (const item of skeleton.navItems) {
    const layerRef = item['ds:belongsToLayer']?.['@id'];
    if (!layerRef) continue;
    const entry = [...state.navLayerRegistry.values()].find(e => e.layer['@id'] === layerRef);
    if (entry) {
      entry.items.push(item);
      entry.items.sort((a, b) => (a['ds:renderOrder'] || 0) - (b['ds:renderOrder'] || 0));
    }
  }

  // Action index: @id → Action entity
  state.actionIndex = new Map();
  for (const action of (skeleton.actions || [])) {
    state.actionIndex.set(action['@id'], action);
    // Also index by actionId for direct lookup
    if (action['ds:actionId']) {
      state.actionIndex.set(action['ds:actionId'], action);
    }
  }
}

// ========================================
// LOADING
// ========================================

/**
 * Load the VHF app skeleton from JSONLD file.
 * @param {string} skeletonPath - Relative path to skeleton JSONLD
 * @returns {Promise<Object|null>} Parsed skeleton or null on error
 */
export async function loadAppSkeleton(skeletonPath) {
  try {
    const resp = await fetch(skeletonPath + '?_t=' + Date.now(), { cache: 'no-store' });
    if (!resp.ok) {
      console.error(`[skeleton] Failed to load: ${skeletonPath} (${resp.status})`);
      return null;
    }
    const jsonld = await resp.json();
    const skeleton = parseAppSkeleton(jsonld);
    state.skeleton = skeleton;
    buildSkeletonRegistries(skeleton);
    console.log(`[skeleton] Loaded: ${skeleton.zones.length} zones, ${skeleton.navItems.length} nav items, ${skeleton.actions.length} actions`);
    return skeleton;
  } catch (err) {
    console.error('[skeleton] Load error:', err.message);
    return null;
  }
}

// ========================================
// NAV RENDERING
// ========================================

/**
 * Render nav items from skeleton into the nav container element.
 * Reads ds:action strings from NavItems and wires to window.VHF_ACTIONS.
 * @param {Object} skeleton - Parsed skeleton
 * @param {HTMLElement} container - Nav bar container element
 */
export function renderNavFromSkeleton(skeleton, container) {
  if (!container || !skeleton?.navItems?.length) return;
  container.innerHTML = '';

  const sortedLayers = [...(skeleton.navLayers || [])].sort(
    (a, b) => (a['ds:renderOrder'] || 0) - (b['ds:renderOrder'] || 0)
  );

  const itemsByLayerRef = new Map();
  for (const item of skeleton.navItems) {
    const layerRef = item['ds:belongsToLayer']?.['@id'];
    if (!layerRef) continue;
    if (!itemsByLayerRef.has(layerRef)) itemsByLayerRef.set(layerRef, []);
    itemsByLayerRef.get(layerRef).push(item);
  }
  for (const [, items] of itemsByLayerRef) {
    items.sort((a, b) => (a['ds:renderOrder'] || 0) - (b['ds:renderOrder'] || 0));
  }

  const fragment = document.createDocumentFragment();

  for (const layer of sortedLayers) {
    const items = itemsByLayerRef.get(layer['@id']) || [];
    if (items.length === 0) continue;

    const layerDiv = document.createElement('div');
    layerDiv.className = `nav-layer nav-layer-${layer['ds:layerId'] || ''}`;
    layerDiv.dataset.layerId = layer['ds:layerId'] || '';
    layerDiv.dataset.cascadeTier = layer['ds:cascadeTier'] || 'PFC';

    for (const item of items) {
      const el = _createNavElement(item);
      if (el) layerDiv.appendChild(el);
    }

    fragment.appendChild(layerDiv);
  }

  container.appendChild(fragment);
  console.log(`[skeleton] Nav rendered: ${skeleton.navItems.length} items`);
}

/**
 * Create a DOM element for a NavItem based on its type.
 * Actions are deferred to window.VHF_ACTIONS at click time.
 * @param {Object} item - NavItem JSONLD object
 * @returns {HTMLElement|null}
 */
function _createNavElement(item) {
  const type = item['ds:itemType'];
  const label = item['ds:label'] || '';
  const action = item['ds:action'] || '';
  const icon = item['ds:icon'] || '';
  const condition = item['ds:visibilityCondition'];

  let el;

  switch (type) {
    case 'Button':
      el = document.createElement('button');
      el.className = 'nav-item nav-button';
      el.textContent = label;
      el.title = label;
      break;

    case 'Toggle':
      el = document.createElement('button');
      el.className = 'nav-item nav-toggle';
      el.textContent = label;
      el.title = label;
      el.setAttribute('aria-pressed', 'false');
      break;

    case 'Separator':
      el = document.createElement('span');
      el.className = 'nav-separator';
      return el;

    default:
      return null;
  }

  el.dataset.action = action;
  el.dataset.itemId = item['ds:itemId'] || '';
  el.dataset.cascadeTier = item['ds:cascadeTier'] || 'PFC';
  if (icon) el.dataset.icon = icon;
  if (condition) el.dataset.visibilityCondition = condition;

  // Deferred action dispatch — resolves at click time
  if (action && action !== 'noop') {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const actions = window.VHF_ACTIONS;
      if (actions && typeof actions[action] === 'function') {
        actions[action](el);
      } else {
        console.warn(`[nav] No handler for action: "${action}"`);
      }
    });
  }

  return el;
}

// ========================================
// ZONE DOM WIRING
// ========================================

/**
 * Show a zone by ID (slide in / make visible).
 * @param {string} zoneId - e.g. 'Z-VHF-002'
 */
export function showZone(zoneId) {
  const el = document.getElementById(`zone-${zoneId}`);
  if (!el) return;
  el.classList.remove('zone-hidden');
  el.classList.add('zone-visible');
  state.visibleZones.add(zoneId);

  // Update nav toggle state if applicable
  document.querySelectorAll(`[data-zone-target="${zoneId}"]`).forEach(btn => {
    btn.setAttribute('aria-pressed', 'true');
    btn.classList.add('active');
  });
}

/**
 * Hide a zone by ID.
 * @param {string} zoneId
 */
export function hideZone(zoneId) {
  const el = document.getElementById(`zone-${zoneId}`);
  if (!el) return;
  el.classList.remove('zone-visible');
  el.classList.add('zone-hidden');
  state.visibleZones.delete(zoneId);

  document.querySelectorAll(`[data-zone-target="${zoneId}"]`).forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('active');
  });
}

/**
 * Toggle a zone's visibility.
 * @param {string} zoneId
 */
export function toggleZone(zoneId) {
  if (state.visibleZones.has(zoneId)) {
    hideZone(zoneId);
  } else {
    showZone(zoneId);
  }
}

/**
 * Show one zone and hide all others in the main content area.
 * Used for primary navigation (Plans, Recipes, etc.)
 * @param {string} zoneId - Zone to show
 */
export function activateZone(zoneId) {
  const mainZones = ['Z-VHF-001', 'Z-VHF-002', 'Z-VHF-003', 'Z-VHF-004', 'Z-VHF-005', 'Z-VHF-007'];
  for (const id of mainZones) {
    if (id === zoneId) showZone(id);
    else hideZone(id);
  }
}

/**
 * Apply initial zone visibility from skeleton defaultVisible flags.
 * @param {Object} skeleton - Parsed skeleton
 */
export function initZoneVisibility(skeleton) {
  for (const zone of skeleton.zones) {
    const zoneId = zone['ds:zoneId'];
    if (zone['ds:defaultVisible'] === true) {
      showZone(zoneId);
    } else {
      hideZone(zoneId);
    }
  }
}
