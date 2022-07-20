import { AuthenticationResult } from '@azure/msal-common';
import { useAccount, useMsal } from '@azure/msal-react';
import { XrmContextDataverseClient } from 'dataverse-ify';
import { BrowserWebApi } from 'dataverse-ify/lib/webapi/browser';
import { useEffect, useRef } from 'react';
import { silentRequest } from '../authConfig';
import { dataverseConfig } from '../dataverseConfig';
export const useDataverseClient = (operation: (client: XrmContextDataverseClient) => void, dependencies: unknown[]) => {
    const dataverseClientRef = useRef<XrmContextDataverseClient>();
    const webApiRef = useRef<BrowserWebApi>();
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0]);

    useEffect(() => {
        if (!dataverseClientRef.current) {
            const webApi = new BrowserWebApi(dataverseConfig.server, dataverseConfig.version);
            const dataverseClient = new XrmContextDataverseClient(webApi as unknown as Xrm.WebApi);
            dataverseClientRef.current = dataverseClient;
            webApiRef.current = webApi;
        }

        if (account) {
            instance
                .acquireTokenSilent({
                    ...silentRequest,
                    ...{
                        account: account,
                    },
                })
                .then((response: AuthenticationResult) => {
                    if (response && webApiRef && webApiRef.current) {
                        webApiRef.current.setAccessToken(response.accessToken);
                        operation(dataverseClientRef.current as XrmContextDataverseClient);
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instance, account, ...dependencies]);

    return { client: dataverseClientRef.current };
};
