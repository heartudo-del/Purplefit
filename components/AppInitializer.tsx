"use client"

import { useEffect } from 'react';
import { initializeDefaultData } from '@/lib/local-storage';

export function AppInitializer() {
  useEffect(() => {
    // This code will run once when the application first loads in the browser.
    // It will check if the default data exists and create it if it doesn't.
    initializeDefaultData();
  }, []); // The empty dependency array ensures this runs only once.

  // This component does not render anything visible.
  return null;
}
