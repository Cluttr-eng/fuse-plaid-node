import {
  AccountSubtype,
  AccountType,
  Configuration,
  CountryCode,
  ItemPublicTokenExchangeRequest,
  ItemPublicTokenExchangeResponse,
  LinkTokenCreateRequest as LinkTokenCreateRequestPlaid,
  LinkTokenCreateResponse,
  PlaidEnvironments
} from "plaid";
import {
  AccountSubtype as FuseAccountSubtype,
  AccountType as FuseAccountType,
  CreateLinkTokenRequest,
  CreateSessionRequest,
  ExchangeFinancialConnectionsPublicTokenRequest,
  FuseApi,
  GetFinancialConnectionsAccountDetailsRequest
} from "fuse-node";
import {AxiosResponse} from "axios";
import {InvestmentAccountSubtype} from "plaid/api";

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
  access_token: string
}

export interface AuthGetResponse {
  accounts: Array<AccountBase>;
  numbers: AuthGetNumbers;
  item: Item;
  request_id: string;
}

const fuseAccountTypeToPlaidType = (fuseAccountType: FuseAccountType): AccountType => {
  switch (fuseAccountType) {
    case FuseAccountType.Credit:
      return AccountType.Credit
    case FuseAccountType.Depository:
      return AccountType.Depository
    case FuseAccountType.Insurance:
      return AccountType.Other
    case FuseAccountType.Property:
      return AccountType.Other
    case FuseAccountType.Investment:
      return AccountType.Investment
    case FuseAccountType.Loan:
      return AccountType.Loan;
    case FuseAccountType.Other:
      return AccountType.Other;
  }
}

const fuseAccountSubtypeToPlaidSubtype = (fuseAccountSubtype: FuseAccountSubtype): AccountSubtype | InvestmentAccountSubtype => {
  switch (fuseAccountSubtype) {
    case FuseAccountSubtype.Checking:
      return AccountSubtype.Checking;
    case FuseAccountSubtype.Savings:
      return AccountSubtype.Savings;
    case FuseAccountSubtype.Hsa:
      return AccountSubtype.Hsa;
    case FuseAccountSubtype.CertificateOfDeposit:
      return AccountSubtype.Cd;
    case FuseAccountSubtype.MoneyMarket:
      return AccountSubtype.MoneyMarket;
    case FuseAccountSubtype.Paypal:
      return AccountSubtype.Paypal;
    case FuseAccountSubtype.Prepaid:
      return AccountSubtype.Prepaid;
    case FuseAccountSubtype.CashManagement:
      return AccountSubtype.CashManagement;
    case FuseAccountSubtype.Ebt:
      return AccountSubtype.Ebt;
    case FuseAccountSubtype.CreditCard:
      return AccountSubtype.CreditCard;
    case FuseAccountSubtype.Auto:
      return AccountSubtype.Auto;
    case FuseAccountSubtype.Business:
      return AccountSubtype.Business;
    case FuseAccountSubtype.Commercial:
      return AccountSubtype.Commercial;
    case FuseAccountSubtype.Construction:
      return AccountSubtype.Construction;
    case FuseAccountSubtype.Consumer:
      return AccountSubtype.Consumer;
    case FuseAccountSubtype.HomeEquity:
      return AccountSubtype.HomeEquity;
    case FuseAccountSubtype.Loan:
      return AccountSubtype.Loan;
    case FuseAccountSubtype.Mortgage:
      return AccountSubtype.Mortgage;
    case FuseAccountSubtype.Overdraft:
      return AccountSubtype.Overdraft;
    case FuseAccountSubtype.LineOfCredit:
      return AccountSubtype.LineOfCredit;
    case FuseAccountSubtype.Student:
      return AccountSubtype.Student;
    case FuseAccountSubtype._529:
      return AccountSubtype._529;
    case FuseAccountSubtype._401A:
      return AccountSubtype._401a;
    case FuseAccountSubtype._401K:
      return AccountSubtype._401k;
    case FuseAccountSubtype._403B:
      return AccountSubtype._403B;
    case FuseAccountSubtype._457B:
      return AccountSubtype._457b;
    case FuseAccountSubtype.Brokerage:
      return AccountSubtype.Brokerage;
    case FuseAccountSubtype.CashIsa:
      return AccountSubtype.CashIsa;
    case FuseAccountSubtype.CryptoExchange:
      return AccountSubtype.CryptoExchange;
    case FuseAccountSubtype.EducationSavingAccount:
      return AccountSubtype.EducationSavingsAccount;
    case FuseAccountSubtype.FixedAnnuity:
      return AccountSubtype.FixedAnnuity;
    case FuseAccountSubtype.Gic:
      return AccountSubtype.Gic;
    case FuseAccountSubtype.HealthReimbursementArrangement:
      return AccountSubtype.HealthReimbursementArrangement;
    case FuseAccountSubtype.Ira:
      return AccountSubtype.Ira;
    case FuseAccountSubtype.Isa:
      return AccountSubtype.Isa;
    case FuseAccountSubtype.Keogh:
      return AccountSubtype.Keogh;
    case FuseAccountSubtype.Lif:
      return AccountSubtype.Lif;
    case FuseAccountSubtype.LifeInsurance:
      return AccountSubtype.LifeInsurance;
    case FuseAccountSubtype.Lira:
      return AccountSubtype.Lira;
    case FuseAccountSubtype.Lrif:
      return AccountSubtype.Lrif;
    case FuseAccountSubtype.Lrsp:
      return AccountSubtype.Lrsp;
    case FuseAccountSubtype.MutualFund:
      return AccountSubtype.MutualFund;
    case FuseAccountSubtype.NonCustodialWallet:
      return AccountSubtype.NonCustodialWallet;
    case FuseAccountSubtype.NonTaxableBrokerageAccount:
      return AccountSubtype.NonTaxableBrokerageAccount;
    case FuseAccountSubtype.OtherAnnuity:
      return AccountSubtype.OtherAnnuity;
    case FuseAccountSubtype.OtherInsurance:
      return AccountSubtype.OtherInsurance;
    case FuseAccountSubtype.Pension:
      return AccountSubtype.Pension;
    case FuseAccountSubtype.Prif:
      return AccountSubtype.Prif;
    case FuseAccountSubtype.ProfitSharingPlan:
      return AccountSubtype.ProfitSharingPlan;
    case FuseAccountSubtype.Qshr:
      return InvestmentAccountSubtype.Qshr;
    case FuseAccountSubtype.Rdsp:
      return AccountSubtype.Rdsp;
    case FuseAccountSubtype.Resp:
      return AccountSubtype.Resp;
    case FuseAccountSubtype.Retirement:
      return AccountSubtype.Retirement;
    case FuseAccountSubtype.Rlif:
      return AccountSubtype.Rlif;
    case FuseAccountSubtype.RothIra:
      return AccountSubtype.Roth;
    case FuseAccountSubtype.Roth401K:
      return AccountSubtype.Roth401k;
    case FuseAccountSubtype.Rrif:
      return AccountSubtype.Rrif;
    case FuseAccountSubtype.Rrsp:
      return AccountSubtype.Rrsp;
    case FuseAccountSubtype.Sarsep:
      return AccountSubtype.Sarsep;
    case FuseAccountSubtype.SepIra:
      return AccountSubtype.SepIra;
    case FuseAccountSubtype.SimpleIra:
      return AccountSubtype.SimpleIra;
    case FuseAccountSubtype.Sipp:
      return AccountSubtype.Sipp;
    case FuseAccountSubtype.StockPlan:
      return AccountSubtype.StockPlan;
    case FuseAccountSubtype.Tfsa:
      return AccountSubtype.Tfsa;
    case FuseAccountSubtype.Trust:
      return AccountSubtype.Trust;
    case FuseAccountSubtype.Ugma:
      return AccountSubtype.Ugma;
    case FuseAccountSubtype.Utma:
      return AccountSubtype.Utma;
    case FuseAccountSubtype.VariableAnnuity:
      return AccountSubtype.VariableAnnuity;
    default:
      return AccountSubtype.Other
  }
}

