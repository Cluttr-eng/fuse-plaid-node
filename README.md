# fuse-plaid-node

The Fuse Plaid library provides convenient access to the Fuse REST API as a Plaid abstraction. It includes TypeScript definitions for all request params and response fields. It is intended to be used on the server.

## Documentation
The API documentation can be found [here](https://letsfuse.readme.io/reference/post_v1-session-create).

## Installation
```
npm install fuse-node
```

## Quick start
Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

### Example PlaidService class
```typescript
import {
  AccountsGetResponse,
  AuthGetResponse,
  Configuration,
  CountryCode,
  DepositoryAccountSubtype,
  IdentityGetResponse,
  ItemPublicTokenExchangeRequest,
  LinkTokenCreateRequest,
  PlaidApi,
  Products, SessionCreateRequest,
} from "fuse-plaid-node";
import * as dotenv from "dotenv";
import {Store} from './store';

dotenv.config();

const configuration = new Configuration({
  basePath: process.env.BASE_PATH,
  baseOptions: {
    headers: {
      "Content-Type": "application/json",
      "Plaid-Client-Id": process.env.PLAID_CLIENT_ID,
      "Plaid-Secret": process.env.PLAID_SECRET,
      "Fuse-Api-Key": process.env.FUSE_API_KEY,
      "Fuse-Client-Id": process.env.FUSE_CLIENT_ID
    },
  },
});


export class PlaidService {
  store: Store;
  plaidApi: PlaidApi

  constructor(store: Store) {
    this.store = store;
    this.plaidApi = new PlaidApi(configuration);
  }

  async createSession(userId: string) {
    const sessionCreateRequest: SessionCreateRequest = {
      country_codes: [CountryCode.Us],
      products: [Products.Auth],
      entity: {
        id: userId
      },
      is_web_view: false,
      supported_financial_institution_aggregators: ["plaid"]
    };

    const response = await this.plaidApi.sessionCreate(sessionCreateRequest);
    return response.data;
  }


  async createLinkToken(sessionClientSecret: string, institutionId: string, userId: string) {
    const linkTokenCreateRequest: LinkTokenCreateRequest = {
      session_client_secret: sessionClientSecret,
      institution_id: institutionId,
      country_codes: [CountryCode.Us],
      products: [Products.Auth],
      client_name: "my-client-name",
      user: {
        client_user_id: userId
      },
      language: "en",
      account_filters: {
        depository: {
          account_subtypes: [DepositoryAccountSubtype.All],
        },
      }
    };

    const response = await this.plaidApi.linkTokenCreate(linkTokenCreateRequest);
    return response.data;
  }

  async exchangePublicToken(userId: string, publicToken: string) {
    const itemPublicTokenExchangeRequest: ItemPublicTokenExchangeRequest =
      {
        public_token: publicToken,
      };
    const response = await this.plaidApi.itemPublicTokenExchange(
        itemPublicTokenExchangeRequest
    );
    // Store the access token and item id
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    await this.store.storeUserConnection(userId, accessToken, itemId);
    await this.updateUserInfo(userId, accessToken);
    return {
      accessToken,
      itemId
    };
  }

  async updateUserInfo(userId: string, accessToken: string) {
    await this.updateAccounts(userId, accessToken);
    await this.updateAccountDetails(userId, accessToken);
    await this.updateAccountBalances(userId, accessToken);
    await this.updateAccountOwners(userId, accessToken);
    await this.updateTransactions(userId, accessToken);
  }

  async updateAccounts(userId: string, accessToken: string) {
    console.log("Fetching accounts");
    const response = await this.plaidApi.accountsGet({
      access_token: accessToken,
    });
    const accountsGetResponse = response.data as AccountsGetResponse
    await this.store.storeAccounts(userId, accountsGetResponse.accounts);
  }

  async updateAccountDetails(userId: string, accessToken: string) {
    console.log("Fetching account details");
    const response = await this.plaidApi.authGet({
      access_token: accessToken,
    });
    const authGetResponse = response.data as AuthGetResponse;
    for (const curAch of authGetResponse.numbers.ach) {
      await this.store.updateAccountDetails(userId, curAch.account_id, curAch.account, curAch.routing, curAch.wire_routing)
    }
  }

  async updateAccountBalances(userId: string, accessToken: string) {
    console.log("Fetching balances");
    const response = await this.plaidApi.accountsBalanceGet({
      access_token: accessToken
    });
    const accountResponse = response.data as AccountsGetResponse;
    for (const curAccount of accountResponse.accounts) {
      await this.store.updateAccountBalance(userId, curAccount.account_id, curAccount.balances)
    }
  }

  async updateAccountOwners(userId: string, accessToken: string) {
    console.log("Fetching balances");
    const response = await this.plaidApi.identityGet({
      access_token: accessToken
    });
    const accountIdentityResponse = response.data as IdentityGetResponse;
    for (const curAccount of accountIdentityResponse.accounts) {
      await this.store.updateAccountOwners(userId, curAccount.account_id, curAccount.owners)
    }
  }

  async updateTransactions(userId: string, accessToken: string) {
    console.log("Fetching transactions");
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const response = await this.plaidApi.transactionsGet({
      access_token: accessToken,
      start_date: threeMonthsAgo.toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0]
    });
    await this.store.upsertTransactions(userId, response.data.transactions)
  }
}
```
<br/>
