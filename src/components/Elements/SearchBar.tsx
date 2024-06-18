import { queryClient } from '@/hooks/default';
import { setInputValue, setSearchValue, useGetInputValue } from '@/hooks/Models/search.hook';
import clsx from 'clsx';
import { useEffect } from 'react';

const INPUT_VALUE_KEY = ['input', 'value'];

type SearchBarProps = {
    classNames: string;
    placeholderText: string;
    searchKey: any;
    refetchKey: any;
    graphQLFilter: (value: string) => string;
};
export const SearchBar = ({ classNames, placeholderText, searchKey, refetchKey, graphQLFilter }: SearchBarProps) => {
    const { data: inputValue }: any = useGetInputValue(INPUT_VALUE_KEY);
    useEffect(() => {
        const timer = setTimeout(() => {
            const value = graphQLFilter(inputValue);
            setSearchValue(searchKey, value);
            queryClient.refetchQueries(refetchKey);
        }, 500);
        // Clear the timer when the component unmounts or when searchValue changes
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [searchKey, refetchKey, graphQLFilter, inputValue]);

    const id = 'search';
    return (
        <>
            <div
                className={clsx(
                    'group relative flex w-full justify-center rounded-lg border border-sky-700 bg-sky-700/60 text-white xl:w-full',
                    'focus-within:ring-4 focus-within:ring-sky-600',
                    classNames
                )}
            >
                <input
                    type="text"
                    id={id}
                    className={clsx(
                        'text-md block w-full rounded-l-lg border-0 bg-sky-700/60 text-start font-semibold text-white',
                        'placeholder:font-semibold placeholder:text-sky-100',
                        'focus:ring-0'
                    )}
                    placeholder={placeholderText}
                    autoComplete="off"
                    onKeyDown={(event: any) => {
                        if (event.key === 'Enter') {
                            setInputValue(INPUT_VALUE_KEY, event.target.value);
                        }
                    }}
                    onChange={(event: any) => {
                        setInputValue(INPUT_VALUE_KEY, event.target.value);
                    }}
                    value={inputValue ?? ''}
                />
                <div className="flex cursor-pointer items-center px-4 duration-300 hover:scale-110">
                    <svg
                        aria-hidden="true"
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>
            </div>
        </>
    );
};

// Base Filters
export const DefaultGraphQLFilter = (input: string) => {
    const variable = input;

    if (variable) {
        return 'name: {contains: "' + variable + '"}';
    }

    return '';
};

export const TickerGraphQLFilter = (input: string) => {
    const variable = input;

    if (variable) {
        return 'ticker: {contains: "' + variable + '"}';
    }

    return '';
};
