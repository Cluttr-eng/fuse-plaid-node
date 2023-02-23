import {
  Configuration,
  CountryCode,
  ItemPublicTokenExchangeRequest,
  ItemPublicTokenExchangeResponse,
  LinkTokenCreateRequest as LinkTokenCreateRequestPlaid,
  LinkTokenCreateResponse,
  PlaidEnvironments
} from "plaid";
import {
  CreateLinkTokenRequest,
  CreateSessionRequest,
  ExchangeFinancialConnectionsPublicTokenRequest,
  FuseApi, GetFinancialConnectionsAccountDetailsRequest, GetFinancialConnectionsAccountsResponse,
} from "fuse-node";
import {AxiosResponse} from "axios";

export { CountryCode };
export { Configuration }

export interface LinkTokenCreateRequest extends LinkTokenCreateRequestPlaid {
  fuse_institution_id: string;
  session_client_secret: string;
  mx?: {
    config: any;
  };
}

export interface AccountsGetRequest {
  access_token: string
}

export interface AccountBalance {
  available: number | null;
  current: number | null;
  limit: number | null;
  iso_currency_code: string | null;
  unofficial_currency_code: string | null;
  last_updated_datetime?: string | null;
}

export enum AccountType {
  Investment = 'investment',
  Credit = 'credit',
  Depository = 'depository',
  Loan = 'loan',
  Brokerage = 'brokerage',
  Other = 'other'
}

export enum AccountSubtype {
  Checking = 'checking',
  Savings = 'savings',
}

export interface AccountBase {
  account_id: string;
  balances: AccountBalance;
  mask: string | null;
  name: string;
  official_name: string | null;
  type: AccountType;
  subtype: AccountSubtype | null;
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
  access_token: string
}

export interface AuthGetResponse {
  accounts: Array<AccountBase>;
  numbers: AuthGetNumbers;
  item: Item;
  request_id: string;
}

export class PlaidApi {
  private fuseApi: FuseApi;

  constructor(configuration: Configuration) {
    let basePath = "";
    if (configuration.basePath === PlaidEnvironments.sandbox || configuration.basePath === PlaidEnvironments.development) {
      basePath = "https://sandbox-api.letsfuse.com/v1/"
    } else if (configuration.basePath === PlaidEnvironments.production){
      basePath = "https://api.letsfuse.com/v1/"
    } else {
      basePath = configuration.basePath
    }
    this.fuseApi = new FuseApi({
      basePath: basePath,
      baseOptions: configuration.baseOptions
    } as any);
  }

  public sessionCreate = async (
    createSessionRequest: CreateSessionRequest,
    options?: any
  ) => {
    return await this.fuseApi.createSession(createSessionRequest, options) as any;
  };

  public linkTokenCreate = async (
    linkTokenCreateRequest: LinkTokenCreateRequest,
    options?: any
  ) => {
    const requestDeepCopy = JSON.parse(JSON.stringify(linkTokenCreateRequest));
    delete requestDeepCopy.session_client_secret;
    delete requestDeepCopy.fuse_institution_id;

    let mxFieldDeepCopy;
    if (requestDeepCopy.mx) {
      if (!requestDeepCopy.mx.config) {
        throw new Error("Mx in request but missing mx config");
      }
      mxFieldDeepCopy = JSON.parse(JSON.stringify(requestDeepCopy.mx));
    }

    delete requestDeepCopy.mx;

    const response = await this.fuseApi.createLinkToken({
      entity: {
        id: linkTokenCreateRequest.user.client_user_id
      },
      session_client_secret: linkTokenCreateRequest.session_client_secret,
      institution_id: linkTokenCreateRequest.fuse_institution_id,
      client_name: linkTokenCreateRequest.client_name,
      plaid: {
        config: requestDeepCopy,
      },
      ...(mxFieldDeepCopy && {
        mx: mxFieldDeepCopy,
      }),
    } as CreateLinkTokenRequest, options);

    if (response.status !== 200) {
      return response as any;
    }

    const fourHoursFromNow = new Date();
    fourHoursFromNow.setTime(Date.now() + 4 * 60 * 60 * 1000); // Plaid expiry is in four hours

    const responseAny = response as any;
    responseAny.data = {
      link_token: response.data.link_token,
      expiration: fourHoursFromNow.toISOString(),
      request_id: response.data.request_id,
    } as LinkTokenCreateResponse;
    return responseAny;
  };

  public itemPublicTokenExchange = async (
    itemPublicTokenExchangeRequest: ItemPublicTokenExchangeRequest,
    options?: any
  ): Promise<AxiosResponse<ItemPublicTokenExchangeResponse>> => {
    const response = await this.fuseApi.exchangeFinancialConnectionsPublicToken({
      public_token: itemPublicTokenExchangeRequest.public_token,
    } as ExchangeFinancialConnectionsPublicTokenRequest, options);

    if (response.status !== 200) {
      return response as any;
    }

    const responseAny = response as any;
    responseAny.data = {
      access_token: response.data.access_token,
      item_id: response.data.financial_connection_id,
      request_id: response.data.request_id,
    } as ItemPublicTokenExchangeResponse;

    return responseAny;
  };

  public accountsGet = async (
      accountsGetRequest: AccountsGetRequest,
      options?: any
  ) => {
    const response = await this.fuseApi.getFinancialConnectionsAccounts(<GetFinancialConnectionsAccountDetailsRequest>{
      access_token: accountsGetRequest.access_token
    }, options);
    return <AccountsGetResponse>{
      item: {
        item_id: response.data.financial_connection.id,
        institution_id: response.data.financial_connection.institution_id
      },
      accounts: response.data.accounts.map(curAccount => {
        return {
          account_id: curAccount.remote_id,
          balances: {
            available: Number(curAccount.balance.available),
            current: curAccount.balance.current,
            iso_currency_code: curAccount.balance.iso_currency_code,
            last_updated_datetime: curAccount.balance.last_updated_date,
            limit: null,
            unofficial_currency_code: null
          } as AccountBalance,
          mask: curAccount.mask,
          name: curAccount.name,
          type: curAccount.type,
          subtype: curAccount.subtype
        } as AccountBase
      }),
      request_id: response.data.request_id
    }
  }

  public authGet = async (
      authGetRequest: AuthGetRequest,
      options?: any
  ) => {
    const response = await this.fuseApi.getFinancialConnectionsAccountDetails(<GetFinancialConnectionsAccountDetailsRequest>{
      access_token: authGetRequest.access_token
    }, options);
    return <AuthGetResponse>{
      item: {
        item_id: response.data.financial_connection.id,
        institution_id: response.data.financial_connection.institution_id
      },
      accounts: response.data.account_details.map(curAccountDetails => {
        return {
          account_id: curAccountDetails.remote_id,
          balances: {
            available: Number(curAccount.balance.available),
            current: curAccount.balance.current,
            iso_currency_code: curAccount.balance.iso_currency_code,
            last_updated_datetime: curAccount.balance.last_updated_date,
            limit: null,
            unofficial_currency_code: null
          } as AccountBalance,
          mask: curAccount.mask,
          name: curAccount.name,
          type: curAccount.type,
          subtype: curAccount.subtype
        } as AccountBase
      }),
      request_id: response.data.request_id,
      numbers: {
        ach: [{

        } as NumbersACH],
        bacs: [{

        } as NumbersBACS]
      }
    }
  }
}
