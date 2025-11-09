// A simple utility to assign colors based on the order of formulations.
// This ensures that the first formulation is always green, the second blue, etc.

const formulationColors = [
  '--highlight-color-1', // e.g., Green
  '--highlight-color-2', // e.g., Blue
  '--highlight-color-3', // e.g., Purple/Amber
];

/**
 * Returns a CSS variable name for a color based on an index.
 * @param index The index of the key formulation in the array.
 * @returns A string representing the CSS variable for the color.
 */
export const getFormulationColorByIndex = (index: number): string => {
  return formulationColors[index % formulationColors.length];
};
