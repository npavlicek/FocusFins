import * as reactDom from 'react-dom/client';

const root = document.getElementById("root")!;

const reactRoot = reactDom.createRoot(root);
reactRoot.render(<h1>Hello world</h1>);
