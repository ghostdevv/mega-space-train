import './app.css';

const canvas = document.createElement('canvas')!;
document.body.appendChild(canvas);

const { run } = await import('./main');
await run(canvas);
