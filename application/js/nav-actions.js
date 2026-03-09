/**
 * VHF Nav Actions — F2.4
 *
 * Implements all 12 VHF action handlers from vhf-app-skeleton-v1.0.0.jsonld.
 * Exposed as window.VHF_ACTIONS for deferred resolution by skeleton-loader.js.
 *
 * Zone show/hide is delegated to skeleton-loader.js zone helpers.
 * State mutations happen via the shared state module.
 */

import { state } from './state.js';
import { showZone, hideZone, activateZone } from './skeleton-loader.js';

// ========================================
// ACTION IMPLEMENTATIONS
// ========================================

/**
 * Show the client profile panel for the currently active client.
 * Action: showClientProfile → Z-VHF-003
 */
function showClientProfile() {
  if (!state.activeClient) {
    _setStatus('Select a client from the dashboard first.');
    return;
  }
  _renderClientProfile(state.activeClient);
  showZone('Z-VHF-003');
}

/**
 * Show the 30-day meal plan viewer for the active client.
 * Action: showMealPlanViewer → Z-VHF-002
 */
function showMealPlanViewer() {
  if (!state.activePlan && state.plans.length > 0) {
    state.activePlan = state.plans[0];
  }
  if (!state.activePlan) {
    _setStatus('No plan available. Use Generate to create one.');
    return;
  }
  _renderPlanViewer(state.activePlan);
  activateZone('Z-VHF-002');
}

/**
 * Show the recipe browser.
 * Action: showRecipeBrowser → Z-VHF-004
 */
function showRecipeBrowser() {
  _renderRecipeBrowser(state.recipes);
  showZone('Z-VHF-004');
}

/**
 * Open the plan generator (triggers Claude Code skill invocation).
 * Action: openPlanGenerator → Z-VHF-002
 */
function openPlanGenerator() {
  if (!state.activeClient) {
    _setStatus('Select a client first to generate a plan.');
    return;
  }
  const clientName = state.activeClient.name || state.activeClient['givenName'] || 'this client';
  _setStatus(`Plan generation for ${clientName} — run /meal-plan in Claude Code, then reload.`);
  showZone('Z-VHF-006');
}

/**
 * Show the coach panel.
 * Action: showCoachPanel → Z-VHF-006
 */
function showCoachPanel() {
  _renderCoachPanel();
  showZone('Z-VHF-006');
}

/**
 * Toggle nutrition chat overlay.
 * Action: toggleNutritionChat → Z-VHF-008
 */
function toggleNutritionChat(el) {
  state.chatEnabled = !state.chatEnabled;
  if (state.chatEnabled) {
    showZone('Z-VHF-008');
    if (el) { el.setAttribute('aria-pressed', 'true'); el.classList.add('active'); }
  } else {
    hideZone('Z-VHF-008');
    if (el) { el.setAttribute('aria-pressed', 'false'); el.classList.remove('active'); }
  }
}

/**
 * Show the shopping list for the active plan.
 * Action: showShoppingList → Z-VHF-005
 */
function showShoppingList() {
  if (!state.activePlan) {
    _setStatus('Select a plan to view its shopping list.');
    return;
  }
  _renderShoppingList(state.activePlan);
  showZone('Z-VHF-005');
}

/**
 * Show quality dashboard for the active plan.
 * Action: showQualityDashboard → Z-VHF-007
 */
function showQualityDashboard() {
  if (!state.activePlan) {
    _setStatus('Select a plan to view quality metrics.');
    return;
  }
  _renderQualityDashboard(state.activePlan);
  showZone('Z-VHF-007');
}

/**
 * Approve the active plan (draft → approved).
 * Action: approvePlan
 */
function approvePlan() {
  if (!state.activePlan) return;
  state.activePlan['vhf:planStatus'] = 'approved';
  _updatePlanStatusDisplay('approved');
  _setStatus('Plan approved.');
}

/**
 * Reject the active plan with a note.
 * Action: rejectPlan
 */