export interface AccountsBalanceGetRequest {
  access_token: string
}

export interface AccountsBalanceGetResponse {
  access_token: string
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
          type: fuseAccountTypeToPlaidType(curAccount.type),
          subtype: fuseAccountSubtypeToPlaidSubtype(curAccount.subtype),
          fingerprint: curAccount.fingerprint
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
    const accountsResponse = await this.accountsGet({
      access_token: authGetRequest.access_token
    } as AccountsGetRequest);

    return <AuthGetResponse>{
      item: accountsResponse.item,
      accounts: accountsResponse.accounts,
      numbers: {
        ach: [{
          account_id: response.data.account_details[0].remote_id,
          account: response.data.account_details[0].ach.account,
          routing: response.data.account_details[0].ach.routing,
          wire_routing:  response.data.account_details[0].ach.wire_routing
        } as NumbersACH],
        bacs: [{
          account_id: response.data.account_details[0].remote_id,
          account: response.data.account_details[0].ach.account,
          sort_code: response.data.account_details[0].ach.bacs_routing,
        } as NumbersBACS],
      },
      request_id: response.data.request_id,

    }
  }

  public accountsBalanceGet = async (
      accountsBalanceGetRequest: AccountsBalanceGetRequest,
      options?: any
  ) => {
    const response = await this.fuseApi.getFinancialConnectionsBalances(<GetFinancialConnectionsAccountDetailsRequest>{
      access_token: accountsBalanceGetRequest.access_token
    }, options);
    const accountsResponse = await this.accountsGet({
      access_token: accountsBalanceGetRequest.access_token
    } as AccountsGetRequest);


    return <AccountsGetResponse>{
      item: accountsResponse.item,
      accounts: accountsResponse.accounts.map(curAccount => {
        const respectiveBalance = response.data.balances.find((curBalance) => curAccount.account_id === curBalance.remote_account_id);
        return {
          ...curAccount,
          balances: {
            available: Number(respectiveBalance.available),
            current: respectiveBalance.current,
            iso_currency_code: respectiveBalance.iso_currency_code,
            limit: null,
            unofficial_currency_code: null
          } as AccountBalance
        }
      }),
      request_id: response.data.request_id
    }
  }
}
