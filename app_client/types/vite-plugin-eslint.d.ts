declare module 'vite-plugin-eslint'
declare module 'react-grid-heatmap';
declare module 'react-infinite-scroll-component';
declare module 'rehype-highlight';
declare module 'rehype-raw';
declare module 'string-similarity';
declare module 'canvas-confetti';
declare module 'jsonrepair';
declare const google: any;
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
declare module '*.png' {
  const content: any;
  export default content;
}
