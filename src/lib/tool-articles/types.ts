export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolArticleContent {
  slug: string;
  whatIs: {
    paragraphs: string[];
    bullets?: string[];
  };
  formula: {
    intro: string;
    blocks: string[];
    notes?: string[];
  };
  example: {
    title: string;
    scenario: string;
    steps: string[];
    toolCheck: string;
  };
  faq: ToolFaqItem[];
  relatedHtml?: string;
}
