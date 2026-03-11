declare module "gsap/SplitText" {
  export default class SplitText {
    constructor(element: Element | string, options?: {
      type?: string;
      linesClass?: string;
      wordsClass?: string;
      charsClass?: string;
      tag?: string;
    });
    
    lines: Element[];
    words: Element[];
    chars: Element[];
    
    revert(): void;
  }
}
