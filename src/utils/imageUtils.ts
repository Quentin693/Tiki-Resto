export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '/images/default.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.12:3001'}${imagePath}`;
}; 