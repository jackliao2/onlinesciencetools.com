export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolWorkedExample {
  title: string;
  scenario: string;
  steps: string[];
  toolCheck: string;
}

export interface ToolArticleContent {
  slug: string;
  /** Optional H2 override for the intro block (defaults to “What is the {tool}?”). */
  introHeading?: string;
  whatIs: {
    paragraphs: string[];
    bullets?: string[];
  };
  formula: {
    intro: string;
    blocks: string[];
    notes?: string[];
  };
  example: ToolWorkedExample;
  /** Extra worked examples rendered after the primary one. */
  moreExamples?: ToolWorkedExample[];
  faq: ToolFaqItem[];
  /** Optional in-article cross-links (href + label). */
  seeAlso?: Array<{ href: string; label: string }>;
}
