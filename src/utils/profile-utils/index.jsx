import { supabase } from '../../lib/supabaseClient';

export async function getUserHousehold(userId) {
  const { data, error } = await supabase
    .from('household_members')
    .select(`
      household_id,
      role,
      households (
        id,
        name,
        profiles (
          id,
          name,
          monthly_income,
          user_id
        )
      )
    `)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data.households;
}