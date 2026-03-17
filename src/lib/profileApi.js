import { dataClient } from './dataClient';

const TABLE = 'user_preferences';

/** PostgREST error code when a .single() query matches no rows. */
const NO_ROWS_CODE = 'PGRST116';

/**
 * Fetch the current user's preferences directly from Neon via the Data API.
 * RLS ensures only the authenticated user's row is returned — no filter needed.
 * Returns null if no preferences have been saved yet.
 */
export async function fetchPreferences() {
  const { data, error } = await dataClient.from(TABLE).select('*').single();

  if (error) {
    if (error.code === NO_ROWS_CODE) return null;
    throw new Error(error.message);
  }
  return data;
}

/**
 * Upsert the current user's preferences.
 * The user_id comes from the active Neon Auth session; RLS enforces ownership.
 */
export async function savePreferences({ servings, eatingStyle, goal, bmrKcal, cookingFrequency }) {
  const { data: sessionData } = await dataClient.auth.getSession();
  const userId = sessionData?.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const payload = {
    user_id: userId,
    servings: servings ?? 2,
    eating_style: eatingStyle || null,
    goal: goal || null,
    bmr_kcal: bmrKcal ?? null,
    cooking_frequency: cookingFrequency || 'daily',
    updated_at: new Date().toISOString(),
  };

  // Try updating the existing row first; if there is no row yet, insert one.
  const { data: updated, error: updateError } = await dataClient
    .from(TABLE)
    .update(payload)
    .eq('user_id', userId)
    .select()
    .single();

  if (!updateError) return updated;
  if (updateError.code !== NO_ROWS_CODE) throw new Error(updateError.message);

  const { data: inserted, error: insertError } = await dataClient
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);
  return inserted;
}
