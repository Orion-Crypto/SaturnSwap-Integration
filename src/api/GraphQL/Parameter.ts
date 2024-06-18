import { GraphQLParameters } from '@/types/GraphQL/GraphQLParameters';

export const calculateStringFromParameters = (parameters?: GraphQLParameters, parenthesis?: boolean) => {
    const first = parameters?.first ? `first: ${parameters.first},` : '';
    const last = parameters?.last ? `last: ${parameters.last},` : '';
    const before = parameters?.before ? `before: ${parameters.before},` : '';
    const after = parameters?.after ? `after: ${parameters.after},` : '';
    const sort = parameters?.order ? `order: ${parameters.order},` : '';
    const where = parameters?.where ? `where: ${parameters.where},` : '';

    let parameterString = parameters ? `${first} ${last} ${before} ${after} ${sort} ${where}` : '';
    if (parenthesis) {
        parameterString = `(${parameterString})`;
    }
    return parameterString;
};

export const setGraphQLParameters = (graphQLParameters: GraphQLParameters = {}, pageParam: any) => {
    graphQLParameters.after = pageParam;
    return graphQLParameters;
};

export const getNextPageParam = (lastPage: any) => {
    if (lastPage?.pageInfo?.endCursor && lastPage?.pageInfo?.hasNextPage) {
        return `"${lastPage?.pageInfo?.endCursor}"`;
    }
    return undefined;
};

export const getPreviousPageParam = (firstPage: any) => {
    if (firstPage?.pageInfo?.startCursor && firstPage?.pageInfo?.hasPreviousPage) {
        return `"${firstPage?.pageInfo?.startCursor}"`;
    }
    return undefined;
};

// Advanced Pagination Helper Functions
export const calculateVariableDefinitionsFromParameters = (parameters?: GraphQLParameters) => {
    const first = parameters?.first ? `$first: Int!,` : '';
    const last = parameters?.last ? `$last: Int!,` : '';
    const before = parameters?.before ? `$before: String!,` : '';
    const after = parameters?.after ? `$after: String!,` : '';
    const order = parameters?.order && parameters?.orderParameterType ? parameters.orderParameterType : '';
    const where = parameters?.where && parameters?.whereParameterType ? parameters?.whereParameterType : '';

    let parameterString = parameters ? `${first} ${last} ${before} ${after} ${order} ${where}` : ''; //  : '';
    if (parameterString.endsWith(',')) {
        parameterString = parameterString.substring(0, parameterString.length - 1);
    }
    return parameterString;
};

export const calculateVariableInputsFromParameters = (parameters?: GraphQLParameters) => {
    const first = parameters?.first ? `first: $first,` : '';
    const last = parameters?.last ? `last: $last,` : '';
    const before = parameters?.before ? `before: $before,` : '';
    const after = parameters?.after ? `after: $after,` : '';
    const order = parameters?.order ? `order: $order,` : '';
    const where = parameters?.where ? `where: $where,` : '';

    let parameterString = parameters ? `${first} ${last} ${before} ${after} ${order} ${where}` : ''; //  : '';
    if (parameterString.endsWith(',')) {
        parameterString = parameterString.substring(0, parameterString.length - 1);
    }
    return parameterString;
};

export const calculateVariablesFromParameters = (parameters?: GraphQLParameters) => {
    const variables: any = {};
    if (!!parameters?.first) {
        variables['first'] = parameters.first;
    }

    if (!!parameters?.last) {
        variables['last'] = parameters.last;
    }

    if (!!parameters?.before) {
        variables['before'] = parameters.before;
    }

    if (!!parameters?.after) {
        variables['after'] = parameters.after;
    }

    if (!!parameters?.order) {
        variables['order'] = parameters.order;
    }

    if (!!parameters?.where) {
        variables['where'] = parameters.where;
    }

    return variables;
};
