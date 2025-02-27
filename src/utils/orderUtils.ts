export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

export const getCategoryEmoji = (categoryId: string): string => {
  const emojiMap: Record<string, string> = {
    'chicken': '🍗',
    'chinese': '🥢',
    'pork-cutlet': '🍱',
    'pizza': '🍕',
    'fast-food': '🍔',
    'night-food': '🌙',
    'korean-snacks': '🍜',
    'cafe-dessert': '☕',
    'korean': '🍚',
    'japanese': '🍣'
  };
  
  return emojiMap[categoryId] || '🍽️';
};
