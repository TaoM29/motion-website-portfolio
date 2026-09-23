import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './app';
export { portfolio } from '../app/portfolio';
export { site, pageMetadata, projectPath } from '../app/site';

export function render(path: string) {
  return renderToString(<StrictMode><App path={path} /></StrictMode>);
}
