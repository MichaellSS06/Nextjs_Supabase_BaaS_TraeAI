export async function isPremium(supabase, userId) {
  const { data, error } = await supabase
    .from("premium_users")
    .select("id")
    .eq("user_id", userId)
    .single();

  return !!data && !error;
}
