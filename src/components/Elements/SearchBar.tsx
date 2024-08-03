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
    isNike?: boolean;
    isParty?: boolean;
};
export const SearchBar = ({
    classNames,
    placeholderText,
    searchKey,
    refetchKey,
    graphQLFilter,
    isNike = false,
    isParty = false,
}: SearchBarProps) => {
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
                    'group relative flex w-full justify-center border text-white xl:w-full',
                    'focus-within:ring-4 ',
                    {
                        'border-nike-orange-500 bg-nike-orange-700 focus-within:ring-nike-orange-800 rounded-lg border': isNike && !isParty,
                        'rounded-lg border border-sky-700 bg-sky-700/60 focus-within:ring-sky-600': !isNike,
                        'border-nike-orange-500 focus-within:ring-nike-orange-800 rounded-3xl border-2 bg-white': isParty,
                    },
                    classNames
                )}
            >
                <input
                    type="text"
                    id={id}
                    className={clsx(
                        'text-md block w-full border-0 text-start  font-semibold  focus:border-transparent focus:outline-none focus:ring-0',
                        {
                            'bg-nike-orange-700/80 rounded-l-lg text-white placeholder:text-orange-100': isNike && !isParty,
                            'rounded-l-lg bg-sky-700/60 text-white placeholder:text-sky-100': !isNike,
                            'rounded-l-3xl bg-white text-black': isParty,
                        }
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
                <div
                    className={clsx('flex cursor-pointer items-center  px-4 duration-300 hover:scale-110', {
                        ' ': isNike && !isParty,
                        ' bg-sky-700/60': !isNike,
                        ' bg-nike-orange-500 rounded-full ': isParty,
                    })}
                >
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
    if (input) {
        const lowerCase = input.toLowerCase();
        const upperCase = input.toUpperCase();
        const titleCase = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

        return `
            name: {
                or: [
                    { contains: "${lowerCase}" },
                    { contains: "${upperCase}" },
                    { contains: "${titleCase}" },
                    { contains: "${input}" }
                ]
            }
        `;
    }

    return '';
};

export const TickerGraphQLFilter = (input: string) => {
    if (input) {
        const lowerCase = input.toLowerCase();
        const upperCase = input.toUpperCase();
        const titleCase = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

        return `
            ticker: {
                or: [
                    { contains: "${lowerCase}" },
                    { contains: "${upperCase}" },
                    { contains: "${titleCase}" },
                    { contains: "${input}" }
                ]
            }
        `;
    }

    return '';
};

export const PoolUtxoPoolGraphQLFilter = (input: string) => {
    if (input) {
        const lowerCase = input.toLowerCase();
        const upperCase = input.toUpperCase();
        const titleCase = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

        return `
            pool: {
                or: [
                    { name: { contains: "${lowerCase}" } },
                    { name: { contains: "${upperCase}" } },
                    { name: { contains: "${titleCase}" } },
                    { name: { contains: "${input}" } }
                ]
            }
        `;
    }

    return '';
};

export const LiftoffProjectGraphQLFilter = (input: string) => {
    if (input) {
        const lowerCase = input.toLowerCase();
        const upperCase = input.toUpperCase();
        const titleCase = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

        return `token_project: {
            or: [
                { name: { contains: "${lowerCase}" } },
                { name: { contains: "${upperCase}" } },
                { name: { contains: "${titleCase}" } },
                { name: { contains: "${input}" } }
            ]
        }`;
    }

    return '';
};
