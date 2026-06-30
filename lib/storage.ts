"use client";

import { isSupabaseConfigured, supabase } from "./supabase/client";

export async function uploadProductAsset(file: File, productId: string, kind: "main" | "brochure" | "specification") {
  if (!isSupabaseConfigured || !supabase) return URL.createObjectURL(file);
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${productId}/${kind}-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from("product-assets").upload(path, file, {
    upsert: true,
    contentType: file.type
  });
  if (error) throw error;
  const { data } = supabase.storage.from("product-assets").getPublicUrl(path);
  return data.publicUrl;
}
