import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'ar'?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean;
        'touch-action'?: string;
        'poster'?: string;
        'shadow-intensity'?: string;
        'exposure'?: string;
        'auto-rotate'?: boolean;
        'loading'?: string;
        'reveal'?: string;
        'bounds'?: string;
        'min-field-of-view'?: string;
        'max-field-of-view'?: string;
        'interpolation-decay'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
      }, HTMLElement>;
    }
  }
}
