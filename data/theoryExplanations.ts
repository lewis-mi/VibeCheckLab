import type { DeepDiveConcept } from '../types';

// This data is now static and served from the client, reducing the AI's workload.
// The 'analysis' field will be populated dynamically from the dashboard metrics.
export const theoryExplanations: Omit<DeepDiveConcept, 'analysis'>[] = [
  {
    concept: "Rapport",
    explanation: "Based on Politeness Theory, this refers to the social harmony and connection between speakers. High rapport is achieved by managing 'face'—the public self-image—through politeness strategies, making interactions feel smooth and cooperative.",
    source: "Brown, P., & Levinson, S. C. (1987). Politeness: Some universals in language usage."
  },
  {
    concept: "Purpose",
    explanation: "Grounded in Speech Act Theory, this measures how effectively the conversation achieves its goal. It assesses whether the speakers' actions (like requesting, informing, or promising) are clear, direct, and successful.",
    source: "Austin, J. L. (1962). How to do things with words."
  },
  {
    concept: "Flow",
    explanation: "From Conversation Analysis, flow refers to the smooth and orderly progression of a conversation, particularly in turn-taking. Good flow avoids awkward silences, interruptions, or non-sequiturs, making the exchange feel natural.",
    source: "Sacks, H., Schegloff, E. A., & Jefferson, G. (1974). A simplest systematics for the organization of turn-taking."
  },
  {
    concept: "Implicature",
    explanation: "This concept, from Grice's Maxims, refers to the meaning that is implied but not explicitly stated. A conversation with clear implicature allows speakers to understand each other's intentions and indirect requests without needing to spell everything out.",
    source: "Grice, H. P. (1975). Logic and conversation."
  },
  {
    concept: "Cohesion",
    explanation: "Based in Discourse Analysis, cohesion is the 'glue' that holds a conversation together. It's achieved through linguistic devices like pronouns, repetition, and conjunctions that link different parts of the conversation, making it a unified whole rather than a series of disconnected sentences.",
    source: "Halliday, M. A. K., & Hasan, R. (1976). Cohesion in English."
  },
  {
    concept: "Accommodation",
    explanation: "Communication Accommodation Theory states that speakers adjust their communication style (e.g., speech rate, formality, vocabulary) to either signal closeness and solidarity (convergence) or to emphasize social distance (divergence).",
    source: "Giles, H., Taylor, D. M., & Bourhis, R. (1973). Towards a theory of interpersonal accommodation."
  }
];
