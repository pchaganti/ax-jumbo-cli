import { Section } from './Section';
import { Annotation } from './Annotation';

export interface GroupSection extends Section {
  type: 'group';
  content: unknown[];
  metadata: {
    groupHeader?: string;
    annotation?: Annotation;
    rendererType: string;
  };
}
