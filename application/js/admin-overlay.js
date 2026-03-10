/**
 * VHF Admin Overlay — Skeleton Zone Inspector + DS Token Map
 *
 * Two admin tools toggled via the bottom-right toolbar:
 *
 * 1. Zone Overlay — highlights all 8 zones with coloured borders and labels
 *    showing zoneId, zone type, and current visibility state. Updates live.
 *
 * 2. Token Map — floating panel listing all resolved --ds-* CSS custom
 *    properties with values and colour swatches. Reads from document.documentElement
 *    so it reflects the live runtime state (skeleton overrides applied).
 *
 * Standalone module — no imports, reads from DOM and computed styles directly.
 * Works independently of app.js init order.
 */

// ============================================================
// ZONE OVERLAY
// ============================================================

const ZONE_COLOURS = {
  'Z-VHF-001': '#007c74',   // Dashboard — Viridian primary
  'Z-VHF-002': '#0284c7',   // Meal Plan — sky blue
  'Z-VHF-003': '#7c3aed',   // Client Profile — violet
  'Z-VHF-004': '#d97706',   // Recipe Browser — amber
  'Z-VHF-005': '#059669',   // Shopping List — emerald
  'Z-VHF-006': '#dc2626',   // Coach Panel — red
  'Z-VHF-007': '#db2777',   // Quality Dashboard — pink
  'Z-VHF-008': '#6366f1',   // AI Chat — indigo
};

const ZONE_META = {
  'Z-VHF-001': { name: 'Dashboard',         type: 'Fixed',         order: 1 },
  'Z-VHF-002': { name: 'Meal Plan Viewer',  type: 'Sliding-Right', order: 2 },
  'Z-VHF-003': { name: 'Client Profile',    type: 'Sliding-Right', order: 3 },
  'Z-VHF-004': { name: 'Recipe Browser',    type: 'Sliding-Right', order: 4 },
  'Z-VHF-005': { name: 'Shopping List',     type: 'Sliding-Right', order: 5 },
  'Z-VHF-006': { name: 'Coach Panel',       type: 'Sliding-Left',  order: 6 },
  'Z-VHF-007': { name: 'Quality Dashboard', type: 'Sliding-Left',  order: 7 },
  'Z-VHF-008': { name: 'AI Chat',           type: 'Overlay',       order: 8 },
};

let zoneOverlayActive = false;
let overlayLabels = [];
let overlayResizeObserver = null;

/**
 * Toggle zone skeleton overlay on/off.
 */
window.vhfAdminToggleZones = function() {
  zoneOverlayActive = !zoneOverlayActive;
  const btn = document.getElementById('admin-toggle-zones');
  if (btn) btn.setAttribute('aria-pressed', String(zoneOverlayActive));
  if (btn) btn.classList.toggle('admin-btn-active', zoneOverlayActive);

  if (zoneOverlayActive) {
    document.body.classList.add('vhf-zone-overlay-active');
    _renderZoneOverlay();
    _startZoneObserver();
  } else {
    document.body.classList.remove('vhf-zone-overlay-active');
    _clearZoneOverlay();
    _stopZoneObserver();
  }
};

