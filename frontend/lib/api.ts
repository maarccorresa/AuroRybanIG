const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function readMetadata(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/metadata/read`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error reading metadata: ${response.statusText}`);
  }

  const data = await response.json();
  return data.metadata;
}

export async function applyProfile(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/metadata/apply`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error applying profile: ${error}`);
  }

  return response.blob();
}
