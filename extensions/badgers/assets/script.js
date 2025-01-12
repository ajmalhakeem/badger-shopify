const findProductImage = () => {
  // Common product image container selectors
  const selectors = [
    '.product__media-item img',
    '.product-single__media img',
    '.product-featured-media img',
    '.product-gallery__image img',
    '[data-product-media-type-image] img',
    '.product-card-wrapper img'
  ];

  // Find the first matching product image
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const container = element.closest('div');
      // Ensure the container and its parent have relative positioning
      if (container) {
        container.style.position = 'relative';
        const parent = container.parentElement;
        if (parent) parent.style.position = 'relative';
      }
      return container;
    }
  }
  return null;
};

const positionBadge = () => {
  const productImageContainer = findProductImage();
  const badge = document.querySelector('.hello-world-badge');
  
  if (productImageContainer && badge) {
    productImageContainer.appendChild(badge);
  }
};

// Run after DOM is loaded
document.addEventListener('DOMContentLoaded', positionBadge);

// Also run after dynamic content loads (for themes that lazy load images)
document.addEventListener('shopify:section:load', positionBadge);
