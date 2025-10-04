export async function getStickers(supabase) {
  // Listamos los archivos del bucket privado
  const { data: files, error } = await supabase.storage
    .from("stickers_premium")
    .list("", { limit: 100 });

  if (error) throw error;
  if (!files || files.length === 0) return [];

  // Generamos URLs firmadas para cada archivo
  const signedUrls = await Promise.all(
    files.map(async (file) => {
      const { data, error } = await supabase.storage
        .from("stickers_premium")
        .createSignedUrl(file.name, 60*60); // expira en 60 segundos
      if (error) {
        console.error("Error creando signed URL:", error);
        return null;
      }
      return data.signedUrl;
    })
  );

  // Filtramos nulos por si algún archivo falla
  return signedUrls.filter((url) => url !== null);
}
