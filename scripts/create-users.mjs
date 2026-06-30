import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.SKM_INITIAL_PASSWORD;

if (!url || !serviceRole || !password) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SKM_INITIAL_PASSWORD before running this script.");
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });
const users = [
  ["Ashish Gaikwad", "ashish", "Admin"],
  ["Harshal Girase", "harshal", "Admin"],
  ["Bhavani", "bhavani", "Sales"],
  ["Gauri", "gauri", "Sales"]
];

for (const [fullName, username, role] of users) {
  const email = `${username}@skm.internal`;
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: fullName, username, role } });
  if (error && !error.message.toLowerCase().includes("already")) throw error;
  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from("profiles").upsert({ id: userId, full_name: fullName, username, role, active: true });
    if (profileError) throw profileError;
  }
  console.log(`Configured ${username} (${role})`);
}
