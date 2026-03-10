/**
 * VHF App — Main Entry Point
 *
 * Orchestrates:
 *   1. Load app skeleton JSONLD → parse zones/nav/actions
 *   2. Apply DS-ONT token bridge (Viridian brand → CSS vars)
 *   3. Render nav bar from skeleton
 *   4. Init zone visibility (default: Z-VHF-001 Dashboard)
 *   5. Load test data (personas, recipes, generated plans)
 *   6. Render dashboard
 *   7. Expose window.VHF_ACTIONS for nav handlers
 *
 * All paths are relative to browser-viewer.html location.
 */

import { state } from './state.js';
import { loadAppSkeleton, renderNavFromSkeleton, initZoneVisibility } from './skeleton-loader.js';
import { initTokenBridge } from './token-bridge.js';
import { VHF_ACTIONS } from './nav-actions.js';

// ── Data paths (relative to application/) ──────────────────────────────────
const PATHS = {
  skeleton:   'vhf-app-skeleton-v1.0.0.jsonld',
  tokens:     '../instance-data/tokens/VHF-DESIGN-SYSTEM-ONT/vhf-viridian-ds-instance-v1.0.0.jsonld',
  personas:   '../instance-data/ontologies/VHF-RECIPE-MEALPLAN-ONT/test-data/test-personas.jsonld',
  recipes:    '../instance-data/ontologies/VHF-RECIPE-MEALPLAN-ONT/test-data/test-recipes.jsonld',
  plans:      '../instance-data/ontologies/VHF-RECIPE-MEALPLAN-ONT/generated-plans/',
  planFiles:  ['meal-plan-tp-001-2026-02-26.jsonld'],
};

// ── Loading state helpers ───────────────────────────────────────────────────

function setLoadingStatus(text) {
  const el = document.getElementById('loading-status-text');
  if (el) el.textContent = text;
}

function hideLoading() {
  const overlay = document.getElementById('vhf-loading');
  const app = document.getElementById('vhf-app');
  if (overlay) overlay.style.display = 'none';
  if (app) app.style.visibility = 'visible';
  state.isLoading = false;
}

// ── Data loading ────────────────────────────────────────────────────────────

async function loadJSONLD(path) {
  try {
    const resp = await fetch(path + '?_t=' + Date.now(), { cache: 'no-store' });
    if (!resp.ok) { console.warn(`[app] Not found: ${path}`); return null; }
    return await resp.json();
  } catch (err) {
    console.warn(`[app] Load error (${path}):`, err.message);
    return null;
  }
}

async function loadPersonas() {
  const data = await loadJSONLD(PATHS.personas);
  if (!data) return;
  const graph = data['@graph'] || (Array.isArray(data) ? data : []);
  state.personas = graph.filter(n => {
    const types = Array.isArray(n['@type']) ? n['@type'] : [n['@type']];
    return types.includes('client:Client') || types.includes('nut:Client') || n['vhf:personaId'];
  });
  console.log(`[app] Loaded ${state.personas.length} personas`);
}

async function loadRecipes() {
  const data = await loadJSONLD(PATHS.recipes);
  if (!data) return;
  const graph = data['@graph'] || (Array.isArray(data) ? data : []);
  state.recipes = graph.filter(n => {
    const types = Array.isArray(n['@type']) ? n['@type'] : [n['@type']];
    return types.includes('recipe:Recipe') || types.includes('Recipe') ||
           n['vhf:recipeName'] || n['name'];
  });
  console.log(`[app] Loaded ${state.recipes.length} recipes`);
}

async function loadPlans() {
  for (const file of PATHS.planFiles) {
    const data = await loadJSONLD(PATHS.plans + file);
    if (data) state.plans.push(data);
  }
  console.log(`[app] Loaded ${state.plans.length} plans`);
}

// ── Dashboard rendering ─────────────────────────────────────────────────────

// ── Client data helpers ─────────────────────────────────────────────────────

function _clientId(p) {
  return p['@id'] || p['vhf:personaId'] || '';
}

function _clientName(p) {
  return p['name'] || p['vhf:personaName'] || `${p['givenName'] || ''} ${p['familyName'] || ''}`.trim() || 'Unknown';
}

function _clientDietTypes(p) {
  const follows = p['client:followsDiet'];
  if (!follows) return [];
  const arr = Array.isArray(follows) ? follows : [follows];
  return arr.map(d => (d['@id'] || d).replace('diet:', '').replace(/-/g, ' '));
}

function _clientKcal(p) {
  return p['client:hasMacroTarget']?.dailyCalories || p['vhf:macroTargets']?.['vhf:calories'] || null;
}

function _findPlanForClient(clientId) {
  return state.plans.find(pl => {
    const assigned = pl['meal:assignedToClient']?.['@id'] || pl['vhf:testPersonaId'] || '';
    return assigned === clientId || assigned.includes(clientId.replace('client:', ''));
  });
}

// ── Dashboard rendering ─────────────────────────────────────────────────────

