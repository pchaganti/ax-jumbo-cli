import { Section } from './Section';

export interface PromptSection extends Section {
  type: 'prompt';
  content: string;
}
