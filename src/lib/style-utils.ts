export const getBackgroundStyle = (style: string): React.CSSProperties => {
  const lowerStyle = style.toLowerCase();
  if (lowerStyle.includes('neon purple haze')) {
    return { background: 'linear-gradient(135deg, #A020F0 0%, #4a0e80 100%)' };
  }
  if (lowerStyle.includes('blue rainy gradient')) {
    return { background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)' };
  }
  if (lowerStyle.includes('aesthetic sunset')) {
    return { background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' };
  }
  if (lowerStyle.includes('urban black-and-white')) {
    return { background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' };
  }
  if (lowerStyle.includes('glitchcore')) {
    return { background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)' };
  }
  if (lowerStyle.includes('cozy pastel')) {
    return { background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' };
  }
  if (lowerStyle.includes('vaporwave')) {
    return { background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' };
  }
  return { background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)' };
};

export const getImageFilterStyle = (filter: string): React.CSSProperties => {
  const lowerFilter = filter.toLowerCase();
  if (lowerFilter.includes('soft blur')) {
    return { filter: 'blur(2px) sepia(0.2) saturate(1.2)' };
  }
  if (lowerFilter.includes('vhs noise')) {
    return { filter: 'saturate(1.5) contrast(1.1)' };
  }
  if (lowerFilter.includes('teal-orange cinematic')) {
    return { filter: 'sepia(0.3) contrast(1.1) brightness(0.9) hue-rotate(-15deg)' };
  }
  if (lowerFilter.includes('dreamy glow')) {
    return { filter: 'brightness(1.1) contrast(1.1) saturate(1.2) blur(1px)' };
  }
  if (lowerFilter.includes('dark noir')) {
    return { filter: 'grayscale(1) contrast(1.3) brightness(0.8)' };
  }
  return {};
};
