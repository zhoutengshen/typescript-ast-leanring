export {};
declare global {
  interface Route {
    path: string;
    query?: Record<string, any>;
    component: () => Promise<string>;
    children?: Route[];
  }
  
}
