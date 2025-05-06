
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root using createRoot API (React 18)
const root = createRoot(document.getElementById("root")!);

// Render the App component inside the root
root.render(<App />);
