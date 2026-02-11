import { Section } from './Section';
import { Annotation } from './Annotation';

export interface AnnotationSection extends Section {
  type: 'annotation';
  content: Annotation;
}
