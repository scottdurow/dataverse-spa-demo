import { IColumn, ISearchBoxStyles, SearchBox, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import { useDebounce } from '@react-hook/debounce';
import React, { useCallback, useState } from 'react';
import { Contact } from '../dataverse-gen/entities/Contact';
import { useDataverseClient } from '../hooks/useDataverseClient';

export const DataverseGrid = () => {
    const [items, setItems] = useState<(Contact | null)[] | undefined>(undefined);
    const [searchText, setSearchText] = useState<string | undefined>('');
    const [searchTextDebounce, setSearchTextDebounce] = useDebounce<string | undefined>('', 500);
    const columns = [{ name: 'Full Name', key: 'fullname', fieldName: 'fullname' }] as IColumn[];

    useDataverseClient(
        async (client) => {
            if (client) {
                try {
                    const contacts = await client.retrieveMultiple<Contact>(`
                <fetch>
                    <entity name="contact">
                    <attribute name="fullname" />
                    <filter>
                    <condition attribute="fullname" operator="like" value="%${searchTextDebounce}%" />
                  </filter>
                    </entity>
                </fetch>`);

                    setItems(contacts.entities);
                } catch (e) {
                    console.error(e);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    alert((e as any).message);
                }
            }
        },
        [searchTextDebounce, setItems],
    );

    const textFieldStyles: Partial<ISearchBoxStyles> = { root: { width: 300 } };
    const searchOnChange = useCallback(
        (e: unknown, value?: string) => {
            setSearchText(value);
            setItems(undefined);
            setSearchTextDebounce(value);
        },
        [setSearchText, setSearchTextDebounce, setItems],
    );

    return (
        <div>
            <SearchBox styles={textFieldStyles} placeholder="Search" onChange={searchOnChange} value={searchText} />
            <ShimmeredDetailsList
                setKey="items"
                items={items || []}
                columns={columns}
                selectionMode={SelectionMode.none}
                enableShimmer={!items}
                ariaLabelForShimmer="Content is being fetched"
                ariaLabelForGrid="Item details"
            />
        </div>
    );
};
