import React from 'react';
import { BookOpenIcon } from './icons';

interface AcademicSourcesProps {
  onBack: () => void;
}

const sources = [
    { title: "Politeness Theory", description: "How we manage social-face and rapport.", source: "Brown & Levinson (1987). 'Politeness: Some Universals in Language Usage.'" },
    { title: "Speech Act Theory", description: "The actions we perform with words (e.g., promising, warning, apologizing).", source: "J. L. Austin (1962). 'How to Do Things with Words.'" },
    { title: "Conversation Analysis", description: "The structure of conversation, like turn-taking and flow.", source: "Sacks, Schegloff, & Jefferson (1974). 'A simplest systematics for the organization of turn-taking for conversation.'" },
    { title: "Conversational Implicature", description: "How meaning is conveyed beyond literal words through shared context.", source: "Paul Grice (1975). 'Logic and Conversation.'" },
    { title: "Discourse Analysis", description: "How sentences are woven together to create a cohesive and coherent conversation.", source: "Halliday & Hasan (1976). 'Cohesion in English.'" },
    { title: "Accommodation Theory", description: "How we adjust our communication style to signal social closeness or distance.", source: "Giles, H. (1973). 'Accent mobility: a model and some data.'" }
];

const AcademicSources: React.FC<AcademicSourcesProps> = ({ onBack }) => {
  return (
    <div style={styles.container} className="anim-pop-in">
      <button onClick={onBack} className="text-button" style={styles.backButton}>&larr; Back to Lab</button>
      
      <div style={styles.header}>
        <h1 style={styles.title}>The Lab Library</h1>
      </div>
      
      <section style={styles.section}>
        <h2>1. How Vibe Check Works (The App)</h2>
        <p>Your Vibe Check report is the result of a simple, 3-step process that connects your browser to our "Lab Assistant" (the AI).</p>
        <div style={styles.step}>
          <strong>Step 1: You Provide the Transcript</strong>
          <p>When you paste a transcript and click "Check the vibe," your app securely sends that raw text to our server. We do not store your transcripts. Please remove any personal information before analyzing.</p>
        </div>
        <div style={styles.step}>
          <strong>Step 2: Our "Lab Assistant" Analyzes</strong>
          <p>Our server instructs a powerful AI model to perform a comprehensive analysis of your text. Instead of a simple "chat," the AI is programmed to act as an expert Conversation Analyst and return its findings as a highly structured JSON data file.</p>
        </div>
        <div style={styles.step}>
          <strong>Step 3: You Get the Interactive Dashboard</strong>
          <p>In less than a second, your app receives that JSON data. It uses this data to build the interactive dashboard you see—populating the "Vibe Headline," the "Key Formulations" legend, and all the highlights on your transcript.</p>
        </div>
      </section>

      <section style={styles.section}>
        <h2>2. How Our AI "Reasons" (The Analysis)</h2>
        <p>We get consistent, high-quality analysis by giving our AI a very specific set of instructions—a "Master Prompt"—that we've engineered for this lab.</p>
        <p>This prompt is the "secret sauce." It instructs the AI to follow this logic:</p>
        <ul style={styles.reasonList}>
            <li><strong>Adopt a Persona:</strong> The AI must first "become" an expert Conversation Analyst at the Vibe Check Lab.</li>
            <li><strong>Use Our Frameworks:</strong> It is commanded to analyze the transcript through the specific lens of the academic theories listed below.</li>
            <li><strong>Find the "Key Formulations":</strong> The AI uses these theories to find the top 3 most important design takeaways that define the conversation.</li>
            <li><strong>Tag the Transcript:</strong> It then re-reads the entire transcript and "tags" every key moment with one of those 3 formulations.</li>
            <li><strong>Forced JSON Output:</strong> The AI is not allowed to just "talk." It is forced to output its entire analysis as a single, strict JSON object.</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2>3. Our Academic Foundations (The Theories)</h2>
        <p>
            The Vibe Check Lab's analysis is grounded in established linguistic theories. Each framework provides a unique lens for understanding the complex chemistry of conversation.
        </p>
        <div style={styles.grid}>
            {sources.map((item, index) => (
            <div key={item.title} style={{...styles.card, animationDelay: `${0.2 + index * 0.05}s`}} className="insight-card anim-slide-up-fade">
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDescription}>{item.description}</p>
                <em style={styles.cardSource}>{item.source}</em>
            </div>
            ))}
        </div>
      </section>

    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    padding: '20px',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '16px',
    width: '100%',
  },
  title: {
    fontSize: '2em',
    margin: 0,
  },
  intro: {
    fontSize: '1.1em',
    maxWidth: '650px',
    color: 'var(--text-color-secondary)',
    marginBottom: '24px',
    textAlign: 'center',
    alignSelf: 'center',
    lineHeight: 1.6,
  },
  section: {
    width: '100%',
    marginBottom: '48px',
  },
  step: {
    padding: '16px',
    backgroundColor: 'var(--subtle-background)',
    borderRadius: 'var(--border-radius)',
    marginBottom: '12px',
    border: '1px solid var(--border-color-light)',
  },
  reasonList: {
    paddingLeft: '20px',
    lineHeight: 1.7
  },
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '24px',
  },
  card: {
    padding: '20px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '1.2em',
    margin: '0 0 8px 0',
  },
  cardDescription: {
    margin: '0 0 16px 0',
    color: 'var(--text-color-secondary)',
    flex: '1 1 auto',
  },
  cardSource: {
    fontSize: '0.9em',
    color: 'var(--text-color-secondary)',
    fontFamily: 'var(--font-accent)',
  }
};

export default AcademicSources;