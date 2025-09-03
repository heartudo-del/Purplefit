"use client";

import React, { useState } from 'react';

export function MealPlanExportButton({ mealPlanId }: { mealPlanId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExportClick = async () => {
    setIsLoading(true);

    try {
      const pdfUrl = `/api/meal-plans/${mealPlanId}/pdf`;
      
      // 1. Fetch the PDF data from your API route.
      // The browser automatically includes the necessary session cookies.
      const response = await fetch(pdfUrl);

      // 2. Check if the request was successful.
      // If not, the server probably sent a JSON error message.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download PDF.");
      }

      // 3. Get the response body as a Blob (a file-like object).
      const blob = await response.blob();

      // 4. Create a temporary URL for the Blob.
      const url = window.URL.createObjectURL(blob);

      // 5. Create a temporary <a> element to trigger the download.
      const a = document.createElement('a');
      a.href = url;
      a.download = `Meal_Plan_${mealPlanId}.pdf`; // The desired filename
      document.body.appendChild(a);
      a.click();

      // 6. Clean up by removing the temporary element and URL.
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Export failed:", error);
      // You can show a user-friendly error message here, e.g., using a toast library
      alert(`Error: ${error instanceof Error ? error.message : "Could not export PDF."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExportClick}
      disabled={isLoading}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Generating...' : 'Export as PDF'}
    </button>
  );
}
