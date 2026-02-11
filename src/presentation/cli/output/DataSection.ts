import { Section } from './Section';

export interface DataSection extends Section {
  type: 'data';
  content: unknown;
}
