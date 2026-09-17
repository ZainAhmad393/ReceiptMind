import React from 'react';

// Curated, high-availability Unsplash product & receipt photos with guaranteed fallbacks

export const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
  macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  headphones: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  drill: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
  blender: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
  chair: 'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?w=800&auto=format&fit=crop&q=80',
  tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
  jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
  groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
  receipt: 'https://images.unsplash.com/photo-1554415707-9e4466a01534?w=800&auto=format&fit=crop&q=80',
  store: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  botAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
};

export function getFallbackProductImage(name: string = '', category: string = ''): string {
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();

  if (lowerName.includes('macbook') || lowerName.includes('laptop') || lowerName.includes('computer')) {
    return DEFAULT_PRODUCT_IMAGES.macbook;
  }
  if (lowerName.includes('headphone') || lowerName.includes('sony') || lowerName.includes('airpod') || lowerName.includes('audio')) {
    return DEFAULT_PRODUCT_IMAGES.headphones;
  }
  if (lowerName.includes('drill') || lowerName.includes('tool') || lowerName.includes('dewalt') || lowerName.includes('hammer')) {
    return DEFAULT_PRODUCT_IMAGES.drill;
  }
  if (lowerName.includes('blender') || lowerName.includes('vitamix') || lowerName.includes('kitchen') || lowerName.includes('coffee')) {
    return DEFAULT_PRODUCT_IMAGES.blender;
  }
  if (lowerName.includes('chair') || lowerName.includes('desk') || lowerName.includes('table') || lowerName.includes('furniture')) {
    return DEFAULT_PRODUCT_IMAGES.chair;
  }
  if (lowerName.includes('tv') || lowerName.includes('oled') || lowerName.includes('screen') || lowerName.includes('monitor')) {
    return DEFAULT_PRODUCT_IMAGES.tv;
  }
  if (lowerCat.includes('cloth') || lowerName.includes('jacket') || lowerName.includes('shirt')) {
    return DEFAULT_PRODUCT_IMAGES.jacket;
  }
  if (lowerCat.includes('grocer') || lowerName.includes('food') || lowerName.includes('organic')) {
    return DEFAULT_PRODUCT_IMAGES.groceries;
  }
  if (lowerCat.includes('electr')) {
    return DEFAULT_PRODUCT_IMAGES.macbook;
  }

  return DEFAULT_PRODUCT_IMAGES.store;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) {
  const target = e.currentTarget;
  const fallback = fallbackUrl || DEFAULT_PRODUCT_IMAGES.receipt;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
