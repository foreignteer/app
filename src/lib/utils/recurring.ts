import { Experience } from '../types/experience';

/**
 * Generates individual occurrences from a recurring experience
 * @param experience The recurring experience
 * @param maxOccurrences Maximum number of occurrences to generate (default: 12)
 * @returns Array of experience instances with unique dates
 */
export function expandRecurringExperience(
  experience: Experience,
  maxOccurrences: number = 12
): Experience[] {
  if (!experience.recurring) {
    return [experience];
  }

  const occurrences: Experience[] = [];
  const startDate = new Date(experience.dates.start);
  const endDate = new Date(experience.dates.end);
  const duration = endDate.getTime() - startDate.getTime();

  // Parse recurrence pattern to determine interval
  const pattern = experience.recurrencePattern?.toLowerCase() || '';
  let intervalDays = 0;

  if (pattern === 'weekly') {
    intervalDays = 7;
  } else if (pattern === 'biweekly') {
    intervalDays = 14;
  } else if (pattern === 'monthly') {
    // For monthly, we'll use 30 days as approximation
    intervalDays = 30;
  } else {
    // Default to weekly if can't parse
    intervalDays = 7;
  }

  // Generate occurrences for the next year
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 12); // Look ahead 12 months

  let currentStart = new Date(startDate);
  let occurrenceCount = 0;

  while (occurrenceCount < maxOccurrences && currentStart <= maxDate) {
    // Only include future dates
    if (currentStart >= today) {
      const currentEnd = new Date(currentStart.getTime() + duration);

      occurrences.push({
        ...experience,
        id: `${experience.id}-${currentStart.getTime()}`,
        dates: {
          start: new Date(currentStart),
          end: new Date(currentEnd),
        },
        // Mark as instance of recurring event
        recurringInstanceOf: experience.id,
      } as any);

      occurrenceCount++;
    }

    // Move to next occurrence
    currentStart.setDate(currentStart.getDate() + intervalDays);
  }

  return occurrences.length > 0 ? occurrences : [experience];
}

/**
 * Expands all recurring experiences in an array
 * NOTE: This is now DISABLED because we create separate database records for each occurrence
 * We only expand if the experience does NOT have a recurringGroupId (old-style recurring events)
 */
export function expandAllRecurringExperiences(
  experiences: Experience[],
  maxOccurrencesPerEvent: number = 12
): Experience[] {
  const expanded: Experience[] = [];

  for (const experience of experiences) {
    // CRITICAL FIX: Only expand if this is an old-style recurring event without a recurringGroupId
    // New-style recurring events are already stored as separate database records
    if (experience.recurring && !(experience as any).recurringGroupId) {
      // Old-style recurring event - expand it
      expanded.push(...expandRecurringExperience(experience, maxOccurrencesPerEvent));
    } else {
      // New-style or non-recurring - already a single occurrence
      expanded.push(experience);
    }
  }

  return expanded;
}
