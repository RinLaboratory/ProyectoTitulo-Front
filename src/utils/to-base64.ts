"use client";

export async function toBase64(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
    };
    reader.onerror = (error) => {
      if (error instanceof Error) reject(error);
    };
  });
}
