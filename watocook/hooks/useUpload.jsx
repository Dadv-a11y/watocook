import { useState } from "react";

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState({ visible: false, message: '', type: 'info' });

  const convertToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const base64Image = await convertToBase64(uri);
      const response = await fetch('/api/generate-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        setError({ visible: true , message:'Failed to generate ingredients', type: 'error' });
        return
      }

      const data = await response.json();
      return data?.ingredients || data; // Assuming the API returns { ingredients: [...] }

    } catch (error) {
      setError({ visible: true, message: 'Upload failed', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, uploadImage };
};