function _renderZoneOverlay() {
  const container = document.getElementById('vhf-zone-overlay');
  if (!container) return;
  container.style.display = 'block';
  container.innerHTML = '';
  overlayLabels = [];

  for (const [zoneId, meta] of Object.entries(ZONE_META)) {
    const el = document.getElementById(`zone-${zoneId}`);
    if (!el) continue;

    const colour = ZONE_COLOURS[zoneId] || '#666';
    const isVisible = !el.classList.contains('zone-hidden');
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    const label = document.createElement('div');
    label.className = 'zone-overlay-label';
    label.dataset.zoneId = zoneId;
    label.style.cssText = `
      position: fixed;
      top: ${rect.top + window.scrollY}px;
      left: ${rect.left + window.scrollX}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: 2px solid ${colour};
      pointer-events: none;
      z-index: 9000;
      box-sizing: border-box;
    `;

    const badge = document.createElement('div');
    badge.className = 'zone-overlay-badge';
    badge.style.cssText = `
      position: absolute;
      top: 4px;
      left: 4px;
      background: ${colour};
      color: #fff;
      font-size: 10px;
      font-family: monospace;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 3px;
      line-height: 1.4;
      max-width: calc(100% - 8px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    badge.innerHTML = `${zoneId} · ${meta.name}<br><span style="font-weight:normal;opacity:0.85">${meta.type} · ${isVisible ? '● visible' : '○ hidden'}</span>`;

    label.appendChild(badge);
    container.appendChild(label);
    overlayLabels.push({ zoneId, label, el });
  }
}

function _updateZoneOverlayPositions() {
  for (const { el, label, zoneId } of overlayLabels) {
    const rect = el.getBoundingClientRect();
    label.style.top = `${rect.top + window.scrollY}px`;
    label.style.left = `${rect.left + window.scrollX}px`;
    label.style.width = `${rect.width}px`;
    label.style.height = `${rect.height}px`;

    // Update visibility badge
    const badge = label.querySelector('.zone-overlay-badge');
    if (badge) {
      const isVisible = !el.classList.contains('zone-hidden');
      const meta = ZONE_META[zoneId];
      const colour = ZONE_COLOURS[zoneId] || '#666';
      badge.innerHTML = `${zoneId} · ${meta.name}<br><span style="font-weight:normal;opacity:0.85">${meta.type} · ${isVisible ? '● visible' : '○ hidden'}</span>`;
      label.style.border = `2px solid ${colour}`;
      label.style.opacity = isVisible ? '1' : '0.5';
    }
  }
}

function _clearZoneOverlay() {
  const container = document.getElementById('vhf-zone-overlay');
  if (container) { container.style.display = 'none'; container.innerHTML = ''; }
  overlayLabels = [];
}

function _startZoneObserver() {
  if (overlayResizeObserver) return;
  overlayResizeObserver = new ResizeObserver(_updateZoneOverlayPositions);
  document.querySelectorAll('[data-zone-id]').forEach(el => {
    overlayResizeObserver.observe(el);
  });
  window.addEventListener('scroll', _updateZoneOverlayPositions);
  window.addEventListener('resize', _updateZoneOverlayPositions);
  // Also observe class changes (zone visibility changes)
  const mutObs = new MutationObserver(_updateZoneOverlayPositions);
  document.querySelectorAll('[data-zone-id]').forEach(el => {
    mutObs.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
  });
  overlayResizeObserver._mutObs = mutObs;
}

function _stopZoneObserver() {
  if (overlayResizeObserver) {
    overlayResizeObserver.disconnect();
    if (overlayResizeObserver._mutObs) overlayResizeObserver._mutObs.disconnect();
    overlayResizeObserver = null;
  }
  window.removeEventListener('scroll', _updateZoneOverlayPositions);
  window.removeEventListener('resize', _updateZoneOverlayPositions);
}

// ============================================================
// TOKEN MAP
// ============================================================

/**
 * All --ds-* tokens with metadata: group, label, type (colour|size|font|other)
 */
const TOKEN_REGISTRY = [
  // Colour
  { var: '--ds-color-primary',        group: 'color',   label: 'Primary',        type: 'colour', source: 'skeleton' },
  { var: '--ds-color-primary-hover',  group: 'color',   label: 'Primary Hover',  type: 'colour', source: 'skeleton' },
  { var: '--ds-color-primary-light',  group: 'color',   label: 'Primary Light',  type: 'colour', source: 'skeleton' },
  { var: '--ds-color-secondary',      group: 'color',   label: 'Secondary',      type: 'colour', source: 'skeleton' },
  { var: '--ds-color-secondary-hover',group: 'color',   label: 'Secondary Hover',type: 'colour', source: 'dsont' },
  // Surface
  { var: '--ds-surface-default',      group: 'surface', label: 'Surface Default',type: 'colour', source: 'dsont' },
  { var: '--ds-surface-brand',        group: 'surface', label: 'Surface Brand',  type: 'colour', source: 'dsont' },
  { var: '--ds-surface-subtle',       group: 'surface', label: 'Surface Subtle', type: 'colour', source: 'dsont' },
  { var: '--ds-surface-muted',        group: 'surface', label: 'Surface Muted',  type: 'colour', source: 'dsont' },
  // Text
  { var: '--ds-text-primary',         group: 'text',    label: 'Text Primary',   type: 'colour', source: 'dsont' },
  { var: '--ds-text-secondary',       group: 'text',    label: 'Text Secondary', type: 'colour', source: 'dsont' },
  { var: '--ds-text-muted',           group: 'text',    label: 'Text Muted',     type: 'colour', source: 'dsont' },
  { var: '--ds-text-on-brand',        group: 'text',    label: 'Text On Brand',  type: 'colour', source: 'dsont' },
  // Border
  { var: '--ds-border-default',       group: 'border',  label: 'Border Default', type: 'colour', source: 'dsont' },
  { var: '--ds-border-subtle',        group: 'border',  label: 'Border Subtle',  type: 'colour', source: 'dsont' },
  // Font
  { var: '--ds-font-family',          group: 'font',    label: 'Font Family',    type: 'font',   source: 'dsont' },
  { var: '--ds-font-size-sm',         group: 'font',    label: 'Font Size SM',   type: 'size',   source: 'dsont' },
  { var: '--ds-font-size-base',       group: 'font',    label: 'Font Size Base', type: 'size',   source: 'dsont' },
  { var: '--ds-font-size-lg',         group: 'font',    label: 'Font Size LG',   type: 'size',   source: 'dsont' },
  { var: '--ds-font-size-xl',         group: 'font',    label: 'Font Size XL',   type: 'size',   source: 'dsont' },
  { var: '--ds-font-size-2xl',        group: 'font',    label: 'Font Size 2XL',  type: 'size',   source: 'dsont' },
  { var: '--ds-font-weight-medium',   group: 'font',    label: 'Weight Medium',  type: 'other',  source: 'dsont' },
  { var: '--ds-font-weight-bold',     group: 'font',    label: 'Weight Bold',    type: 'other',  source: 'dsont' },
  // Spacing
  { var: '--ds-spacing-xs',           group: 'spacing', label: 'Spacing XS',     type: 'size',   source: 'dsont' },
  { var: '--ds-spacing-sm',           group: 'spacing', label: 'Spacing SM',     type: 'size',   source: 'dsont' },
  { var: '--ds-spacing-md',           group: 'spacing', label: 'Spacing MD',     type: 'size',   source: 'dsont' },
  { var: '--ds-spacing-lg',           group: 'spacing', label: 'Spacing LG',     type: 'size',   source: 'dsont' },
  { var: '--ds-spacing-xl',           group: 'spacing', label: 'Spacing XL',     type: 'size',   source: 'dsont' },
  // Radius
  { var: '--ds-radius-sm',            group: 'radius',  label: 'Radius SM',      type: 'size',   source: 'dsont' },
  { var: '--ds-radius-md',            group: 'radius',  label: 'Radius MD',      type: 'size',   source: 'dsont' },
  { var: '--ds-radius-lg',            group: 'radius',  label: 'Radius LG',      type: 'size',   source: 'dsont' },
  { var: '--ds-radius-full',          group: 'radius',  label: 'Radius Full',    type: 'size',   source: 'dsont' },
  // Shadow
  { var: '--ds-shadow-sm',            group: 'shadow',  label: 'Shadow SM',      type: 'other',  source: 'dsont' },
  { var: '--ds-shadow-md',            group: 'shadow',  label: 'Shadow MD',      type: 'other',  source: 'dsont' },
  // Transitions
  { var: '--ds-transition-fast',      group: 'other',   label: 'Transition Fast', type: 'other', source: 'dsont' },
];

const SOURCE_LABELS = {
  skeleton: { label: 'Skeleton Override', colour: '#007c74' },
  dsont:    { label: 'DS-ONT Instance',   colour: '#0284c7' },
  css:      { label: 'CSS Fallback',      colour: '#6b7280' },
};

let tokenMapActive = false;
let tokenMapFilter = '';
let tokenMapTab = 'css-live';   // 'css-live' | 'ds-ont'

window.vhfAdminToggleTokens = function() {
  tokenMapActive = !tokenMapActive;
  const panel = document.getElementById('vhf-token-map');
  const btn = document.getElementById('admin-toggle-tokens');
  if (btn) btn.setAttribute('aria-pressed', String(tokenMapActive));
  if (btn) btn.classList.toggle('admin-btn-active', tokenMapActive);
  if (panel) panel.style.display = tokenMapActive ? 'flex' : 'none';
  if (tokenMapActive) _renderActiveTab();
};

window.vhfTokenMapFilter = function(group) {
  tokenMapFilter = group;
  if (tokenMapTab === 'css-live') _renderTokenMap(group);
};

window.vhfTokenMapTab = function(tab) {
  tokenMapTab = tab;
  // Update tab button states
  document.getElementById('tab-css-live')?.classList.toggle('active', tab === 'css-live');
  document.getElementById('tab-ds-ont')?.classList.toggle('active', tab === 'ds-ont');
  document.getElementById('tab-css-live')?.setAttribute('aria-selected', String(tab === 'css-live'));
  document.getElementById('tab-ds-ont')?.setAttribute('aria-selected', String(tab === 'ds-ont'));
  // Show/hide the filter select (only meaningful for CSS Live tab)
  const filterEl = document.getElementById('token-map-filter');
  if (filterEl) filterEl.style.display = tab === 'css-live' ? '' : 'none';
  _renderActiveTab();
};

function _renderActiveTab() {
  if (tokenMapTab === 'ds-ont') {
    _renderDsOntTab();
  } else {
    _renderTokenMap(tokenMapFilter);
  }
}

function _renderTokenMap(filterGroup) {
  const grid = document.getElementById('token-map-grid');
  if (!grid) return;

  const root = getComputedStyle(document.documentElement);
  const tokens = filterGroup
    ? TOKEN_REGISTRY.filter(t => t.group === filterGroup)
    : TOKEN_REGISTRY;

  // Determine actual source for each token by checking if it was in state.tokenOverrides
  const skeletonOverrides = _getSkeletonOverrides();

  grid.innerHTML = tokens.map(token => {
    const value = root.getPropertyValue(token.var).trim();
    if (!value) return '';

    const isOverridden = skeletonOverrides.has(token.var);
    const source = isOverridden ? 'skeleton' : token.source;
    const srcMeta = SOURCE_LABELS[source] || SOURCE_LABELS.dsont;

    let preview = '';
    if (token.type === 'colour') {
      preview = `<div class="token-swatch" style="background:${value}" title="${value}"></div>`;
    } else if (token.type === 'size') {
      preview = `<div class="token-size-bar" style="width:min(${value}, 100%);max-width:60px;height:8px;background:var(--ds-color-primary);border-radius:2px;"></div>`;
    } else if (token.type === 'font') {
      preview = `<span class="token-font-sample" style="font-family:${value};font-size:13px">Aa</span>`;
    }

    return `
      <div class="token-card" data-group="${token.group}">
        <div class="token-card-preview">${preview || '<div class="token-swatch-empty">—</div>'}</div>
        <div class="token-card-info">
          <div class="token-var-name">${token.var}</div>
          <div class="token-var-value">${value}</div>
          <div class="token-source-badge" style="color:${srcMeta.colour};border-color:${srcMeta.colour}">${srcMeta.label}</div>
        </div>
      </div>
    `;
  }).join('');
}

function _getSkeletonOverrides() {
  try {
    const overrides = window.vhfState?.skeletonTokenOverrides || {};
    return new Set(Object.keys(overrides));
  } catch {
    return new Set();
  }
}

// ============================================================
// DS-ONT SOURCE TAB
// Shows tokens as defined in the DS-ONT JSONLD instance,
// not the computed CSS value — the Design Director's source view.
// ============================================================

/**
 * Token type inference from ds:tokenName — mirrors TOKEN_REGISTRY type field.
 */
function _inferTokenType(name) {
  if (!name) return 'other';
  if (name.startsWith('color') || name.startsWith('surface') || name.startsWith('text') || name.startsWith('border')) return 'colour';
  if (name.startsWith('spacing') || name.startsWith('radius') || name.startsWith('font-size')) return 'size';
  if (name.startsWith('font-family')) return 'font';
  return 'other';
}

/**
 * Map ds:tokenName to a display group.
 */
function _inferTokenGroup(name) {
  if (!name) return 'other';
  if (name.startsWith('color')) return 'color';
  if (name.startsWith('surface')) return 'surface';
  if (name.startsWith('text')) return 'text';
  if (name.startsWith('border')) return 'border';
  if (name.startsWith('font')) return 'font';
  if (name.startsWith('spacing')) return 'spacing';
  if (name.startsWith('radius')) return 'radius';
  if (name.startsWith('shadow')) return 'shadow';
  return 'other';
}

function _renderDsOntTab() {
  const grid = document.getElementById('token-map-grid');
  if (!grid) return;

  const nodes = window.vhfState?.dsOntTokenNodes || [];
  const skeletonOverrides = _getSkeletonOverrides();

  if (nodes.length === 0) {
    grid.innerHTML = `
      <div style="padding:1rem;color:var(--ds-text-muted);font-size:12px;text-align:center">
        DS-ONT token nodes not available.<br>
        <span style="opacity:0.7">Load completes after app init (vhf-ready event).</span>
      </div>`;
    return;
  }

  // Group nodes by token group
  const grouped = {};
  for (const node of nodes) {
    const name = node['ds:tokenName'] || '';
    const group = _inferTokenGroup(name);
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(node);
  }

  const groupOrder = ['color', 'surface', 'text', 'border', 'font', 'spacing', 'radius', 'shadow', 'other'];
  const cssVar = name => `--ds-${name}`;
  const root = getComputedStyle(document.documentElement);

  let html = '';

  for (const group of groupOrder) {
    const nodes = grouped[group];
    if (!nodes?.length) continue;

    html += `<div class="dsont-group-header">${group.charAt(0).toUpperCase() + group.slice(1)}</div>`;

    for (const node of nodes) {
      const name = node['ds:tokenName'] || '';
      const ontValue = node['ds:tokenValue'] || node['ds:resolvedValue'] || '—';
      const varName = cssVar(name);
      const liveValue = root.getPropertyValue(varName).trim();
      const isSkeletonOverridden = skeletonOverrides.has(varName);
      const type = _inferTokenType(name);
      const diverged = liveValue && liveValue !== ontValue;

      let preview = '';
      if (type === 'colour') {
        preview = `<div class="token-swatch" style="background:${ontValue}" title="${ontValue}"></div>`;
      } else if (type === 'size') {
        preview = `<div style="width:min(${ontValue},100%);max-width:60px;height:8px;background:var(--ds-color-primary);border-radius:2px;"></div>`;
      } else if (type === 'font') {
        preview = `<span style="font-family:${ontValue};font-size:13px">Aa</span>`;
      }

      const sourceLabel = isSkeletonOverridden ? 'Skeleton Override' : 'DS-ONT Instance';
      const sourceColour = isSkeletonOverridden ? '#007c74' : '#0284c7';

      html += `
        <div class="token-card dsont-token-card">
          <div class="token-card-preview">${preview || '<div class="token-swatch-empty">—</div>'}</div>
          <div class="token-card-info">
            <div class="token-var-name">${varName}</div>
            <div class="token-var-value">ONT: ${ontValue}</div>
            ${diverged ? `<div class="token-diverge-badge" title="Live CSS differs from ONT definition">CSS: ${liveValue}</div>` : ''}
            <div class="token-source-badge" style="color:${sourceColour};border-color:${sourceColour}">${sourceLabel}</div>
          </div>
        </div>`;
    }
  }

  grid.innerHTML = html;
}

// Re-render DS-ONT tab on vhf-ready (state populated after init)
window.addEventListener('vhf-ready', () => {
  if (tokenMapActive && tokenMapTab === 'ds-ont') _renderDsOntTab();
});

// ============================================================
// KEYBOARD SHORTCUT
// ============================================================

document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+Z = toggle zones, Ctrl+Shift+T = toggle tokens
  if (e.ctrlKey && e.shiftKey && e.key === 'Z') { e.preventDefault(); window.vhfAdminToggleZones(); }
  if (e.ctrlKey && e.shiftKey && e.key === 'T') { e.preventDefault(); window.vhfAdminToggleTokens(); }
});
