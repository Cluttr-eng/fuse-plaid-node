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
  AccountSubType as FuseAccountSubType,
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

const fuseAccountSubtypeToPlaidSubtype = (fuseAccountSubtype: FuseAccountSubType): AccountSubtype | InvestmentAccountSubtype => {
  switch (fuseAccountSubtype) {
    case FuseAccountSubType.Checking:
      return AccountSubtype.Checking;
    case FuseAccountSubType.Savings:
      return AccountSubtype.Savings;
    case FuseAccountSubType.Hsa:
      return AccountSubtype.Hsa;
    case FuseAccountSubType.CertificateOfDeposit:
      return AccountSubtype.Cd;
    case FuseAccountSubType.MoneyMarket:
      return AccountSubtype.MoneyMarket;
    case FuseAccountSubType.Paypal:
      return AccountSubtype.Paypal;
    case FuseAccountSubType.Prepaid:
      return AccountSubtype.Prepaid;
    case FuseAccountSubType.CashManagement:
      return AccountSubtype.CashManagement;
    case FuseAccountSubType.Ebt:
      return AccountSubtype.Ebt;
    case FuseAccountSubType.CreditCard:
      return AccountSubtype.CreditCard;
    case FuseAccountSubType.Auto:
      return AccountSubtype.Auto;
    case FuseAccountSubType.Business:
      return AccountSubtype.Business;
    case FuseAccountSubType.Commercial:
      return AccountSubtype.Commercial;
    case FuseAccountSubType.Construction:
      return AccountSubtype.Construction;
    case FuseAccountSubType.Consumer:
      return AccountSubtype.Consumer;
    case FuseAccountSubType.HomeEquity:
      return AccountSubtype.HomeEquity;
    case FuseAccountSubType.Loan:
      return AccountSubtype.Loan;
    case FuseAccountSubType.Mortgage:
      return AccountSubtype.Mortgage;
    case FuseAccountSubType.Overdraft:
      return AccountSubtype.Overdraft;
    case FuseAccountSubType.LineOfCredit:
      return AccountSubtype.LineOfCredit;
    case FuseAccountSubType.Student:
      return AccountSubtype.Student;
    case FuseAccountSubType._529:
      return AccountSubtype._529;
    case FuseAccountSubType._401A:
      return AccountSubtype._401a;
    case FuseAccountSubType._401K:
      return AccountSubtype._401k;
    case FuseAccountSubType._403B:
      return AccountSubtype._403B;
    case FuseAccountSubType._457B:
      return AccountSubtype._457b;
    case FuseAccountSubType.Brokerage:
      return AccountSubtype.Brokerage;
    case FuseAccountSubType.CashIsa:
      return AccountSubtype.CashIsa;
    case FuseAccountSubType.CryptoExchange:
      return AccountSubtype.CryptoExchange;
    case FuseAccountSubType.EducationSavingAccount:
      return AccountSubtype.EducationSavingsAccount;
    case FuseAccountSubType.FixedAnnuity:
      return AccountSubtype.FixedAnnuity;
    case FuseAccountSubType.Gic:
      return AccountSubtype.Gic;
    case FuseAccountSubType.HealthReimbursementArrangement:
      return AccountSubtype.HealthReimbursementArrangement;
    case FuseAccountSubType.Ira:
      return AccountSubtype.Ira;
    case FuseAccountSubType.Isa:
      return AccountSubtype.Isa;
    case FuseAccountSubType.Keogh:
      return AccountSubtype.Keogh;
    case FuseAccountSubType.Lif:
      return AccountSubtype.Lif;
    case FuseAccountSubType.LifeInsurance:
      return AccountSubtype.LifeInsurance;
    case FuseAccountSubType.Lira:
      return AccountSubtype.Lira;
    case FuseAccountSubType.Lrif:
      return AccountSubtype.Lrif;
    case FuseAccountSubType.Lrsp:
      return AccountSubtype.Lrsp;
    case FuseAccountSubType.MutualFund:
      return AccountSubtype.MutualFund;
    case FuseAccountSubType.NonCustodialWallet:
      return AccountSubtype.NonCustodialWallet;
    case FuseAccountSubType.NonTaxableBrokerageAccount:
      return AccountSubtype.NonTaxableBrokerageAccount;
    case FuseAccountSubType.OtherAnnuity:
      return AccountSubtype.OtherAnnuity;
    case FuseAccountSubType.OtherInsurance:
      return AccountSubtype.OtherInsurance;
    case FuseAccountSubType.Pension:
      return AccountSubtype.Pension;
    case FuseAccountSubType.Prif:
      return AccountSubtype.Prif;
    case FuseAccountSubType.ProfitSharingPlan:
      return AccountSubtype.ProfitSharingPlan;
    case FuseAccountSubType.Qshr:
      return InvestmentAccountSubtype.Qshr;
    case FuseAccountSubType.Rdsp:
      return AccountSubtype.Rdsp;
    case FuseAccountSubType.Resp:
      return AccountSubtype.Resp;
    case FuseAccountSubType.Retirement:
      return AccountSubtype.Retirement;
    case FuseAccountSubType.Rlif:
      return AccountSubtype.Rlif;
    case FuseAccountSubType.RothIra:
      return AccountSubtype.Roth;
    case FuseAccountSubType.Roth401K:
      return AccountSubtype.Roth401k;
    case FuseAccountSubType.Rrif:
      return AccountSubtype.Rrif;
    case FuseAccountSubType.Rrsp:
      return AccountSubtype.Rrsp;
    case FuseAccountSubType.Sarsep:
      return AccountSubtype.Sarsep;
    case FuseAccountSubType.SepIra:
      return AccountSubtype.SepIra;
    case FuseAccountSubType.SimpleIra:
      return AccountSubtype.SimpleIra;
    case FuseAccountSubType.Sipp:
      return AccountSubtype.Sipp;
    case FuseAccountSubType.StockPlan:
      return AccountSubtype.StockPlan;
    case FuseAccountSubType.Tfsa:
      return AccountSubtype.Tfsa;
    case FuseAccountSubType.Trust:
      return AccountSubtype.Trust;
    case FuseAccountSubType.Ugma:
      return AccountSubtype.Ugma;
    case FuseAccountSubType.Utma:
      return AccountSubtype.Utma;
    case FuseAccountSubType.VariableAnnuity:
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
      item: {
        item_id: response.data.financial_connection.id,
        institution_id: response.data.financial_connection.institution_id
      },
      request_id: response.data.request_id,
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
      accounts: accountsResponse.accounts
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
        const respectiveBalance = response.data.balances.find((curBalance) => curAccount.account_id === curBalance);
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
