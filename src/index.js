import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
console.log('Clerk Key:', clerkPubKey ? 'Present' : 'Missing');

if (!clerkPubKey) {
  console.error('Missing Clerk Publishable Key. Please check your .env.local file');
  throw new Error('Missing Clerk Publishable Key in .env.local');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#1976d2'
        },
        elements: {
          formButtonPrimary: {
            fontSize: '14px',
            textTransform: 'none',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#115293'
            }
          }
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