function rejectPlan() {
  if (!state.activePlan) return;
  const note = prompt('Rejection reason (optional):') || '';
  state.activePlan['vhf:planStatus'] = 'rejected';
  state.activePlan['vhf:coachNote'] = note;
  _updatePlanStatusDisplay('rejected');
  _setStatus('Plan rejected.');
}

/**
 * Return to the dashboard (Z-VHF-001).
 * Action: showDashboard
 */
function showDashboard() {
  activateZone('Z-VHF-001');
  hideZone('Z-VHF-003');
  hideZone('Z-VHF-006');
  hideZone('Z-VHF-007');
}

/**
 * Export the active plan as HTML.
 * Action: exportPlanHtml
 */
function exportPlanHtml() {
  if (!state.activePlan) {
    _setStatus('Select a plan to export.');
    return;
  }
  _setStatus('Export: run /meal-plan-html in Claude Code with the plan data.');
}

// ========================================
// RENDER HELPERS
// ========================================

function _renderClientProfile(client) {
  const container = document.getElementById('client-profile-content');
  if (!container || !client) return;

  // Actual field names from test-personas.jsonld
  const name = client.name || `${client.givenName || ''} ${client.familyName || ''}`.trim();
  const clientId = client['@id'] || '';
  const health = client['client:hasProfile'] || {};
  const macros = client['client:hasMacroTarget'] || {};
  const goalRef = client['client:hasGoal'];
  const goalId = Array.isArray(goalRef) ? goalRef.map(g => g['@id']?.replace('client:', '') || g).join(', ') : (goalRef?.['@id']?.replace('client:', '') || '—');
  const allergens = Array.isArray(client['client:hasAllergen'])
    ? client['client:hasAllergen'].map(a => a['@id']?.replace('client:allergen-', '') || a)
    : [];
  const diets = Array.isArray(client['client:followsDiet'])
    ? client['client:followsDiet'].map(d => d['@id']?.replace('diet:', '') || d)
    : [];
  const restrictions = Array.isArray(client['client:hasDietaryRestriction'])
    ? client['client:hasDietaryRestriction'] : [];
  const weightKg = health.weight?.value || health['vhf:weight'] || '—';
  const activityLevel = health.activityLevel || health['vhf:activityLevel'] || '—';

  container.innerHTML = `
    <div class="profile-section">
      <h3>Basic Info</h3>
      <div class="profile-grid">
        <div class="profile-field">
          <label>Name</label>
          <span>${name || '—'}</span>
        </div>
        <div class="profile-field">
          <label>ID</label>
          <span style="font-family:monospace;font-size:0.75rem">${clientId.replace('client:', '')}</span>
        </div>
        <div class="profile-field">
          <label>Weight</label>
          <span>${weightKg !== '—' ? weightKg + ' kg' : '—'}</span>
        </div>
        <div class="profile-field">
          <label>Activity</label>
          <span>${activityLevel.replace(/_/g, ' ')}</span>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <h3>Goal</h3>
      <div class="tag-list">
        <span class="diet-tag">${goalId.replace(/-/g, ' ')}</span>
      </div>
    </div>

    ${diets.length > 0 ? `
    <div class="profile-section">
      <h3>Diet Types</h3>
      <div class="tag-list">
        ${diets.map(d => `<span class="diet-tag">${d.replace(/-/g, ' ')}</span>`).join('')}
      </div>
    </div>` : ''}

    ${restrictions.length > 0 ? `
    <div class="profile-section">
      <h3>Dietary Restrictions</h3>
      <div class="tag-list">
        ${restrictions.map(r => `<span class="diet-tag">${r.replace(/-/g, ' ')}</span>`).join('')}
      </div>
    </div>` : ''}

    ${allergens.length > 0 ? `
    <div class="profile-section">
      <h3>Allergen Exclusions</h3>
      <div class="tag-list">
        ${allergens.map(a => `<span class="allergen-tag">${a.replace(/-/g, ' ')}</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="profile-section">
      <h3>Daily Macro Targets</h3>
      <div class="profile-grid">
        <div class="profile-field">
          <label>Calories</label>
          <span>${macros.dailyCalories || macros['vhf:calories'] || '—'} kcal</span>
        </div>
        <div class="profile-field">
          <label>Protein</label>
          <span>${macros.proteinGrams || macros['vhf:protein'] || '—'} g</span>
        </div>
        <div class="profile-field">
          <label>Carbs</label>
          <span>${macros.carbsGrams || macros['vhf:carbs'] || '—'} g</span>
        </div>
        <div class="profile-field">
          <label>Fat</label>
          <span>${macros.fatsGrams || macros['vhf:fat'] || '—'} g</span>
        </div>
      </div>
    </div>
  `;
}

function _renderPlanViewer(plan) {
  const titleEl = document.getElementById('plan-viewer-title');
  const clientNameEl = document.getElementById('plan-viewer-client-name');
  const statusEl = document.getElementById('plan-viewer-status');
  const gridEl = document.getElementById('plan-day-grid');

  if (!plan) {
    if (gridEl) gridEl.innerHTML = '<div class="empty-state"><p>No plan loaded.</p></div>';
    return;
  }

  const clientName = state.activeClient?.name || state.activeClient?.givenName || 'Client';
  const planStatus = plan['vhf:planStatus'] || 'draft';

  if (titleEl) titleEl.textContent = `30-Day Meal Plan — ${clientName}`;
  if (clientNameEl) clientNameEl.textContent = clientName;
  if (statusEl) {
    statusEl.textContent = planStatus.charAt(0).toUpperCase() + planStatus.slice(1).replace('_', ' ');
    statusEl.className = `plan-status-badge status-${planStatus.replace('_', '-')}`;
  }

  // Select first week by default
  window.vhfSelectWeek(0);
}

// Exposed globally for week tab onclick
window.vhfSelectWeek = function(weekIndex) {
  const plan = state.activePlan;
  const gridEl = document.getElementById('plan-day-grid');
  if (!gridEl || !plan) return;

  const weeks = plan['vhf:weeks'] || [];
  const week = weeks[weekIndex];

  // Update tab active state
  document.querySelectorAll('.week-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === weekIndex);
  });

  if (!week) {
    gridEl.innerHTML = '<div class="empty-state"><p>Week data not available.</p></div>';
    return;
  }

  const days = week['days'] || week['vhf:days'] || [];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  gridEl.innerHTML = days.map((day, i) => {
    const meals = day['meals'] || day['vhf:meals'] || [];
    const dayLabel = day.dayOfWeek?.slice(0, 3) || dayLabels[i] || `D${i + 1}`;
    return `
      <div class="day-card">
        <div class="day-label">${dayLabel}</div>
        ${meals.map(meal => `
          <div class="meal-slot" title="${meal.recipeName || meal['vhf:recipeName'] || ''}">
            <span class="meal-type-label">${meal.mealType || meal['vhf:mealType'] || ''}</span>
            ${meal.recipeName || meal['vhf:recipeName'] || '—'}
          </div>
        `).join('') || '<div class="meal-slot text-muted">No meals</div>'}
      </div>
    `;
  }).join('') || '<div class="empty-state"><p>No day data for this week.</p></div>';
};

function _renderRecipeBrowser(recipes) {
  const grid = document.getElementById('recipe-grid');
  const countEl = document.getElementById('recipe-count');
  if (!grid) return;

  if (!recipes || recipes.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>No recipes loaded.</p></div>';
    return;
  }

  _renderRecipeCards(recipes);
  if (countEl) countEl.textContent = `${recipes.length} recipes`;
}

function _renderRecipeCards(recipes) {
  const grid = document.getElementById('recipe-grid');
  if (!grid) return;
  grid.innerHTML = recipes.map(r => {
    const name = r.name || r['vhf:recipeName'] || 'Unnamed Recipe';
    const category = r.recipeCategory || r['vhf:mealType'] || '';
    const cuisine = r.recipeCuisine || '';
    const cost = r['recipe:costPerServing'] || '';
    const prepTime = r.prepTime ? r.prepTime.replace('PT', '').replace('M', 'min') : '—';
    return `
      <div class="recipe-card" onclick="window.vhfSelectRecipe(this)" data-recipe-id="${r['@id'] || ''}">
        <div class="recipe-card-name">${name}</div>
        <div class="recipe-card-meta">
          ${category ? `<span>${category}</span>` : ''}
          <span>${prepTime}</span>
          ${cuisine ? `<span>${cuisine}</span>` : ''}
          ${cost ? `<span>${cost}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.vhfFilterRecipes = function(query) {
  const q = query.toLowerCase().trim();
  const filtered = q
    ? state.recipes.filter(r => {
        const name = (r.name || r['vhf:recipeName'] || '').toLowerCase();
        const cuisine = (r.recipeCuisine || '').toLowerCase();
        const category = (r.recipeCategory || '').toLowerCase();
        return name.includes(q) || cuisine.includes(q) || category.includes(q);
      })
    : state.recipes;
  const countEl = document.getElementById('recipe-count');
  if (countEl) countEl.textContent = `${filtered.length} recipes${q ? ` matching "${query}"` : ''}`;
  _renderRecipeCards(filtered);
};

window.vhfSelectRecipe = function(el) {
  const recipeId = el.dataset.recipeId;
  const recipe = state.recipes.find(r => r['@id'] === recipeId);
  if (recipe) {
    state.activeRecipe = recipe;
    document.querySelectorAll('.recipe-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
  }
};

function _renderShoppingList(plan) {
  const container = document.getElementById('shopping-list-content');
  if (!container) return;

  // Use week 1 shopping list (actual field: shoppingList with aisle/items)
  const weeks = plan['vhf:weeks'] || [];
  const shoppingData = weeks[0]?.shoppingList || plan['vhf:shoppingList'];

  if (!shoppingData) {
    container.innerHTML = '<div class="empty-state"><p>Shopping list data not available in this plan.</p></div>';
    return;
  }

  const aisles = Array.isArray(shoppingData) ? shoppingData
    : Object.entries(shoppingData).map(([name, items]) => ({ aisle: name, items }));

  container.innerHTML = aisles.map(aisle => {
    const aisleItems = Array.isArray(aisle.items) ? aisle.items : [];
    const aisleLabel = aisle.aisle || aisle['vhf:aisleName'] || aisle.name || 'Items';
    return `
      <div class="shopping-aisle">
        <div class="shopping-aisle-header">${aisleLabel}</div>
        ${aisleItems.map(item => `
          <div class="shopping-item">
            <span>${typeof item === 'string' ? item : (item.ingredient || item['vhf:ingredient'] || JSON.stringify(item))}</span>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function _renderQualityDashboard(plan) {
  const container = document.getElementById('quality-content');
  if (!container) return;

  const qr = plan['vhf:qualityReport'] || {};
  const compliance = qr['vhf:constraintCompliance'] || qr.constraintCompliance;
  const macroAdherence = qr['vhf:macroAdherence'] || qr.macroAdherence;
  const variety = qr['vhf:varietyScore'] || qr.varietyScore;
  const allergenViolations = qr['vhf:allergenViolations'] ?? qr.allergenViolations ?? '—';
  const costPerWeek = qr['vhf:estimatedCostPerWeek'] || qr.estimatedCostPerWeek;

  if (!compliance && !macroAdherence && !variety) {
    container.innerHTML = '<div class="empty-state"><p>Quality report data not available in this plan.</p></div>';
    return;
  }

  const _bar = (label, value, max = 100, danger = false) => {
    const pct = Math.min(100, Math.round((parseFloat(value) / max) * 100)) || 0;
    const cls = danger ? (pct === 0 ? '' : 'danger') : (pct >= 90 ? '' : pct >= 70 ? 'warning' : 'danger');
    return `
      <div class="quality-metric">
        <div class="quality-metric-label">${label}</div>
        <div class="quality-bar-track">
          <div class="quality-bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
        <div class="quality-metric-value">${value}${max === 100 ? '%' : ''}</div>
      </div>
    `;
  };

  container.innerHTML = `
    ${compliance !== undefined ? _bar('Constraint Compliance', Math.round(compliance * 100) || compliance) : ''}
    ${macroAdherence !== undefined ? _bar('Macro Adherence', Math.round((macroAdherence?.daily || macroAdherence || 0) * 100) || macroAdherence?.daily || macroAdherence) : ''}
    ${variety !== undefined ? _bar('Variety Score', Math.round(variety * 100) || variety) : ''}
    <div class="quality-metric">
      <div class="quality-metric-label">Allergen Violations</div>
      <div class="quality-metric-value" style="color: ${allergenViolations === 0 ? 'var(--ds-color-primary)' : '#dc2626'}">
        ${allergenViolations === 0 ? '✓ None' : allergenViolations + ' violation(s)'}
      </div>
    </div>
    ${costPerWeek !== undefined ? `
    <div class="quality-metric">
      <div class="quality-metric-label">Estimated Weekly Cost</div>
      <div class="quality-metric-value">£${parseFloat(costPerWeek).toFixed(2)}</div>
    </div>` : ''}
  `;
}

function _renderCoachPanel() {
  const list = document.getElementById('coach-client-list');
  if (!list) return;
  if (state.personas.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No clients loaded.</p></div>';
    return;
  }
  list.innerHTML = state.personas.map(p => {
    const name = p.name || `${p.givenName || ''} ${p.familyName || ''}`.trim() || 'Unknown';
    const clientId = p['@id'] || '';
    const planCount = state.plans.filter(pl => {
      const assigned = pl['meal:assignedToClient']?.['@id'] || '';
      return assigned === clientId;
    }).length;
    return `
      <div class="client-card" onclick="window.vhfSelectClient(this)" data-persona-id="${clientId}">
        <div class="client-card-header">
          <span class="client-name">${name}</span>
          <span class="text-sm text-muted">${planCount} plan${planCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    `;
  }).join('');
}

function _updatePlanStatusDisplay(status) {
  const el = document.getElementById('plan-viewer-status');
  if (!el) return;
  el.textContent = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  el.className = `plan-status-badge status-${status.replace('_', '-')}`;
}

function _setStatus(msg) {
  console.info(`[VHF] ${msg}`);
  // Non-intrusive: log only. Dashboard will update on next render cycle.
}

// ========================================
// GLOBAL HANDLERS
// ========================================

window.vhfSelectClient = function(el) {
  const personaId = el.dataset.personaId;
  const persona = state.personas.find(p => p['@id'] === personaId || p['vhf:personaId'] === personaId);
  if (persona) {
    state.activeClient = persona;
    state.activePlan = null;
    document.querySelectorAll('.client-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    // Refresh coach panel if open
    if (state.visibleZones.has('Z-VHF-006')) _renderCoachPanel();
  }
};

window.vhfSendChat = function() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  if (!input || !messages || !input.value.trim()) return;
  const msg = input.value.trim();
  input.value = '';
  const el = document.createElement('div');
  el.style.cssText = 'margin-bottom:0.5rem; padding: 0.5rem; background: var(--ds-color-primary-light); border-radius: var(--ds-radius-md); font-size: 0.875rem;';
  el.textContent = msg;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  // Future: invoke AI nutrition advisor agent here
};

// ========================================
// EXPORT ACTION REGISTRY
// ========================================

/**
 * VHF_ACTIONS — the action registry.
 * All 12 skeleton actions mapped to handler functions.
 * window.VHF_ACTIONS is set by app.js after all modules load.
 */
export const VHF_ACTIONS = {
  showClientProfile,
  showMealPlanViewer,
  showRecipeBrowser,
  openPlanGenerator,
  showCoachPanel,
  toggleNutritionChat,
  showShoppingList,
  showQualityDashboard,
  approvePlan,
  rejectPlan,
  showDashboard,
  exportPlanHtml,
};
