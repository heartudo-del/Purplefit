import jsPDF from "jspdf";
import type { MealPlan, MealPlanWeek, FoodEntry } from "./local-storage";

const BRAND_COLOR = "#9333ea";
const TEXT_COLOR = "#1f2937";
const BORDER_GRAY = "#cccccc";
const PAGE_MARGIN = 20;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = [{ key: "breakfast", name: "Breakfast", time: "7-8am" }, { key: "lunch", name: "Lunch", time: "1-2pm" }, { key: "dinner", name: "Dinner", time: "6-7pm" }] as const;

// Helper function to fetch an image from the /public folder and return it as a buffer
async function fetchImageAsBuffer(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image at ${url}: ${response.statusText}`);
      return null;
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error(`Network error fetching image at ${url}:`, error);
    return null;
  }
}

// --- Main Client-Side PDF Generation Function ---
export async function generateMealPlanPDF(mealPlan: MealPlan, allFoodEntries: FoodEntry[]) {
  const doc = new jsPDF();
  
  // Pre-fetch both images at the same time for efficiency
  const [coverImageBuffer, logoBuffer] = await Promise.all([
    fetchImageAsBuffer('/cover-image.jpg'),
    fetchImageAsBuffer('/logo.jpg') 
  ]);

  // Page 1: The beautiful image cover
  generateCoverPage(doc, coverImageBuffer);

  // Subsequent Pages: Weeks
  mealPlan.weeks.forEach((week, index) => {
    doc.addPage();
    addPageHeaderAndFooter(doc, logoBuffer, `Week ${index + 1}`);
    generateWeekPageManually(doc, week, mealPlan, allFoodEntries);
  });
  
  // Final Page: Guidelines
  doc.addPage();
  addPageHeaderAndFooter(doc, logoBuffer, "Guidelines");
  generateGuidelinesPage(doc);
  
  // Add page numbers to all pages except the cover
  const pageCount = doc.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor("#6b7280");
    doc.text(`Page ${i-1} of ${pageCount-1}`, doc.internal.pageSize.getWidth() - PAGE_MARGIN, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }

  // Trigger the download in the browser
  doc.save(`${mealPlan.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}

// --- Page Generation Functions ---

function generateCoverPage(doc: jsPDF, imageBuffer: ArrayBuffer | null) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (imageBuffer) {
    // If image was fetched successfully, use it as the background
    doc.addImage(new Uint8Array(imageBuffer), 'JPEG', 0, 0, pageWidth, pageHeight);
  } else {
    // Fallback to a drawn cover if the image fails to load
    doc.setFillColor(BRAND_COLOR).rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFont("helvetica", "bold").setFontSize(36).setTextColor("#ffffff");
    doc.text("PURPLE FIT", pageWidth / 2, pageHeight / 2 - 10, { align: "center" });
    doc.setFontSize(22).setFont("helvetica", "normal");
    doc.text("Meal Plan", pageWidth / 2, pageHeight / 2 + 10, { align: "center" });
  }
}

const addPageHeaderAndFooter = (doc: jsPDF, logoBuffer: ArrayBuffer | null, title: string) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    if (logoBuffer) {
      // Draw the logo image if it was successfully fetched
      // Position: x, y, width, height
      doc.addImage(new Uint8Array(logoBuffer), 'JPEG', PAGE_MARGIN, 8, 25, 12);
    } else {
      // Fallback to text if the logo couldn't be loaded
      doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(BRAND_COLOR);
      doc.text("PURPLE FIT", PAGE_MARGIN, 15);
    }

    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(TEXT_COLOR);
    doc.text(title, pageWidth / 2, 15, { align: "center" });
};

