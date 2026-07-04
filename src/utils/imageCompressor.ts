/**
 * Compresses an image file from a file input and returns a Base64 encoded JPEG DataURL.
 * It resizes the image preserving aspect ratio. For vertically long scrolling images,
 * it preserves horizontal resolution to prevent blurriness when scaled on screen.
 */
export function compressImage(
  file: File,
  maxWidthOrHeight = 2048,
  quality = 0.90
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Intelligent resizing:
        // For vertically very tall images (e.g. detail pages or redesign sheets),
        // we must preserve the horizontal width so it remains sharp when stretched to screen width.
        const isVerticallyLong = height > width * 1.5;
        
        if (isVerticallyLong) {
          // If the image is extremely tall, keep the width at a high-res setting (e.g. min of 1600 or original width)
          const targetWidth = Math.min(width, 1600);
          height = Math.round((height * targetWidth) / width);
          width = targetWidth;
        } else {
          // Proportional scaling for standard aspect ratios
          if (width > height) {
            if (width > maxWidthOrHeight) {
              height = Math.round((height * maxWidthOrHeight) / width);
              width = maxWidthOrHeight;
            }
          } else {
            if (height > maxWidthOrHeight) {
              width = Math.round((width * maxWidthOrHeight) / height);
              height = maxWidthOrHeight;
            }
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be created'));
          return;
        }

        // Draw image onto canvas with high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to base64 jpeg data url with premium quality
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

