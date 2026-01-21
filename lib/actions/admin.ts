"use server";

export async function verifyAdminCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const adminId = process.env.ADMIN_ID;
  const adminPass = process.env.ADMIN_PASS;
  
  // Basic validation
  if (!email || !password) {
      return { success: false, message: "Missing credentials" };
  }

  if (email === adminId && password === adminPass) {
    return { success: true };
  }

  return { success: false, message: "Invalid admin credentials" };
}
