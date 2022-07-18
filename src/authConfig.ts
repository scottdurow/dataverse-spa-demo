import { Configuration, LogLevel } from '@azure/msal-browser';
import { dataverseConfig } from './dataverseConfig';

export const msalConfig = {
    auth: {
        clientId: dataverseConfig.applicationId,
        authority: `https://login.microsoftonline.com/${dataverseConfig.tenantId}`,
        redirectUri: '/',
        postLogoutRedirectUri: '/',
        navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        allowRedirectInIframe: true,
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
        },
    },
} as Configuration;

export const loginRequest = {
    scopes: ['email', `${dataverseConfig.server}/.default`],
};

export const silentRequest = {
    scopes: ['openid', `${dataverseConfig.server}/.default`],
};
