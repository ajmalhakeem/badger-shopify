export function BadgePreview({ backgroundColor, textColor, text, position }) {
  const getPositionStyles = () => {
    const base = {
      position: 'absolute',
      padding: '4px 8px',
      borderRadius: '4px',
      backgroundColor,
      color: textColor,
    };

    switch (position) {
      case 'top-right':
        return { ...base, top: '10px', right: '10px' };
      case 'top-left':
        return { ...base, top: '10px', left: '10px' };
      case 'bottom-right':
        return { ...base, bottom: '10px', right: '10px' };
      case 'bottom-left':
        return { ...base, bottom: '10px', left: '10px' };
      default:
        return base;
    }
  };

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px', border: '1px solid #ddd' }}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#f4f6f8' }}>
        Sample Product Image
      </div>
      <div style={getPositionStyles()}>
        {text}
      </div>
    </div>
  );
} 