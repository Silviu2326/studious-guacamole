export interface ClientStats {
  oneRepMaxes: Record<string, number>; // exerciseId -> weight in kg
}

// Mock stats for demonstration
export const MOCK_CLIENT_STATS: ClientStats = {
  oneRepMaxes: {
    'e3': 100, // Bench Press
    'e4': 80,  // Barbell Row
    'e5': 120, // Squat (example)
  }
};

/**
 * Calculates the load based on a percentage of 1RM.
 * @param input - The percentage input (e.g., "80%", "80", 0.8).
 * @param exerciseId - The ID of the exercise.
 * @param stats - The client's statistics containing 1RMs.
 * @returns An object containing the calculated weight and formatted string, or error details.
 */
export const calculateLoad = (
  input: string | number,
  exerciseId: string,
  stats: ClientStats
): { weight: number | null; display: string; warning?: string } => {
  let percentage = 0;

  // Parse input
  if (typeof input === 'number') {
    percentage = input > 1 ? input / 100 : input;
  } else {
    // Remove common non-numeric prefixes/suffixes like @, %, 1RM, spaces
    const cleanInput = input.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleanInput);
    
    if (isNaN(parsed)) {
      return { weight: null, display: input, warning: 'Invalid number' };
    }
    
    // If user enters "80", assume 80% (0.8). If "0.8", assume 80%.
    // Convention: inputs > 5 usually mean percentage as whole number.
    percentage = parsed > 1 ? parsed / 100 : parsed;
  }

  // Check if 1RM exists
  const oneRepMax = stats.oneRepMaxes[exerciseId];

  if (oneRepMax === undefined) {
    return {
      weight: null,
      display: typeof input === 'string' && input.includes('%') ? input : `${percentage * 100}%`,
      warning: '1RM not found'
    };
  }

  const weight = Math.round(oneRepMax * percentage);
  const display = `${Math.round(percentage * 100)}% (${weight}kg)`;

  return { weight, display, warning: undefined };
};

export const isPercentage = (value: string): boolean => {
  return value.trim().endsWith('%') || (value.trim().startsWith('@') && value.includes('%'));
};
