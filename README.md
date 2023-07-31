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
Have a look at the comments in the createLinkToken, getAccountBalances and getTransactions functions for important information.
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
  Products, SessionCreateRequest, Transaction,
  TransactionsGetResponse
} from "fuse-plaid-node";
import { backOff } from "exponential-backoff";
import * as dotenv from "dotenv";
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
  plaidApi: PlaidApi

  constructor() {
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


  async createLinkToken(userId: string, sessionClientSecret?: string, institutionId?: string, ) {
    const linkTokenCreateRequest: LinkTokenCreateRequest = {
      // When no client secret and institution id is passed in a plaid (not fuse) link token is returneded
      // This allows deploying the backend changes first before the frontend changes
      ...(sessionClientSecret && {
        session_client_secret: sessionClientSecret,
      }),
      ...(institutionId && {
        institution_id: institutionId,
      }),
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

    return {
      accessToken,
      itemId
    };
  }

  async getAccounts(userId: string, accessToken: string) {
    console.log("Fetching accounts");
    const response = await this.plaidApi.accountsGet({
      access_token: accessToken,
    });
    return response.data as AccountsGetResponse;
  }

  async getAccountDetails(userId: string, accessToken: string) {
    console.log("Fetching account details");
    const response = await this.plaidApi.authGet({
      access_token: accessToken,
    });
    return response.data as AuthGetResponse;
  }

  async getAccountBalances(userId: string, accessToken: string) {
    console.log("Fetching balances");
    //BALANCE CALLS MAY TIME OUT SO ADD RETRY MECHANISM
    const response: any = await this.withBackoff(() => this.plaidApi.accountsBalanceGet({
      access_token: accessToken
    }), 3);
    //IMPORTANT: Do not use any value other than the balances object. 
    //If you need account level fields such as mask or name, use the accountsGet endpoint
    return response.data as AccountsGetResponse;
  }

  async getAccountOwners(userId: string, accessToken: string) {
    console.log("Fetching balances");
    const response = await this.plaidApi.identityGet({
      access_token: accessToken
    });
    return response.data as IdentityGetResponse;
  }

  async getTransactions(userId: string, accessToken: string) {
    console.log("Fetching transactions");
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    let allTransactions: Transaction[] = [];
    const count = 100; //MAX LIMIT OF 100
    let page = 1; //OFFSET FIELD REPLACED WITH PAGE FIELD
    while (true) {
      //INITIAL CALL TO TRANSACTIONS MAY TIME OUT SO ADD RETRY MECHANISM
      let response: any = await this.withBackoff(() => this.plaidApi.transactionsGet({
        access_token: accessToken,
        start_date: threeMonthsAgo.toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        options: {
          count: count,
          page: page
        }
      }), 3);
      const transactionsResponse = response.data as TransactionsGetResponse;
      allTransactions = allTransactions.concat(transactionsResponse.transactions);
      if (transactionsResponse.transactions.length === 0) {
        break;
      }
      page++; //INCREMENT PAGE BY 1 TO GET NEXT PAGE
    }
    return allTransactions;
  }
  
  async handleWebhookEvents(headers: IncomingHttpHeaders, body: any) {
    if (!this.verifyPlaidWebhook(headers, body)) {
      if (this.verifyFuseWebhook(headers, body)) {
        //SEE https://docs.letsfuse.com/docs/webhooks-overview for Fuse webhooks overview
      }
      return;
    }

    //existing plaid webhook handling
  }

  verifyPlaidWebhook(headers: IncomingHttpHeaders, body: any): boolean {
    //plaid verification logic
    return true;
  }

  verifyFuseWebhook(headers: IncomingHttpHeaders, body: any): boolean {
    //plaid verification logic
    return true;
  }

  async withBackoff(request: any, attempts = 1) {
    return backOff(() => request(), {
      delayFirstAttempt: false,
      numOfAttempts: attempts,
      maxDelay: 5000,
    });
  }
}
```
<br/>
