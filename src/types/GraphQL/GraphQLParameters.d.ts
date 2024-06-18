export interface GraphQLParameters {
    first?: number;
    last?: number;
    before?: string;
    after?: string;
    order?: any;
    where?: any;

    // Parameter Types
    orderParameterType?: any;
    whereParameterType?: any;
}