function renderDashboard() {
  document.getElementById('stat-total-clients').textContent = state.personas.length;
  document.getElementById('stat-active-plans').textContent =
    state.plans.filter(p => p['vhf:planStatus'] === 'active').length;
  document.getElementById('stat-pending-review').textContent =
    state.plans.filter(p => p['vhf:planStatus'] === 'pending' || p['vhf:planStatus'] === 'pending_review').length;
  document.getElementById('stat-total-recipes').textContent = state.recipes.length;

  // Avg daily calorie target across clients with macro targets set
  const kcalValues = state.personas
    .map(p => parseInt(p['client:hasMacroTarget']?.dailyCalories || p['vhf:macroTargets']?.['vhf:calories'] || 0))
    .filter(v => v > 0);
  const avgKcal = kcalValues.length > 0
    ? Math.round(kcalValues.reduce((s, v) => s + v, 0) / kcalValues.length)
    : null;
  const avgKcalEl = document.getElementById('stat-avg-kcal');
  if (avgKcalEl) avgKcalEl.textContent = avgKcal ? `${avgKcal}` : '—';

  const lastUpdated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('dashboard-last-updated').textContent = lastUpdated;
  document.getElementById('header-client-count').textContent = `${state.personas.length} clients`;

  const grid = document.getElementById('client-grid');
  if (!grid) return;

  if (state.personas.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No clients loaded. Check test-personas.jsonld.</p></div>';
    return;
  }

  grid.innerHTML = state.personas.map(p => {
    const clientId = _clientId(p);
    const name = _clientName(p);
    const dietTypes = _clientDietTypes(p);
    const kcal = _clientKcal(p);
    const plan = _findPlanForClient(clientId);
    const planStatus = plan?.['vhf:planStatus'] || (plan ? 'draft' : null);
    const statusLabel = planStatus
      ? planStatus.charAt(0).toUpperCase() + planStatus.slice(1).replace('_', ' ')
      : 'No plan';
    const statusClass = planStatus ? `status-${planStatus.replace('_', '-')}` : 'status-no-plan';

    return `
      <div class="client-card" onclick="window.vhfDashboardSelectClient(this)" data-persona-id="${clientId}">
        <div class="client-card-header">
          <span class="client-name">${name}</span>
          <span class="plan-status-badge ${statusClass}">${statusLabel}</span>
        </div>
        <div class="client-diet-types">
          ${dietTypes.slice(0, 3).map(d => `<span class="diet-tag">${d}</span>`).join('')}
          ${dietTypes.length > 3 ? `<span class="diet-tag">+${dietTypes.length - 3}</span>` : ''}
        </div>
        <div class="client-macros">
          ${kcal ? `Target: ${kcal} kcal/day` : ''}
          <span class="client-id" style="float:right">${clientId.replace('client:', '')}</span>
        </div>
      </div>
    `;
  }).join('');
}

window.vhfDashboardSelectClient = function(el) {
  const clientId = el.dataset.personaId;
  const persona = state.personas.find(p => _clientId(p) === clientId);
  if (!persona) return;
  state.activeClient = persona;
  state.activePlan = _findPlanForClient(clientId) || null;

  document.querySelectorAll('.client-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.personaId === clientId);
  });

  if (state.activePlan) {
    VHF_ACTIONS.showMealPlanViewer();
  } else {
    VHF_ACTIONS.showClientProfile();
  }
};

// ── App Init ─────────────────────────────────────────────────────────────────

async function init() {
  try {
    // 1. Skeleton
    setLoadingStatus('Loading skeleton…');
    const skeleton = await loadAppSkeleton(PATHS.skeleton);
    if (!skeleton) throw new Error('Failed to load app skeleton');

    // 2. Token bridge (parallel with data, no blocking dep)
    setLoadingStatus('Applying brand tokens…');
    await initTokenBridge(PATHS.tokens, skeleton);

    // 3. Render nav from skeleton
    const navContainer = document.getElementById('zone-Z2');
    if (navContainer) renderNavFromSkeleton(skeleton, navContainer);

    // 4. Init zone visibility
    initZoneVisibility(skeleton);

    // 5. Load data (parallel)
    setLoadingStatus('Loading data…');
    await Promise.all([loadPersonas(), loadRecipes(), loadPlans()]);

    // 6. Render dashboard
    setLoadingStatus('Rendering…');
    renderDashboard();

    // 7. Expose action registry + state globally
    window.VHF_ACTIONS = VHF_ACTIONS;
    window.vhfState = state;

    // 8. Done
    hideLoading();
    window.dispatchEvent(new CustomEvent('vhf-ready'));
    console.log('[app] VHF ready — PFC Platform v1.0.0');

  } catch (err) {
    state.loadError = err.message;
    setLoadingStatus(`Error: ${err.message}`);
    console.error('[app] Init failed:', err);
    // Still show the app shell so partial content is accessible
    hideLoading();
  }
}

// Boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
