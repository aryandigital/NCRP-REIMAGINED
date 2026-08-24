"use client";

import { bmvbhash } from "blockhash-core";

export async function createLocalImageFingerprint(file: File, bits = 16): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is not available");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return bmvbhash(context.getImageData(0, 0, canvas.width, canvas.height), bits);
}
