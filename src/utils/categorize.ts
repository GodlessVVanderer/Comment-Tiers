// src/utils/categorize.ts

import { kmeans } from "ml-kmeans"; 

/**
 * Categorizes comments using K-Means clustering based on comment length.
 * NOTE: This function is a conceptual placeholder for demonstrating the analysis
 * flow and is not used by the current Gemini-based analysis.
 * * @param comments - Array of comment texts.
 * @param clusters - Number of clusters to create.
 * @returns A map of cluster index to an array of comments in that cluster.
 */
export function categorizeComments(comments: string[], clusters = 5) {
  // Simple vectorization: use comment length as the feature
  const vectorized = comments.map(c => c.length);
  
  // K-Means clustering expects an array of feature vectors (e.g., [[v1], [v2], ...])
  // FIX: Removed obsolete comments and unnecessary type assertions to rely on type inference for cleaner, more type-safe code.
  const result = kmeans(vectorized.map(v => [v]), clusters, {});
  
  const categoryMap: Record<number, string[]> = {};
  
  // Map the comment texts back to their cluster index
  if (result?.clusters && Array.isArray(result.clusters)) {
    result.clusters.forEach((clusterIndex, commentIndex) => {
      if (commentIndex >= comments.length) return;
      if (!categoryMap[clusterIndex]) categoryMap[clusterIndex] = [];
      categoryMap[clusterIndex].push(comments[commentIndex]);
    });
  }

  return categoryMap;
}
