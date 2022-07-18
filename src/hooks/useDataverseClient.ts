import { useAccount, useMsal } from '@azure/msal-react';
import { XrmContextDataverseClient } from 'dataverse-ify';
import { SPAWebApi } from 'dataverse-ify/lib/webapi/spa';
import { useEffect, useRef } from 'react';
import { silentRequest } from '../authConfig';
import { dataverseConfig } from '../dataverseConfig';
export const useDataverseClient = (operation: (client: XrmContextDataverseClient) => void, dependencies: unknown[]) => {
    const dataverseClientRef = useRef<XrmContextDataverseClient>();
    const webApiRef = useRef<SPAWebApi>();
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0]);

    useEffect(() => {
        if (!dataverseClientRef.current) {
            const webApi = new SPAWebApi(dataverseConfig.server, dataverseConfig.version);
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
                .then((response) => {
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
