import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import { setMetadataCache } from 'dataverse-ify';
import { metadataCache } from './dataverse-gen/metadata';
import { MsalProvider } from '@azure/msal-react';
import { initializeIcons } from '@fluentui/react';

export const msalInstance = new PublicClientApplication(msalConfig);
setMetadataCache(metadataCache);
initializeIcons();
ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
