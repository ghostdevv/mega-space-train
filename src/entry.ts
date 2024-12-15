import './app.css';

class Loader {
    private cleanup: (() => void)[] = [];
    private root: HTMLDivElement;
    private percent = 0;

    constructor() {
        this.root = document.createElement('div');
        this.root.classList.add('loader');
        this.root.innerText = 'Loading 0%';
    }

    start() {
        document.body.appendChild(this.root);

        let timeout: ReturnType<typeof setTimeout>;

        const next = () => {
            this.percent += 10;
            this.root.innerText = `Loading ${this.percent}%`;
            const remaining = 100 - this.percent;

            if (remaining > 15) {
                timeout = setTimeout(next, 200);
            }
        };

        timeout = setTimeout(next, 200);

        this.cleanup.push(() => {
            clearTimeout(timeout);
        });
    }

    stop() {
        for (const fn of this.cleanup) {
            fn();
        }

        document.body.removeChild(this.root);
    }
}

const canvas = document.createElement('canvas')!;
document.body.appendChild(canvas);

const loader = new Loader();
loader.start();

const { run } = await import('./main');
await run(canvas);

loader.stop();
