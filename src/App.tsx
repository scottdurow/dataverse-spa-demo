import React, { useEffect } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from './authConfig';
import { DataverseGrid } from './components/DataverseGrid';
import { Text } from '@fluentui/react';
function App() {
    const { login, error, acquireToken } = useMsalAuthentication(InteractionType.Redirect, loginRequest);

    useEffect(() => {
        if (error instanceof InteractionRequiredAuthError) {
            login(InteractionType.Redirect, loginRequest);
        } else if (error) {
            acquireToken(InteractionType.Redirect, loginRequest);
        }
    }, [error, login, acquireToken]);

    const { accounts } = useMsal();

    return (
        <>
            <AuthenticatedTemplate>
                <Text>Signed in as: {accounts && accounts.length > 0 && accounts[0].username}</Text>
                <DataverseGrid />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <p>No user signed in!</p>
            </UnauthenticatedTemplate>
        </>
    );
}

export default App;
