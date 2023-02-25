import { AccountSubtype, AccountType, Configuration, CountryCode, ItemPublicTokenExchangeRequest, ItemPublicTokenExchangeResponse, LinkTokenCreateRequest as LinkTokenCreateRequestPlaid } from "plaid";
import { CreateSessionRequest } from "fuse-node";
import { AxiosResponse } from "axios";
export { CountryCode };
export { Configuration };
export interface LinkTokenCreateRequest extends LinkTokenCreateRequestPlaid {
    fuse_institution_id: string;
    session_client_secret: string;
    mx?: {
        config: any;
    };
}
export interface AccountsGetRequest {
    access_token: string;
}
export interface AccountBalance {
    available: number | null;
    current: number | null;
    limit: number | null;
    iso_currency_code: string | null;
    unofficial_currency_code: string | null;
    last_updated_datetime?: string | null;
}
export interface AccountBase {
    account_id: string;
    balances: AccountBalance;
    mask: string | null;
    name: string;
    official_name: string | null;
    type: AccountType;
    subtype: AccountSubtype | null;
    fingerprint: string;
}
export interface Item {
    item_id: string;
    institution_id?: string | null;
}
export interface AccountsGetResponse {
    accounts: Array<AccountBase>;
    item: Item;
    request_id: string;
}
export interface NumbersACH {
    account_id: string;
    account: string;
    routing: string;
    wire_routing: string | null;
}
export interface NumbersBACS {
    account_id: string;
    account: string;
    sort_code: string;
}
export interface AuthGetNumbers {
    ach: Array<NumbersACH>;
    bacs: Array<NumbersBACS>;
}
export interface AuthGetRequest {
    access_token: string;
}
export interface AuthGetResponse {
    accounts: Array<AccountBase>;
    numbers: AuthGetNumbers;
    item: Item;
    request_id: string;
}
export interface AccountsBalanceGetRequest {
    access_token: string;
}
export interface AccountsBalanceGetResponse {
    access_token: string;
}
export declare class PlaidApi {
    private fuseApi;
    constructor(configuration: Configuration);
    sessionCreate: (createSessionRequest: CreateSessionRequest, options?: any) => Promise<any>;
    linkTokenCreate: (linkTokenCreateRequest: LinkTokenCreateRequest, options?: any) => Promise<any>;
    itemPublicTokenExchange: (itemPublicTokenExchangeRequest: ItemPublicTokenExchangeRequest, options?: any) => Promise<AxiosResponse<ItemPublicTokenExchangeResponse>>;
    accountsGet: (accountsGetRequest: AccountsGetRequest, options?: any) => Promise<AccountsGetResponse>;
    authGet: (authGetRequest: AuthGetRequest, options?: any) => Promise<AuthGetResponse>;
    accountsBalanceGet: (accountsBalanceGetRequest: AccountsBalanceGetRequest, options?: any) => Promise<AccountsGetResponse>;
}