function generateWeekPageManually(doc: jsPDF, week: MealPlanWeek, mealPlan: MealPlan, allFoodEntries: FoodEntry[]) {
  let yPos = 35;
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(TEXT_COLOR);
  doc.text(mealPlan.title, PAGE_MARGIN, yPos);
  yPos += 8;
  if (mealPlan.client_name) {
    doc.setFont("helvetica", "normal").setFontSize(14).setTextColor("#4b5563");
    doc.text(`Client: ${mealPlan.client_name}`, PAGE_MARGIN, yPos);
  }
  yPos += 15;
  const startY = yPos, tableX = PAGE_MARGIN, tableWidth = doc.internal.pageSize.getWidth() - (PAGE_MARGIN * 2), dayColWidth = 35, mealColWidth = (tableWidth - dayColWidth) / 3, headerHeight = 15, rowHeight = 35, textPadding = 3;

  doc.setFillColor(BRAND_COLOR).rect(tableX, startY, tableWidth, headerHeight, 'F');
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor("#ffffff");
  doc.text("Day", tableX + dayColWidth / 2, startY + headerHeight / 2 + 3, { align: 'center' });
  MEAL_TYPES.forEach((mealType, i) => { doc.text(mealType.name, tableX + dayColWidth + (i * mealColWidth) + (mealColWidth / 2), startY + headerHeight / 2 + 3, { align: 'center' }); });
  
  DAYS.forEach((day, dayIndex) => {
    const y = startY + headerHeight + (dayIndex * rowHeight);
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(TEXT_COLOR);
    doc.text(day, tableX + textPadding, y + rowHeight / 2 + 3);
    doc.setFont("helvetica", "normal").setFontSize(9);
    MEAL_TYPES.forEach((mealType, mealIndex) => {
      const x = tableX + dayColWidth + (mealIndex * mealColWidth);
      const meal = week.meals.find(m => m.day_of_week === (dayIndex + 1) && m.meal_type === mealType.key);
      if (meal) {
        const textLines = [
          ...meal.food_entry_ids.map(id => allFoodEntries.find(f => f.id === id)?.name || "Unknown Meal"),
          ...meal.custom_meal_texts.map(text => `- ${text}`)
        ];
        const combinedText = textLines.join('\n');
        const splitText = doc.splitTextToSize(combinedText, mealColWidth - (textPadding * 2));
        doc.text(splitText, x + textPadding, y + 7);
      }
    });
  });

  doc.setDrawColor(BORDER_GRAY).setLineWidth(0.2);
  for (let i = 0; i <= DAYS.length; i++) { doc.line(tableX, startY + headerHeight + (i * rowHeight), tableX + tableWidth, startY + headerHeight + (i * rowHeight)); }
  doc.line(tableX, startY, tableX, startY + headerHeight + (DAYS.length * rowHeight));
  doc.line(tableX + dayColWidth, startY, tableX + dayColWidth, startY + headerHeight + (DAYS.length * rowHeight));
  for (let i = 0; i <= MEAL_TYPES.length; i++) { doc.line(tableX + dayColWidth + (i * mealColWidth), startY, tableX + dayColWidth + (i * mealColWidth), startY + headerHeight + (DAYS.length * rowHeight)); }
}

function generateGuidelinesPage(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(TEXT_COLOR);
  doc.text("Useful Guidelines", PAGE_MARGIN, 35);
  const guidelines = [
    { type: "heading", text: "POINTS TO NOTE:" },
    { type: "point", text: "This meal plan is for guidance purposes and not intended to manage any medical conditions." },
    { type: "point", text: "The celery / ginger / cucumber combo juice should be drank first thing in the morning once you wake up." },
    { type: "point", text: "If you have stomach ulcer and can't tolerate Ginger, use mint leaves instead." },
    { type: "point", text: "Food preferences should be considered when choosing your protein and carbs sources, feel free to swap and interchange where necessary." },
    { type: "point", text: "The major aim of meal plans is to encourage you to eat Whole Foods as often as you can till it becomes a lifestyle so this is not set on stone as a meal plan is meant to be enjoyed and not endured." },
    { type: "point", text: "If you fall off one day or 2, I understand but please try to get back on track as quickly as possible." },
    { type: "point", text: "If you can stick to at least 80% of this plan, I am certain you will send me a positive testimonial." },
    { type: "point", text: "Aside your morning green juice, Eat all other fruits whole to enjoy the benefits of the Fibre it contains. Leave smoothies for now." },
    { type: "point", text: "Water detoxifies the system, rejuvenates your skin and hydrates; ensure you drink all the cups of water or if you can't keep count, get a 2 liter bottle and aim to finish it everyday and always take a bottle of water along as you go out." },
    { type: "point", text: "Depending on your daily schedule, if you are one to exercise first thing in the mornings, drink your green juice before workout and come back for breakfast before 8:30am." },
    { type: "point", text: "All these won't be complete if you don't sleep properly for at least 7 hrs every night and cut down on stress because 60% of weight gain is triggered by high cortisol levels." },
  ];
  let yPos = 55;
  const listSymbol = "\u2022";
  guidelines.forEach((item) => {
    // Page break logic needs to be simplified as we can't pass the full context here
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      addPageHeaderAndFooter(doc, null, "Guidelines (cont.)"); // Cannot pass logoBuffer here easily, so it will use fallback
      yPos = 35;
    }
    if (item.type === "heading") {
      doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(BRAND_COLOR);
      doc.text(item.text, PAGE_MARGIN, yPos);
      yPos += 10;
    } else {
      doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(TEXT_COLOR);
      const splitText = doc.splitTextToSize(item.text, contentWidth - 5);
      const textHeight = splitText.length * 5;
      doc.text(`${listSymbol}`, PAGE_MARGIN, yPos);
      doc.text(splitText, PAGE_MARGIN + 5, yPos);
      yPos += textHeight + 5;
    }
  });
}
