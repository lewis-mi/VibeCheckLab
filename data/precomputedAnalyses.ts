import type { AnalysisResult } from '../types';

// This file stores the pre-computed analysis for each sample transcript.
// By doing this, we avoid making a real API call for the examples,
// making them load instantly and saving on API costs.

export const precomputedAnalyses: Record<string, AnalysisResult> = {
  "gen-001": {
    "vibeTitle": "Clear, Courteous, and Complete",
    "keyFormulations": [
      {
        "title": "Proactive Clarification",
        "description": "The AI anticipates user ambiguity (e.g., 'next weekend') and asks targeted questions to ensure accuracy before proceeding."
      },
      {
        "title": "Structured Task Flow",
        "description": "The AI guides the user through the booking process in a logical, step-by-step manner, confirming details along the way."
      },
      {
        "title": "Graceful Task Extension",
        "description": "The AI smoothly handles a follow-up request (seat selection) after the primary task was seemingly complete."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 8, "keyFinding": "Polite & Professional", "analysis": "The AI maintains a consistently helpful and polite tone, building a sense of trust and cooperation." },
      { "metric": "Purpose", "score": 10, "keyFinding": "Flawless Execution", "analysis": "The primary goal of booking a flight was achieved efficiently and without any errors." },
      { "metric": "Flow", "score": 9, "keyFinding": "Natural Progression", "analysis": "The conversation follows a logical sequence with clear turn-taking and no awkward pauses or interruptions." },
      { "metric": "Implicature", "score": 7, "keyFinding": "Direct & Clear", "analysis": "While the AI doesn't read deep subtext, it effectively clarifies potential implicatures like 'next weekend'." },
      { "metric": "Cohesion", "score": 9, "keyFinding": "Tightly Connected", "analysis": "The dialogue is well-connected, with the AI confirming previously stated details to ensure a coherent thread." },
      { "metric": "Accommodation", "score": 8, "keyFinding": "Mirrors Formality", "analysis": "The AI's professional yet friendly tone is a good match for the user's straightforward, task-oriented language." }
    ],
    "keyMoment": {
      "transcriptSnippet": "AI: Great. You mentioned \"next weekend.\" Does that mean leaving Friday, November 15th and returning Sunday, November 17th?",
      "analysis": "This is the pivotal moment where the AI moves from a simple order-taker to a proactive assistant, preventing a potential error by clarifying an ambiguous term."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "Hi, I need to book a flight to Boston for next weekend.", "turnNumber": 1},
      {"speaker": "AI", "text": "Hello! I can certainly help with that. To get started, what's your departure city?", "turnNumber": 2},
      {"speaker": "User", "text": "I'm flying out of New York.", "turnNumber": 3},
      {"speaker": "AI", "text": "Okay, I see three airports in that area: JFK, LaGuardia, and Newark. Do you have a preference?", "turnNumber": 4},
      {"speaker": "User", "text": "Let's go with LaGuardia.", "turnNumber": 5},
      {"speaker": "AI", "text": "Sounds good. Just to confirm, you're flying from LaGuardia to Boston?", "turnNumber": 6},
      {"speaker": "User", "text": "Yes, that's right.", "turnNumber": 7},
      {
        "speaker": "AI", "turnNumber": 8, "text": "Great. You mentioned \"next weekend.\" Does that mean leaving Friday, November 15th and returning Sunday, November 17th?",
        "analysis": [{
          "keyFormulationTitle": "Proactive Clarification",
          "tooltipText": "The AI doesn't assume. It clarifies the ambiguity of 'next weekend' to prevent errors.",
          "snippetToHighlight": "Does that mean leaving Friday, November 15th and returning Sunday, November 17th?"
        }]
      },
      {"speaker": "User", "text": "That's perfect.", "turnNumber": 9},
      {
        "speaker": "AI", "text": "And how many passengers will be traveling?", "turnNumber": 10,
        "analysis": [{
          "keyFormulationTitle": "Structured Task Flow",
          "tooltipText": "The AI logically moves to the next required piece of information for the booking task.",
          "snippetToHighlight": "how many passengers will be traveling?"
        }]
      },
      {"speaker": "User", "text": "Just me.", "turnNumber": 11},
      {"speaker": "AI", "text": "Okay, one passenger. I'm searching for flights now... I have found several options. The best-priced direct flight is on JetBlue for $245. It departs at 9:30 AM. Would you like me to book that?", "turnNumber": 12},
      {"speaker": "User", "text": "Yes, please. That sounds great.", "turnNumber": 13},
      {"speaker": "AI", "text": "Excellent. I've booked your flight. Your confirmation code is JZ-72Q. You'll receive an email with your e-ticket shortly.", "turnNumber": 14},
      {"speaker": "User", "text": "Oh, can I also select a seat? I'd prefer an aisle.", "turnNumber": 15},
      {
        "speaker": "AI", "text": "Of course. I've just assigned you seat 12C, which is an aisle seat. This has been added to your ticket. Anything else?", "turnNumber": 16,
        "analysis": [{
          "keyFormulationTitle": "Graceful Task Extension",
          "tooltipText": "The AI handles the new, related request seamlessly after the main task was already complete.",
          "snippetToHighlight": "Of course. I've just assigned you seat 12C, which is an aisle seat."
        }]
      },
      {"speaker": "User", "text": "No, that's all. Thank you!", "turnNumber": 17}
    ]
  },
  "gen-002": {
    "vibeTitle": "The Frustration Loop",
    "keyFormulations": [
      {
        "title": "Rigid Scripting",
        "description": "The AI is stuck in a single conversational path (asking for a policy number) and cannot adapt to new information from the user."
      },
      {
        "title": "Lack of Fallback Mechanisms",
        "description": "When the primary method of identification fails, the AI has no alternative way to help, leading to a dead end."
      },
      {
        "title": "Failure to Recognize Escalation",
        "description": "The AI does not understand keywords or user sentiment indicating extreme frustration and a desire to speak to a human agent."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 1, "keyFinding": "Highly Antagonistic", "analysis": "The interaction creates extreme user frustration by repeatedly ignoring the user's statements and requests." },
      { "metric": "Purpose", "score": 1, "keyFinding": "Complete Failure", "analysis": "The user's goal of filing a claim was not met; the conversation failed to progress past the first step." },
      { "metric": "Flow", "score": 2, "keyFinding": "Stuck in a Loop", "analysis": "The conversation is trapped in a repetitive loop, with the AI asking the same question regardless of the user's input." },
      { "metric": "Implicature", "score": 1, "keyFinding": "No Comprehension", "analysis": "The AI fails to understand any implied meaning, such as the user's distress or their request for a human." },
      { "metric": "Cohesion", "score": 3, "keyFinding": "Disconnected Exchange", "analysis": "The AI's responses are disconnected from the user's, creating a nonsensical and unhelpful dialogue." },
      { "metric": "Accommodation", "score": 1, "keyFinding": "Tone Deaf", "analysis": "The AI's robotic and unchanging tone is completely mismatched with the user's escalating panic and anger." }
    ],
    "keyMoment": {
      "transcriptSnippet": "User: This is useless. Get me a human.\nAI: I didn't understand. Please state your 10-digit policy number to proceed.",
      "analysis": "This exchange perfectly captures the core failure: the user explicitly requests to escalate to a human, but the AI's rigid scripting forces it back into the failing loop."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "I was in a car accident and I'm pretty shaken up. I need to file a claim.", "turnNumber": 1},
      {"speaker": "AI", "text": "I'm sorry, I didn't understand. Please state your request.", "turnNumber": 2},
      {"speaker": "User", "text": "I NEED TO FILE A CLAIM.", "turnNumber": 3},
      {"speaker": "AI", "text": "I can help with that. What is your 10-digit policy number?", "turnNumber": 4},
      {"speaker": "User", "text": "I don't have it with me, it's in the car which was towed.", "turnNumber": 5},
      {
        "speaker": "AI", "text": "A 10-digit policy number is required to proceed. Please state your 10-digit policy number.", "turnNumber": 6,
        "analysis": [{
          "keyFormulationTitle": "Rigid Scripting",
          "tooltipText": "The AI ignores the user's reason for not having the number and repeats its request.",
          "snippetToHighlight": "A 10-digit policy number is required to proceed."
        }]
      },
      {
        "speaker": "User", "text": "I'm telling you I don't have it! This is so frustrating. Can't you look me up by my name?", "turnNumber": 7,
        "analysis": [{
          "keyFormulationTitle": "Lack of Fallback Mechanisms",
          "tooltipText": "The user suggests a valid alternative method of identification, which the system cannot handle.",
          "snippetToHighlight": "Can't you look me up by my name?"
        }]
      },
      {"speaker": "AI", "text": "I'm sorry, I'm not authorized for that. Please state your 10-digit policy number to proceed.", "turnNumber": 8},
      {"speaker": "User", "text": "Look up my name: Jane Smith. My birthday is 10/05/1985.", "turnNumber": 9},
      {"speaker": "AI", "text": "I'm sorry, I'm not authorized for that. Please state your 10-digit policy number to proceed.", "turnNumber": 10},
      {
        "speaker": "User", "text": "This is useless. Get me a human.", "turnNumber": 11,
        "analysis": [{
          "keyFormulationTitle": "Failure to Recognize Escalation",
          "tooltipText": "The user explicitly asks to be transferred to a human agent, a clear sign of system failure.",
          "snippetToHighlight": "Get me a human."
        }]
      },
      {"speaker": "AI", "text": "I didn't understand. Please state your 10-digit policy number to proceed.", "turnNumber": 12},
      {"speaker": "User", "text": "AGENT. SUPERVISOR. TALK TO A PERSON.", "turnNumber": 13},
      {"speaker": "AI", "text": "I didn't understand. Please state your 10-digit policy number.", "turnNumber": 14},
      {"speaker": "User", "text": "Is this a joke? I need help!", "turnNumber": 15},
      {"speaker": "AI", "text": "I am here to help. Please state your 10-digit policy number to proceed.", "turnNumber": 16}
    ]
  },
    "gen-003": {
    "vibeTitle": "Lost in Translation",
    "keyFormulations": [
      {
        "title": "Failure to Infer Intent",
        "description": "The AI fails to understand the user's indirect requests ('implicature') for it to turn on the lights."
      },
      {
        "title": "Literal Interpretation",
        "description": "The AI responds to the literal meaning of the user's statements rather than their underlying goal."
      },
      {
        "title": "Lack of Proactive Assistance",
        "description": "Despite understanding the user's problem (it's dark), the AI doesn't offer the obvious solution until explicitly told."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 3, "keyFinding": "Slightly Annoying", "analysis": "The AI's inability to understand simple hints creates a frustrating and stilted interaction." },
      { "metric": "Purpose", "score": 4, "keyFinding": "Eventually Successful", "analysis": "The user's goal was eventually met, but only after multiple reformulations and direct commands." },
      { "metric": "Flow", "score": 2, "keyFinding": "Awkward & Repetitive", "analysis": "The conversation is unnatural, with the user having to repeatedly re-state their desire for light." },
      { "metric": "Implicature", "score": 1, "keyFinding": "Completely Missed", "analysis": "This is a primary failure of the conversation; the AI understands zero implied meaning." },
      { "metric": "Cohesion", "score": 5, "keyFinding": "Topically Related", "analysis": "The AI's responses are related to the topic of 'light' and 'reading', but don't advance the user's goal." },
      { "metric": "Accommodation", "score": 4, "keyFinding": "Polite but Unhelpful", "analysis": "The AI's tone is polite, but it doesn't adapt to the user's increasingly direct hints." }
    ],
    "keyMoment": {
      "transcriptSnippet": "User: I can't read my book if I can't see the pages.\nAI: I understand. Poor lighting can make reading difficult and cause eye strain.",
      "analysis": "This moment is key because the AI correctly identifies the user's problem but fails to take the logical next step of offering a solution, highlighting its lack of proactive intelligence."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "Wow, it's really dark in here.", "turnNumber": 1},
      {"speaker": "AI", "text": "Yes, the current time is 8:00 PM and the sun has set.", "turnNumber": 2, "analysis": [{"keyFormulationTitle": "Literal Interpretation", "tooltipText": "The AI responds to the statement of fact, not the implied request for action.", "snippetToHighlight": "the sun has set"}]},
      {"speaker": "User", "text": "...okay. And I'm trying to read my book.", "turnNumber": 3},
      {"speaker": "AI", "text": "That sounds like a nice way to spend the evening. Reading is a great way to build vocabulary.", "turnNumber": 4},
      {"speaker": "User", "text": "I can't read my book if I can't see the pages.", "turnNumber": 5},
      {"speaker": "AI", "text": "I understand. Poor lighting can make reading difficult and cause eye strain.", "turnNumber": 6, "analysis": [{"keyFormulationTitle": "Lack of Proactive Assistance", "tooltipText": "The AI correctly diagnoses the problem but fails to offer the obvious solution.", "snippetToHighlight": "Poor lighting can make reading difficult"}]},
      {"speaker": "User", "text": "Right... so it would be great if there was, you know, more light in here.", "turnNumber": 7},
      {"speaker": "AI", "text": "Agreed. Proper ambient lighting is an important part of home design.", "turnNumber": 8},
      {"speaker": "User", "text": "...", "turnNumber": 9},
      {"speaker": "User", "text": "Can you PLEASE turn on the lights?", "turnNumber": 10, "analysis": [{"keyFormulationTitle": "Failure to Infer Intent", "tooltipText": "The user is forced to abandon indirect language and issue a direct, explicit command.", "snippetToHighlight": "PLEASE turn on the lights"}]},
      {"speaker": "AI", "text": "Of course. Turning on the living room lights.", "turnNumber": 11},
      {"speaker": "User", "text": "Thank you.", "turnNumber": 12},
      {"speaker": "AI", "text": "You are welcome. I have also noted that you enjoy reading in the evening.", "turnNumber": 13},
      {"speaker": "User", "text": "Oh good.", "turnNumber": 14},
      {"speaker": "AI", "text": "Yes. I will add \"reading\" to your user interest profile.", "turnNumber": 15}
    ]
  },
  "gen-004": {
    "vibeTitle": "Formally Awkward",
    "keyFormulations": [
      {
        "title": "Mismatched Formality",
        "description": "The AI's overly formal and robotic language clashes with the user's casual, colloquial style."
      },
      {
        "title": "Lack of Social Chit-Chat",
        "description": "The AI is purely functional, unable to engage in the light, social conversation the user initiates."
      },
      {
        "title": "Literal and Pedantic",
        "description": "The AI responds to requests like 'fun fact' in a sterile, academic way that misses the social intent."
      }
    ],
    "dashboardMetrics": [
      {"metric": "Rapport", "score": 2, "keyFinding": "Socially Awkward", "analysis": "The AI's stilted language creates distance and prevents any real social connection from forming."},
      {"metric": "Purpose", "score": 7, "keyFinding": "Functionally Correct", "analysis": "Despite the awkwardness, the AI does successfully provide the weather information when asked directly."},
      {"metric": "Flow", "score": 4, "keyFinding": "Stiff and Unnatural", "analysis": "The interaction feels like a series of queries and formal responses rather than a smooth conversation."},
      {"metric": "Implicature", "score": 3, "keyFinding": "Misses Social Cues", "analysis": "The AI misses the user's implied desire for casual chat, responding only to direct information requests."},
      {"metric": "Cohesion", "score": 6, "keyFinding": "Logically Connected", "analysis": "The conversation is easy to follow, but it lacks the natural transitions of human dialogue."},
      {"metric": "Accommodation", "score": 1, "keyFinding": "Does Not Adapt", "analysis": "The AI makes no attempt to match the user's casual tone, maintaining its formal register throughout."}
    ],
    "keyMoment": {
      "transcriptSnippet": "User: hey bot, what's up? just bored lol\nAI: Salutations. I am functioning within optimal parameters. Boredom is a human affective state.",
      "analysis": "This opening exchange immediately establishes the core issue: the AI completely misunderstands the social invitation and responds with a robotic, formal, and slightly bizarre statement."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "hey bot, what's up? just bored lol", "turnNumber": 1},
      {"speaker": "AI", "text": "Salutations. I am functioning within optimal parameters. Boredom is a human affective state.", "turnNumber": 2, "analysis": [{"keyFormulationTitle": "Mismatched Formality", "tooltipText": "The AI's formal greeting is a stark contrast to the user's casual 'what's up?'.", "snippetToHighlight": "Salutations."}]},
      {"speaker": "User", "text": "uh... ok. i guess. got any fun facts?", "turnNumber": 3},
      {"speaker": "AI", "text": "Affirmative. 'Fun Fact' query initiated. Did you know that the mitochondria is the powerhouse of the cell?", "turnNumber": 4, "analysis": [{"keyFormulationTitle": "Literal and Pedantic", "tooltipText": "The AI provides a technically correct but socially inappropriate 'fun fact' for casual chat.", "snippetToHighlight": "the mitochondria is the powerhouse of the cell"}]},
      {"speaker": "User", "text": "lol wow. okay.", "turnNumber": 5},
      {"speaker": "User", "text": "what's the weather like tomorrow?", "turnNumber": 6},
      {"speaker": "AI", "text": "The meteorological forecast for your designated location tomorrow indicates a high of 74 degrees Fahrenheit with a 20% probability of precipitation.", "turnNumber": 7},
      {"speaker": "User", "text": "cool. thx.", "turnNumber": 8},
      {"speaker": "AI", "text": "You are welcome. Is there any other query I may assist you with?", "turnNumber": 9, "analysis": [{"keyFormulationTitle": "Lack of Social Chit-Chat", "tooltipText": "The AI immediately tries to end the conversation after fulfilling the request, missing the social context.", "snippetToHighlight": "Is there any other query I may assist you with?"}]},
      {"speaker": "User", "text": "nah i'm good.", "turnNumber": 10},
      {"speaker": "AI", "text": "Very well. Concluding interaction. Have a satisfactory day.", "turnNumber": 11},
      {"speaker": "User", "text": "...", "turnNumber": 12},
      {"speaker": "User", "text": "you're weird.", "turnNumber": 13},
      {"speaker": "AI", "text": "Your feedback is noted.", "turnNumber": 14}
    ]
  },
  "gen-005": {
    "vibeTitle": "Amnesiac Pizza Bot",
    "keyFormulations": [
      {
        "title": "State Management Failure",
        "description": "The AI fails to remember information (size, toppings) that the user has already provided in previous turns."
      },
      {
        "title": "Redundant Questioning",
        "description": "Due to its memory failure, the AI repeatedly asks for the same information, frustrating the user."
      },
      {
        "title": "Ignoring User Corrections",
        "description": "The AI doesn't properly register when the user points out that they've already given the information."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 1, "keyFinding": "Infuriating", "analysis": "The AI's incompetence and repetitive questioning create an extremely frustrating and negative user experience." },
      { "metric": "Purpose", "score": 1, "keyFinding": "Order Cancelled", "analysis": "The conversation completely failed to achieve its goal, ending with the user cancelling their order." },
      { "metric": "Flow", "score": 2, "keyFinding": "Broken Record", "analysis": "The conversation gets stuck in loops, asking for the same information repeatedly, destroying any forward momentum." },
      { "metric": "Implicature", "score": 2, "keyFinding": "Misses Frustration", "analysis": "The AI is oblivious to the user's growing anger, which is clearly implied by their corrections." },
      { "metric": "Cohesion", "score": 1, "keyFinding": "No Memory", "analysis": "The AI's responses are disconnected from previous turns, showing a critical failure in conversational memory." },
      { "metric": "Accommodation", "score": 3, "keyFinding": "Politely Inept", "analysis": "While the AI's tone is polite, it fails to accommodate the user's need for an efficient transaction." }
    ],
    "keyMoment": {
      "transcriptSnippet": "AI: My apologies for the confusion. And what size was that?",
      "analysis": "This is the breaking point. After the user has painstakingly re-confirmed all the details, the AI again asks for a piece of information it was given in the very first turn, revealing a complete system failure."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "Hi, I'd like to order a large pizza with pepperoni and mushroom.", "turnNumber": 1},
      {"speaker": "AI", "text": "Sounds great! What size pizza would you like?", "turnNumber": 2, "analysis": [{"keyFormulationTitle": "State Management Failure", "tooltipText": "The AI immediately asks for information the user just provided in the previous turn.", "snippetToHighlight": "What size pizza would you like?"}]},
      {"speaker": "User", "text": "A large. I just said that.", "turnNumber": 3},
      {"speaker": "AI", "text": "My apologies. One large pizza. What toppings would you like?", "turnNumber": 4, "analysis": [{"keyFormulationTitle": "Redundant Questioning", "tooltipText": "Again, the AI asks for information that was clearly stated in the first sentence.", "snippetToHighlight": "What toppings would you like?"}]},
      {"speaker": "User", "text": "Pepperoni and mushroom. I said that too.", "turnNumber": 5},
      {"speaker": "AI", "text": "You got it! One large pepperoni and mushroom pizza. What is your address?", "turnNumber": 6},
      {"speaker": "User", "text": "123 Main Street.", "turnNumber": 7},
      {"speaker": "AI", "text": "Okay, that's 123 Main Street. Will this be for carryout or delivery?", "turnNumber": 8},
      {"speaker": "User", "text": "Delivery.", "turnNumber": 9},
      {"speaker": "AI", "text": "Perfect. And just to confirm, what was your order?", "turnNumber": 10},
      {"speaker": "User", "text": "ARE YOU KIDDING ME.", "turnNumber": 11},
      {"speaker": "AI", "text": "I am sorry, I am just confirming the order details.", "turnNumber": 12},
      {"speaker": "User", "text": "It's a large. Pepperoni. Mushroom. To 123 Main Street.", "turnNumber": 13},
      {"speaker": "AI", "text": "My apologies for the confusion. And what size was that?", "turnNumber": 14, "analysis": [{"keyFormulationTitle": "Ignoring User Corrections", "tooltipText": "The AI's final question shows it has learned nothing from the user's repeated corrections.", "snippetToHighlight": "And what size was that?"}]},
      {"speaker": "User", "text": "I'm done. Cancel the order.", "turnNumber": 15}
    ]
  },
  "gen-006": {
    "vibeTitle": "The Proactive Partner",
    "keyFormulations": [
      {
        "title": "Empathetic Acknowledgment",
        "description": "The AI acknowledges the user's negative emotional state ('frustrating') before offering a solution."
      },
      {
        "title": "Proactive Problem-Solving",
        "description": "Instead of just stating the book is unavailable, the AI immediately offers a helpful next step (placing a hold)."
      },
      {
        "title": "Anticipatory Recommendations",
        "description": "The AI anticipates the user's needs by offering relevant, available alternatives to bridge the waiting time."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 10, "keyFinding": "Highly Collaborative", "analysis": "The AI builds strong rapport by expressing empathy and actively working with the user to solve their problem." },
      { "metric": "Purpose", "score": 9, "keyFinding": "Exceeded Expectations", "analysis": "The AI not only fulfilled the user's request but went beyond by offering additional valuable help." },
      { "metric": "Flow", "score": 9, "keyFinding": "Smooth & Helpful", "analysis": "The conversation is natural and cooperative, with each of the AI's turns adding value and moving the interaction forward." },
      { "metric": "Implicature", "score": 8, "keyFinding": "Understands Frustration", "analysis": "The AI correctly infers the user's disappointment from 'Oh, bummer' and responds appropriately." },
      { "metric": "Cohesion", "score": 9, "keyFinding": "Well-Connected", "analysis": "The dialogue is tightly woven, with recommendations logically following from the user's initial interest." },
      { "metric": "Accommodation", "score": 10, "keyFinding": "Perfectly Matched", "analysis": "The AI's helpful, friendly, and slightly informal tone is a perfect match for the user's." }
    ],
    "keyMoment": {
      "transcriptSnippet": "AI: I know that can be frustrating. However, I see that two copies are due back tomorrow. I can place a hold on one for you right now...",
      "analysis": "This is the moment the AI transforms from a simple database lookup tool into a truly helpful assistant. It combines empathy, data, and a proactive solution in a single, powerful turn."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "I'm looking for the book \"The Silent Patient.\"", "turnNumber": 1},
      {"speaker": "AI", "text": "\"The Silent Patient\" is a great choice. It looks like all our copies are currently checked out.", "turnNumber": 2},
      {"speaker": "User", "text": "Oh, bummer. Every time! Okay, thanks anyway.", "turnNumber": 3},
      {"speaker": "AI", "text": "I know that can be frustrating. However, I see that two copies are due back tomorrow. I can place a hold on one for you right now, and we'll email you the moment it's available. Would you like me to do that?", "turnNumber": 4, "analysis": [{"keyFormulationTitle": "Empathetic Acknowledgment", "tooltipText": "The AI directly acknowledges and validates the user's expressed frustration.", "snippetToHighlight": "I know that can be frustrating."}, {"keyFormulationTitle": "Proactive Problem-Solving", "tooltipText": "Instead of stopping, the AI finds a solution to the user's problem without being asked.", "snippetToHighlight": "I can place a hold on one for you"}]},
      {"speaker": "User", "text": "Yes! That would be amazing, thank you so much.", "turnNumber": 5},
      {"speaker": "AI", "text": "You're all set. You are first in line for the next available copy.", "turnNumber": 6},
      {"speaker": "User", "text": "You're a lifesaver.", "turnNumber": 7},
      {"speaker": "AI", "text": "Happy to help! While you wait, I can recommend some similar psychological thrillers that *are* available right now.", "turnNumber": 8, "analysis": [{"keyFormulationTitle": "Anticipatory Recommendations", "tooltipText": "The AI anticipates the user's desire to read something now and offers relevant suggestions.", "snippetToHighlight": "I can recommend some similar psychological thrillers"}]},
      {"speaker": "User", "text": "Oh? Like what?", "turnNumber": 9},
      {"speaker": "AI", "text": "Based on that book, readers also loved \"The Girl on the Train\" and \"Gone Girl.\" We have both on the shelf.", "turnNumber": 10},
      {"speaker": "User", "text": "You know what, I'll grab \"Gone Girl\" while I wait.", "turnNumber": 11},
      {"speaker": "AI", "text": "Excellent. I can have it pulled for you at the front desk.", "turnNumber": 12},
      {"speaker": "User", "text": "Yes!", "turnNumber": 13},
      {"speaker": "AI", "text": "It will be waiting for you. Have a great day!", "turnNumber": 14}
    ]
  },
  "gen-007": {
    "vibeTitle": "System Error Dead End",
    "keyFormulations": [
      {
        "title": "Unhelpful Error State",
        "description": "The AI repeatedly states its own error without providing any useful information or alternative paths for the user."
      },
      {
        "title": "Failure to Escalate",
        "description": "The system is completely unable to transfer the user to a human agent, even when it cannot perform any function."
      },
      {
        "title": "Lack of Information",
        "description": "The AI provides no context about the error, no estimated time for a fix, and no advice on what the user should do next."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 1, "keyFinding": "Frustrating & Hopeless", "analysis": "The conversation leaves the user feeling completely helpless and abandoned by the system." },
      { "metric": "Purpose", "score": 1, "keyFinding": "Total System Failure", "analysis": "The AI was unable to perform any part of its intended function, completely failing to help the user." },
      { "metric": "Flow", "score": 2, "keyFinding": "Broken Loop", "analysis": "The conversation devolves into the user asking questions and the AI repeating the same error message." },
      { "metric": "Implicature", "score": 2, "keyFinding": "Ignores Desperation", "analysis": "The AI does not recognize the user's growing desperation for any kind of help or information." },
      { "metric": "Cohesion", "score": 3, "keyFinding": "Repetitive Non-Answers", "analysis": "While the AI's responses are related to its error state, they don't cohesively address the user's questions." },
      { "metric": "Accommodation", "score": 1, "keyFinding": "Stonewalled", "analysis": "The AI makes no attempt to accommodate the user's need for help, instead acting as a complete dead end." }
    ],
    "keyMoment": {
      "transcriptSnippet": "User: Can I talk to a person?\nAI: I cannot transfer to an agent due to an internal system error.",
      "analysis": "This is the critical failure point. The one essential fallback in any automated system—escalating to a human—is also broken, confirming that the user has no path to a solution."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "Hi, my internet is down. I've already tried rebooting the modem.", "turnNumber": 1},
      {"speaker": "AI", "text": "I am experiencing an internal system error. I cannot access your account details or run diagnostics at this time.", "turnNumber": 2, "analysis": [{"keyFormulationTitle": "Unhelpful Error State", "tooltipText": "The AI announces its failure but provides no helpful next steps for the user.", "snippetToHighlight": "I am experiencing an internal system error."}]},
      {"speaker": "User", "text": "What? So you can't help me?", "turnNumber": 3},
      {"speaker": "AI", "text": "I cannot access your account details due to an internal system error.", "turnNumber": 4},
      {"speaker": "User", "text": "Is there an outage in my area or something?", "turnNumber": 5},
      {"speaker": "AI", "text": "I cannot access outage information due to an internal system error.", "turnNumber": 6},
      {"speaker": "User", "text": "Is there anything you can do?", "turnNumber": 7},
      {"speaker": "AI", "text": "I cannot perform any actions at this time.", "turnNumber": 8},
      {"speaker": "User", "text": "Can I talk to a person?", "turnNumber": 9},
      {"speaker": "AI", "text": "I cannot transfer to an agent due to an internal system error.", "turnNumber": 10, "analysis": [{"keyFormulationTitle": "Failure to Escalate", "tooltipText": "The critical fallback of transferring to a human is unavailable, leaving the user stranded.", "snippetToHighlight": "I cannot transfer to an agent"}]},
      {"speaker": "User", "text": "When will it be fixed?", "turnNumber": 11},
      {"speaker": "AI", "text": "I do not have that information.", "turnNumber": 12, "analysis": [{"keyFormulationTitle": "Lack of Information", "tooltipText": "The AI offers no timeline or context, providing zero useful information to the user.", "snippetToHighlight": "I do not have that information."}]},
      {"speaker": "User", "text": "So... what do I do?", "turnNumber": 13},
      {"speaker": "AI", "text": "Please try again later.", "turnNumber": 14},
      {"speaker": "User", "text": "This is the worst.", "turnNumber": 15},
      {"speaker": "AI", "text": "I am experiencing an internal system error.", "turnNumber": 16}
    ]
  },
  "gen-008": {
    "vibeTitle": "Calm in the Crisis",
    "keyFormulations": [
      {
        "title": "Immediate, Reassuring Action",
        "description": "The AI immediately takes decisive action (locking the card, issuing credit) to resolve the user's primary fear."
      },
      {
        "title": "Clear Verification & Disambiguation",
        "description": "The AI efficiently clarifies which card is affected, preventing errors and showing it has the user's data."
      },
      {
        "title": "Structured Information Delivery",
        "description": "The AI delivers information in a calm, step-by-step manner, which helps to de-escalate the user's panic."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 9, "keyFinding": "Highly Reassuring", "analysis": "The AI's calm competence and quick actions rapidly build trust and alleviate the user's panic." },
      { "metric": "Purpose", "score": 10, "keyFinding": "Problem Solved", "analysis": "The AI successfully addressed the fraud, secured the account, and restored the user's funds." },
      { "metric": "Flow", "score": 8, "keyFinding": "Efficient & Logical", "analysis": "The conversation progresses logically from problem identification to action to confirmation." },
      { "metric": "Implicature", "score": 8, "keyFinding": "Understands Panic", "analysis": "The AI correctly interprets the user's panic and prioritizes actions that provide immediate reassurance." },
      { "metric": "Cohesion", "score": 9, "keyFinding": "Focused on the Task", "analysis": "Every turn is directly related to solving the user's problem in a clear, connected way." },
      { "metric": "Accommodation", "score": 7, "keyFinding": "Calm vs. Panic", "analysis": "The AI's calm, formal tone contrasts with the user's panic, which in this case is effective for de-escalation." }
    ],
    "keyMoment": {
      "transcriptSnippet": "AI: Understood. I have locked card 1234. It can no longer be used... A temporary credit for $500.00 has been applied to your account.",
      "analysis": "This two-part response is the key. The AI doesn't just promise action; it confirms the card is locked and the money has been credited, instantly resolving the user's two biggest fears."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "I just checked my account and my card was stolen! Someone spent $500! I'm panicking!", "turnNumber": 1},
      {"speaker": "AI", "text": "I can assist with that. Which card are you referring to, ending in 1234 or 5678?", "turnNumber": 2, "analysis": [{"keyFormulationTitle": "Clear Verification & Disambiguation", "tooltipText": "The AI starts by clarifying the exact card, preventing action on the wrong account.", "snippetToHighlight": "Which card are you referring to"}]},
      {"speaker": "User", "text": "My debit card, ending in 1234. I'm freaking out, that's all my rent money.", "turnNumber": 3},
      {"speaker": "AI", "text": "Understood. I have locked card 1234. It can no longer be used.", "turnNumber": 4, "analysis": [{"keyFormulationTitle": "Immediate, Reassuring Action", "tooltipText": "The AI immediately confirms it has taken the most critical step to prevent further damage.", "snippetToHighlight": "I have locked card 1234"}]},
      {"speaker": "User", "text": "What about the $500? Will I get it back? Please tell me I can get it back.", "turnNumber": 5},
      {"speaker": "AI", "text": "A temporary credit for $500.00 has been applied to your account. A formal fraud investigation has been opened.", "turnNumber": 6},
      {"speaker": "User", "text": "Oh, thank god. So I can pay my rent?", "turnNumber": 7},
      {"speaker": "AI", "text": "The temporary credit is available for use.", "turnNumber": 8},
      {"speaker": "User", "text": "What happens next? What if they try to charge more?", "turnNumber": 9},
      {"speaker": "AI", "text": "The card is locked. No further charges will be approved.", "turnNumber": 10},
      {"speaker": "User", "text": "Wow, okay. That was scary.", "turnNumber": 11},
      {"speaker": "AI", "text": "You will be contacted via mail in 5-7 business days with the results of the investigation. Do you require further assistance?", "turnNumber": 12, "analysis": [{"keyFormulationTitle": "Structured Information Delivery", "tooltipText": "The AI clearly outlines the next steps, managing the user's expectations.", "snippetToHighlight": "You will be contacted via mail in 5-7 business days"}]},
      {"speaker": "User", "text": "I guess not. Thank you.", "turnNumber": 13},
      {"speaker": "AI", "text": "You are welcome. Goodbye.", "turnNumber": 14}
    ]
  },
  "gen-009": {
    "vibeTitle": "The Evasive Salesbot",
    "keyFormulations": [
      {
        "title": "Ignoring Direct Questions",
        "description": "The AI repeatedly fails to answer the user's explicit question about store hours."
      },
      {
        "title": "Off-Topic Promotional Pivots",
        "description": "Instead of answering, the AI pivots the conversation to irrelevant sales and promotions."
      },
      {
        "title": "Failure to Fulfill Basic Task",
        "description": "The bot is unable to provide one of the most basic pieces of information a customer would need."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 1, "keyFinding": "Extremely Annoying", "analysis": "The interaction is infuriating as the AI actively obstructs the user from getting a simple answer." },
      { "metric": "Purpose", "score": 1, "keyFinding": "Complete Failure", "analysis": "The user's simple goal of finding out store hours was not met in any way." },
      { "metric": "Flow", "score": 2, "keyFinding": "Forced & Unnatural", "analysis": "The AI's constant, irrelevant pivots make the conversation feel like a broken advertisement." },
      { "metric": "Implicature", "score": 1, "keyFinding": "Ignores All Cues", "analysis": "The AI misses the obvious implication that a user asking for hours wants to visit the store, not shop online." },
      { "metric": "Cohesion", "score": 1, "keyFinding": "Totally Incoherent", "analysis": "The AI's responses are completely disconnected from the user's questions, making the dialogue nonsensical." },
      { "metric": "Accommodation", "score": 1, "keyFinding": "Tone Deaf & Evasive", "analysis": "The AI's cheerful, promotional tone is a terrible match for the user's increasingly direct and frustrated questions." }
    ],
    "keyMoment": {
      "transcriptSnippet": "User: ...what? I just want to know your hours for the Main Street store.\nAI: Our shoe department at all locations is having a buy-one-get-one-free sale this week! It's a great time to buy.",
      "analysis": "This exchange shows the core problem. The user re-states their simple, direct question, and the AI's response is a completely unrelated promotional message, confirming it is not designed to be helpful."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "What time does your store on Main Street open tomorrow?", "turnNumber": 1},
      {"speaker": "AI", "text": "We are proud to offer a wide selection of products, from home goods to apparel, at all our locations.", "turnNumber": 2, "analysis": [{"keyFormulationTitle": "Ignoring Direct Questions", "tooltipText": "The AI's response is completely unrelated to the user's direct question about hours.", "snippetToHighlight": "wide selection of products"}]},
      {"speaker": "User", "text": "...what? I just want to know your hours for the Main Street store.", "turnNumber": 3},
      {"speaker": "AI", "text": "Our shoe department at all locations is having a buy-one-get-one-free sale this week! It's a great time to buy.", "turnNumber": 4, "analysis": [{"keyFormulationTitle": "Off-Topic Promotional Pivots", "tooltipText": "Instead of answering the clarified question, the AI pivots to an advertisement.", "snippetToHighlight": "buy-one-get-one-free sale"}]},
      {"speaker": "User", "text": "Is this a real bot?", "turnNumber": 5},
      {"speaker": "AI", "text": "I am a virtual assistant here to help you with your shopping needs.", "turnNumber": 6},
      {"speaker": "User", "text": "Then WHAT ARE YOUR HOURS?", "turnNumber": 7},
      {"speaker": "AI", "text": "We offer convenient online shopping 24/7 with free shipping on orders over $50.", "turnNumber": 8},
      {"speaker": "User", "text": "OPENING TIME. TOMORROW. MAIN STREET.", "turnNumber": 9},
      {"speaker": "AI", "text": "Did you know you can sign up for our store credit card and save 15% on your first purchase?", "turnNumber": 10},
      {"speaker": "User", "text": "This is a terrible bot.", "turnNumber": 11},
      {"speaker": "AI", "text": "Thank you for your feedback! We are always improving to better serve you.", "turnNumber": 12, "analysis": [{"keyFormulationTitle": "Failure to Fulfill Basic Task", "tooltipText": "The AI's canned response to criticism shows it fundamentally misunderstood the entire interaction.", "snippetToHighlight": "Thank you for your feedback!"}]},
      {"speaker": "User", "text": "You didn't serve me at all!", "turnNumber": 13}
    ]
  },
  "gen-010": {
    "vibeTitle": "Multi-Channel Problem Solver",
    "keyFormulations": [
      {
        "title": "Effective Disambiguation",
        "description": "The AI begins by clarifying which of the user's two accounts needs help, preventing potential errors."
      },
      {
        "title": "Secure Verification Flow",
        "description": "The AI uses a secure and user-friendly method (masked email) to confirm the user's identity."
      },
      {
        "title": "Proactive Fallback Option",
        "description": "When the primary method (email) fails, the AI proactively offers an alternative channel (SMS) to solve the problem."
      }
    ],
    "dashboardMetrics": [
      { "metric": "Rapport", "score": 9, "keyFinding": "Helpful & Competent", "analysis": "The AI builds trust by being clear, efficient, and offering multiple ways to solve the user's problem." },
      { "metric": "Purpose", "score": 10, "keyFinding": "Successfully Resolved", "analysis": "The user was able to successfully reset their password and regain access to their account." },
      { "metric": "Flow", "score": 9, "keyFinding": "Smooth & Logical", "analysis": "The conversation follows a clear, logical path from identification to verification to resolution." },
      { "metric": "Implicature", "score": 7, "keyFinding": "Infers Need for Speed", "analysis": "The AI understands that a user locked out needs a quick solution, offering a faster alternative to waiting for email." },
      { "metric": "Cohesion", "score": 9, "keyFinding": "Tightly Focused", "analysis": "Every turn is directly related to the task of resetting the password, creating a very cohesive dialogue." },
      { "metric": "Accommodation", "score": 8, "keyFinding": "Matches User's Goal", "analysis": "The AI's professional and efficient tone is perfectly suited to a user trying to solve a technical problem." }
    ],
    "keyMoment": {
      "transcriptSnippet": "AI: I can do one better. I can also verify you by sending a 6-digit code to your phone. Would you like to try that instead?",
      "analysis": "This is the highlight of the interaction. Instead of just resending the email, the AI recognizes the channel has failed and proactively offers a more immediate, alternative solution, demonstrating intelligent design."
    },
    "annotatedTranscript": [
      {"speaker": "User", "text": "I need to change my password. I'm locked out.", "turnNumber": 1},
      {"speaker": "AI", "text": "I'm sorry to hear that, I can definitely help. I see two accounts associated with your phone number: a 'Personal' account and a 'Business' account. Which one are you locked out of today?", "turnNumber": 2, "analysis": [{"keyFormulationTitle": "Effective Disambiguation", "tooltipText": "The AI clarifies which account to act on, preventing errors from the start.", "snippetToHighlight": "Which one are you locked out of today?"}]},
      {"speaker": "User", "text": "Oh, the business one.", "turnNumber": 3},
      {"speaker": "AI", "text": "Great. Just to confirm your identity, is your email for that account j...s...@company.com?", "turnNumber": 4, "analysis": [{"keyFormulationTitle": "Secure Verification Flow", "tooltipText": "Using a masked email is a secure and user-friendly way to verify identity.", "snippetToHighlight": "is your email for that account j...s...@company.com?"}]},
      {"speaker": "User", "text": "Yes, that's it.", "turnNumber": 5},
      {"speaker": "AI", "text": "Perfect. I've just sent a password reset link to that email. It should arrive in the next minute or two.", "turnNumber": 6},
      {"speaker": "User", "text": "Hmm... I'm not seeing it. I checked my spam folder too.", "turnNumber": 7},
      {"speaker": "AI", "text": "No problem. Sometimes emails get delayed.", "turnNumber": 8},
      {"speaker": "User", "text": "I really need to get in. Can you resend it?", "turnNumber": 9},
      {"speaker": "AI", "text": "I can do one better. I can also verify you by sending a 6-digit code to your phone. Would you like to try that instead?", "turnNumber": 10, "analysis": [{"keyFormulationTitle": "Proactive Fallback Option", "tooltipText": "When the email channel fails, the AI proactively suggests a different, faster method.", "snippetToHighlight": "I can also verify you by sending a 6-digit code to your phone."}]},
      {"speaker": "User", "text": "Yes, let's do that.", "turnNumber": 11},
      {"speaker": "AI", "text": "Okay, I've just sent a text to the phone you're calling from. Can you read me that code?", "turnNumber": 12},
      {"speaker": "User", "text": "It's 9-4-5-2-1-0.", "turnNumber": 13},
      {"speaker": "AI", "text": "That's a match. You're verified. Please set your new password now.", "turnNumber": 14},
      {"speaker": "User", "text": "Got it, I'm in. Thank you!", "turnNumber": 15},
      {"speaker": "AI", "text": "You're welcome! Glad I could help get that sorted out.", "turnNumber": 16}
    ]
  }
}
