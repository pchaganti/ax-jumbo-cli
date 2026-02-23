import { SectionType } from './SectionType';
import { Annotation } from './Annotation';

export interface Section {
  type: SectionType;
  content: unknown;
  metadata?: {
    annotation?: Annotation;
    groupHeader?: string;
    rendererType?: string;
    [key: string]: unknown;
  };
}
