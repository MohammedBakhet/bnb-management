import { useState } from 'react';

export default function ImageUpload() {
  // Set the state type to `File | null` to handle both initial and updated states
  const [image, setImage] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Check if a file is selected
    if (file) {
      setImage(file);
      setImageURL(URL.createObjectURL(file)); // Optional: create a preview URL
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {imageURL && <img src={imageURL} alt="Selected" />}
    </div>
  );
}
