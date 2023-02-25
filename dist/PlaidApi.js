"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaidApi = exports.Configuration = exports.CountryCode = void 0;
const plaid_1 = require("plaid");
Object.defineProperty(exports, "Configuration", { enumerable: true, get: function () { return plaid_1.Configuration; } });
Object.defineProperty(exports, "CountryCode", { enumerable: true, get: function () { return plaid_1.CountryCode; } });
const fuse_node_1 = require("fuse-node");
const api_1 = require("plaid/api");
const fuseAccountTypeToPlaidType = (fuseAccountType) => {
    switch (fuseAccountType) {
        case fuse_node_1.AccountType.Credit:
            return plaid_1.AccountType.Credit;
        case fuse_node_1.AccountType.Depository:
            return plaid_1.AccountType.Depository;
        case fuse_node_1.AccountType.Insurance:
            return plaid_1.AccountType.Other;
        case fuse_node_1.AccountType.Property:
            return plaid_1.AccountType.Other;
        case fuse_node_1.AccountType.Investment:
            return plaid_1.AccountType.Investment;
        case fuse_node_1.AccountType.Loan:
            return plaid_1.AccountType.Loan;
        case fuse_node_1.AccountType.Other:
            return plaid_1.AccountType.Other;
    }
};
const fuseAccountSubtypeToPlaidSubtype = (fuseAccountSubtype) => {
    switch (fuseAccountSubtype) {
        case fuse_node_1.AccountSubtype.Checking:
            return plaid_1.AccountSubtype.Checking;
        case fuse_node_1.AccountSubtype.Savings:
            return plaid_1.AccountSubtype.Savings;
        case fuse_node_1.AccountSubtype.Hsa:
            return plaid_1.AccountSubtype.Hsa;
        case fuse_node_1.AccountSubtype.CertificateOfDeposit:
            return plaid_1.AccountSubtype.Cd;
        case fuse_node_1.AccountSubtype.MoneyMarket:
            return plaid_1.AccountSubtype.MoneyMarket;
        case fuse_node_1.AccountSubtype.Paypal:
            return plaid_1.AccountSubtype.Paypal;
        case fuse_node_1.AccountSubtype.Prepaid:
            return plaid_1.AccountSubtype.Prepaid;
        case fuse_node_1.AccountSubtype.CashManagement:
            return plaid_1.AccountSubtype.CashManagement;
        case fuse_node_1.AccountSubtype.Ebt:
            return plaid_1.AccountSubtype.Ebt;
        case fuse_node_1.AccountSubtype.CreditCard:
            return plaid_1.AccountSubtype.CreditCard;
        case fuse_node_1.AccountSubtype.Auto:
            return plaid_1.AccountSubtype.Auto;
        case fuse_node_1.AccountSubtype.Business:
            return plaid_1.AccountSubtype.Business;
        case fuse_node_1.AccountSubtype.Commercial:
            return plaid_1.AccountSubtype.Commercial;
        case fuse_node_1.AccountSubtype.Construction:
            return plaid_1.AccountSubtype.Construction;
        case fuse_node_1.AccountSubtype.Consumer:
            return plaid_1.AccountSubtype.Consumer;
        case fuse_node_1.AccountSubtype.HomeEquity:
            return plaid_1.AccountSubtype.HomeEquity;
        case fuse_node_1.AccountSubtype.Loan:
            return plaid_1.AccountSubtype.Loan;
        case fuse_node_1.AccountSubtype.Mortgage:
            return plaid_1.AccountSubtype.Mortgage;
        case fuse_node_1.AccountSubtype.Overdraft:
            return plaid_1.AccountSubtype.Overdraft;
        case fuse_node_1.AccountSubtype.LineOfCredit:
            return plaid_1.AccountSubtype.LineOfCredit;
        case fuse_node_1.AccountSubtype.Student:
            return plaid_1.AccountSubtype.Student;
        case fuse_node_1.AccountSubtype._529:
            return plaid_1.AccountSubtype._529;
        case fuse_node_1.AccountSubtype._401A:
            return plaid_1.AccountSubtype._401a;
        case fuse_node_1.AccountSubtype._401K:
            return plaid_1.AccountSubtype._401k;
        case fuse_node_1.AccountSubtype._403B:
            return plaid_1.AccountSubtype._403B;
        case fuse_node_1.AccountSubtype._457B:
            return plaid_1.AccountSubtype._457b;
        case fuse_node_1.AccountSubtype.Brokerage:
            return plaid_1.AccountSubtype.Brokerage;
        case fuse_node_1.AccountSubtype.CashIsa:
            return plaid_1.AccountSubtype.CashIsa;
        case fuse_node_1.AccountSubtype.CryptoExchange:
            return plaid_1.AccountSubtype.CryptoExchange;
        case fuse_node_1.AccountSubtype.EducationSavingAccount:
            return plaid_1.AccountSubtype.EducationSavingsAccount;
        case fuse_node_1.AccountSubtype.FixedAnnuity:
            return plaid_1.AccountSubtype.FixedAnnuity;
        case fuse_node_1.AccountSubtype.Gic:
            return plaid_1.AccountSubtype.Gic;
        case fuse_node_1.AccountSubtype.HealthReimbursementArrangement:
            return plaid_1.AccountSubtype.HealthReimbursementArrangement;
        case fuse_node_1.AccountSubtype.Ira:
            return plaid_1.AccountSubtype.Ira;
        case fuse_node_1.AccountSubtype.Isa:
            return plaid_1.AccountSubtype.Isa;
        case fuse_node_1.AccountSubtype.Keogh:
            return plaid_1.AccountSubtype.Keogh;
        case fuse_node_1.AccountSubtype.Lif:
            return plaid_1.AccountSubtype.Lif;
        case fuse_node_1.AccountSubtype.LifeInsurance:
            return plaid_1.AccountSubtype.LifeInsurance;
        case fuse_node_1.AccountSubtype.Lira:
            return plaid_1.AccountSubtype.Lira;
        case fuse_node_1.AccountSubtype.Lrif:
            return plaid_1.AccountSubtype.Lrif;
        case fuse_node_1.AccountSubtype.Lrsp:
            return plaid_1.AccountSubtype.Lrsp;
        case fuse_node_1.AccountSubtype.MutualFund:
            return plaid_1.AccountSubtype.MutualFund;
        case fuse_node_1.AccountSubtype.NonCustodialWallet:
            return plaid_1.AccountSubtype.NonCustodialWallet;
        case fuse_node_1.AccountSubtype.NonTaxableBrokerageAccount:
            return plaid_1.AccountSubtype.NonTaxableBrokerageAccount;
        case fuse_node_1.AccountSubtype.OtherAnnuity:
            return plaid_1.AccountSubtype.OtherAnnuity;
        case fuse_node_1.AccountSubtype.OtherInsurance:
            return plaid_1.AccountSubtype.OtherInsurance;
        case fuse_node_1.AccountSubtype.Pension:
            return plaid_1.AccountSubtype.Pension;
        case fuse_node_1.AccountSubtype.Prif:
            return plaid_1.AccountSubtype.Prif;
        case fuse_node_1.AccountSubtype.ProfitSharingPlan:
            return plaid_1.AccountSubtype.ProfitSharingPlan;
        case fuse_node_1.AccountSubtype.Qshr:
            return api_1.InvestmentAccountSubtype.Qshr;
        case fuse_node_1.AccountSubtype.Rdsp:
            return plaid_1.AccountSubtype.Rdsp;
        case fuse_node_1.AccountSubtype.Resp:
            return plaid_1.AccountSubtype.Resp;
        case fuse_node_1.AccountSubtype.Retirement:
            return plaid_1.AccountSubtype.Retirement;
        case fuse_node_1.AccountSubtype.Rlif:
            return plaid_1.AccountSubtype.Rlif;
        case fuse_node_1.AccountSubtype.RothIra:
            return plaid_1.AccountSubtype.Roth;
        case fuse_node_1.AccountSubtype.Roth401K:
            return plaid_1.AccountSubtype.Roth401k;
        case fuse_node_1.AccountSubtype.Rrif:
            return plaid_1.AccountSubtype.Rrif;
        case fuse_node_1.AccountSubtype.Rrsp:
            return plaid_1.AccountSubtype.Rrsp;
        case fuse_node_1.AccountSubtype.Sarsep:
            return plaid_1.AccountSubtype.Sarsep;
        case fuse_node_1.AccountSubtype.SepIra:
            return plaid_1.AccountSubtype.SepIra;
        case fuse_node_1.AccountSubtype.SimpleIra:
            return plaid_1.AccountSubtype.SimpleIra;
        case fuse_node_1.AccountSubtype.Sipp:
            return plaid_1.AccountSubtype.Sipp;
        case fuse_node_1.AccountSubtype.StockPlan:
            return plaid_1.AccountSubtype.StockPlan;
        case fuse_node_1.AccountSubtype.Tfsa:
            return plaid_1.AccountSubtype.Tfsa;
        case fuse_node_1.AccountSubtype.Trust:
            return plaid_1.AccountSubtype.Trust;
        case fuse_node_1.AccountSubtype.Ugma:
            return plaid_1.AccountSubtype.Ugma;
        case fuse_node_1.AccountSubtype.Utma:
            return plaid_1.AccountSubtype.Utma;
        case fuse_node_1.AccountSubtype.VariableAnnuity:
            return plaid_1.AccountSubtype.VariableAnnuity;
        default:
            return plaid_1.AccountSubtype.Other;
    }
};
class PlaidApi {
    constructor(configuration) {
        this.sessionCreate = async (createSessionRequest, options) => {
            return await this.fuseApi.createSession(createSessionRequest, options);
        };
        this.linkTokenCreate = async (linkTokenCreateRequest, options) => {
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
            }, options);
            if (response.status !== 200) {
                return response;
            }
            const fourHoursFromNow = new Date();
            fourHoursFromNow.setTime(Date.now() + 4 * 60 * 60 * 1000); // Plaid expiry is in four hours
            const responseAny = response;
            responseAny.data = {
                link_token: response.data.link_token,
                expiration: fourHoursFromNow.toISOString(),
                request_id: response.data.request_id,
            };
            return responseAny;
        };
        this.itemPublicTokenExchange = async (itemPublicTokenExchangeRequest, options) => {
            const response = await this.fuseApi.exchangeFinancialConnectionsPublicToken({
                public_token: itemPublicTokenExchangeRequest.public_token,
            }, options);
            if (response.status !== 200) {
                return response;
            }
            const responseAny = response;
            responseAny.data = {
                access_token: response.data.access_token,
                item_id: response.data.financial_connection_id,
                request_id: response.data.request_id,
            };
            return responseAny;
        };
        this.accountsGet = async (accountsGetRequest, options) => {
            const response = await this.fuseApi.getFinancialConnectionsAccounts({
                access_token: accountsGetRequest.access_token
            }, options);
            return {
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
                        },
                        mask: curAccount.mask,
                        name: curAccount.name,
                        type: fuseAccountTypeToPlaidType(curAccount.type),
                        subtype: fuseAccountSubtypeToPlaidSubtype(curAccount.subtype),
                        fingerprint: curAccount.fingerprint
                    };
                }),
                request_id: response.data.request_id
            };
        };
        this.authGet = async (authGetRequest, options) => {
            const response = await this.fuseApi.getFinancialConnectionsAccountDetails({
                access_token: authGetRequest.access_token
            }, options);
            const accountsResponse = await this.accountsGet({
                access_token: authGetRequest.access_token
            });
            return {
                item: accountsResponse.item,
                accounts: accountsResponse.accounts,
                numbers: {
                    ach: [{
                            account_id: response.data.account_details[0].remote_id,
                            account: response.data.account_details[0].ach.account,
                            routing: response.data.account_details[0].ach.routing,
                            wire_routing: response.data.account_details[0].ach.wire_routing
                        }],
                    bacs: [{
                            account_id: response.data.account_details[0].remote_id,
                            account: response.data.account_details[0].ach.account,
                            sort_code: response.data.account_details[0].ach.bacs_routing,
                        }],
                },
                request_id: response.data.request_id,
            };
        };
        this.accountsBalanceGet = async (accountsBalanceGetRequest, options) => {
            const response = await this.fuseApi.getFinancialConnectionsBalances({
                access_token: accountsBalanceGetRequest.access_token
            }, options);
            const accountsResponse = await this.accountsGet({
                access_token: accountsBalanceGetRequest.access_token
            });
            return {
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
                        }
                    };
                }),
                request_id: response.data.request_id
            };
        };
        let basePath = "";
        if (configuration.basePath === plaid_1.PlaidEnvironments.sandbox || configuration.basePath === plaid_1.PlaidEnvironments.development) {
            basePath = "https://sandbox-api.letsfuse.com/v1/";
        }
        else if (configuration.basePath === plaid_1.PlaidEnvironments.production) {
            basePath = "https://api.letsfuse.com/v1/";
        }
        else {
            basePath = configuration.basePath;
        }
        this.fuseApi = new fuse_node_1.FuseApi({
            basePath: basePath,
            baseOptions: configuration.baseOptions
        });
    }
}
exports.PlaidApi = PlaidApi;
//# sourceMappingURL=PlaidApi.js.map