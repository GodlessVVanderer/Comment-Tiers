import type { Comment } from './types';

// A small, representative list of substantive comments, retained for testing or fallback purposes.
// This data is no longer used in the primary application flow.
export const MOCK_COMMENTS: Comment[] = [
  {
    // FIX: Add missing 'id' property.
    id: 'mock-1',
    author: "LegalEagle",
    text: "From a legal perspective, the discussion on data privacy at 22:10 raises serious concerns that go beyond simple regulation. We are looking at potential constitutional challenges regarding the fourth amendment if this technology is deployed without judicial oversight. This needs a much deeper legislative review."
  },
  {
    // FIX: Add missing 'id' property.
    id: 'mock-2',
    author: "EthicsStudent",
    text: "The section on ethical implications was the most important part, but it barely scratched the surface. The presenter needs to address the inherent biases in the training data, which could lead to discriminatory outcomes for marginalized communities. It's not enough to just acknowledge the problem."
  },
  {
    // FIX: Add missing 'id' property.
    id: 'mock-3',
    author: "SkepticalSam",
    text: "While the technical breakdown of the AI model at 12:45 was insightful, the presenter conveniently ignores the potential for misuse. A tool this powerful could easily be turned into an instrument of state surveillance on a scale we've never seen before. The safeguards mentioned are purely theoretical at this point."
  },
  {
    // FIX: Add missing 'id' property.
    id: 'mock-4',
    author: "ConcernedCitizen",
    text: "I have a critical question about the training data used for the facial recognition component. Was it ethically sourced with explicit consent from all individuals, or was it scraped from public sources? The distinction is crucial for the legality and morality of this entire project."
  },
  {
    // FIX: Add missing 'id' property.
    id: 'mock-5',
    author: "DataScientist22",
    text: "I agree with the point made around 12:50. The model's architecture is a significant leap forward, but that makes the lack of a robust ethical framework even more glaring and dangerous."
  }
];