/**
 * VHF Auth — Supabase Authentication
 *
 * Shows login overlay, handles email/password sign-in,
 * exposes auth state for the rest of the app.
 */

import { supabase } from './supabase-client.js';

/** Current authenticated user (null until signed in) */
export let currentUser = null;

/**
 * Check if there's an existing session. If yes, skip login.
 * If no, show the login overlay and wait for sign-in.
 * @returns {Promise<object>} The authenticated user
 */
export async function requireAuth() {
  // Check existing session
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    currentUser = session.user;
    return currentUser;
  }

  // No session — show login
  return new Promise((resolve) => {
    const loginOverlay = document.getElementById('vhf-login');
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    if (loginOverlay) loginOverlay.style.display = 'flex';

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing in…';
      loginError.style.display = 'none';

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        loginError.textContent = error.message;
        loginError.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
        return;
      }

      currentUser = data.user;
      loginOverlay.style.display = 'none';
      resolve(currentUser);
    });
  });
}

/**
 * Sign out and reload the page.
 */
export async function signOut() {
  await supabase.auth.signOut();
  currentUser = null;
  window.location.reload();
}
