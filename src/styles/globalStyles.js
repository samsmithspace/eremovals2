/**
 * Inject global styles into the document
 */
export const injectGlobalStyles = () => {
    // Basic global styles - this would normally be in CSS files
    const globalCSS = `
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      font-family: var(--font-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .d-flex {
      display: flex;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .justify-content-center {
      justify-content: center;
    }
    
    .justify-content-between {
      justify-content: space-between;
    }
    
    .text-center {
      text-align: center;
    }
    
    .text-white {
      color: white;
    }
  `;

    // Create and inject style element
    const styleElement = document.createElement('style');
    styleElement.textContent = globalCSS;
    document.head.appendChild(styleElement);
};

// Export theme object from existing theme.js
export { default } from './theme';