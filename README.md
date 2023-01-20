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

### Initialising the Fuse Plaid Api
```typescript
import { Configuration, CountryCode, PlaidApi } from "fuse-plaid-node";
const plaidApi = new PlaidApi(new Configuration({
    basePath: "sandbox",
    baseOptions: {
        headers: {
            "Plaid-Client-Id": "my-plaid-client-id",
            "Plaid-Secret": "my-plaid-secret",
            "Fuse-Api-Key": "my-fuse-api-key",
            "Fuse-Client-Id": "my-fuse-client-id",
            "Teller-Application-Id": "my-teller-application-id",
            "Teller-Certificate": "my-teller-certificate",
            "Teller-Token-Signing-Key": "my-teller-token-signing-key",
            "Teller-Private-Key": "my-teller-private-key",
            "Mx-Client-Id": "my-mx-client-id",
            "Mx-Api-Key": "my-mx-api-key"
        },
    },
}));
```
<br/>

### Creating a session
```typescript
const response = await plaidClient.sessionCreate({
    supported_financial_institution_aggregators: ["PLAID", "TELLER", "MX"],
    plaid: {
        products: ["transactions"],
    },
    mx: {
        supports_transaction_history: true,
        supports_account_identification: false,
        supports_account_statement: true,
        supports_account_verification: false
    }
} as CreateSessionRequest);

const session = response.data as CreateSessionResponse;

console.log(session.client_secret)
```
<br/>

### Creating a link token
```typescript
const response = await plaidClient.linkTokenCreate({
    fuse_institution_id: "fuse-institution-id-from-frontend",
    session_client_secret: "session-client-secret",
    client_name: "my-company-name",
    user: {
        client_user_id: "my-unique-user-id",
    },
    country_codes: [CountryCode.Us],
    language: "en",
    webhook: "https://www.my-domain.com/webhook",
    mx: {
        config: {
            color_scheme: "light"
        }
    }
});
console.log(response.data.link_token);
```

<br/>

### Exchanging a public token
```typescript
const response = await plaidClient.itemPublicTokenExchange({
    public_token: "public-token-from-frontend",
});
console.log(response.data.access_token);
console.log(response.data.item_id);
```
<br/>
