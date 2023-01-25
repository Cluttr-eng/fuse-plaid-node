import {
  CountryCode,
  ItemPublicTokenExchangeRequest,
  ItemPublicTokenExchangeResponse,
  LinkTokenCreateRequest as LinkTokenCreateRequestPlaid,
  LinkTokenCreateResponse, PlaidEnvironments,
  SyncUpdatesAvailableWebhook as SyncUpdatesAvailableWebhookPlaid,

} from "plaid";
import { Configuration } from "./Configuration";
import {
  CreateLinkTokenRequest,
  CreateSessionRequest,
  CreateSessionResponse, Environment, ExchangeFinancialConnectionsPublicTokenRequest,
  FuseApi,
  UnifiedWebhook,
} from "fuse-node";
import { AxiosResponse } from "axios";

export { CountryCode };

export interface SyncUpdatesAvailableWebhook
  extends SyncUpdatesAvailableWebhookPlaid {
  unified_webhook: UnifiedWebhook;
}
export interface LinkTokenCreateRequest extends LinkTokenCreateRequestPlaid {
  fuse_institution_id: string;
  session_client_secret: string;
  mx?: {
    config: any;
  };
}

export class PlaidApi {
  private configuration: Configuration;
  private fuseApi: FuseApi;

  constructor(configuration: Configuration) {
    this.fuseApi = new FuseApi({
      basePath: configuration.config.basePath === PlaidEnvironments.sandbox
          ? Environment.SANDBOX
          : Environment.SANDBOX,
      fuse: {
        apiKey: this.getHeader(
            configuration.config.baseOptions["headers"],
            "fuse-api-key"
        ),
        clientId: this.getHeader(
            configuration.config.baseOptions["headers"],
            "fuse-client-id"
        )
      },
      plaid: {
        clientId: this.getHeader(
            configuration.config.baseOptions["headers"],
            "plaid-client-id"
        ),
        secret: this.getHeader(
            configuration.config.baseOptions["headers"],
            "plaid-secret"
        )
      },
      teller: {
        applicationId: this.getHeader(
            configuration.config.baseOptions["headers"],
            "teller-application-id"
        ),
        certificate: this.getHeader(
            configuration.config.baseOptions["headers"],
            "teller-certificate"
        ),
        privateKey: this.getHeader(
            configuration.config.baseOptions["headers"],
            "teller-private-key"
        ),
        tokenSigningKey: this.getHeader(
            configuration.config.baseOptions["headers"],
            "teller-token-signing-key"
        ),
        signingSecret: this.getHeader(
            configuration.config.baseOptions["headers"],
            "teller-signing-secret"
        )
      },
      mx: {
        apiKey: this.getHeader(
            configuration.config.baseOptions["headers"],
            "mx-api-key"
        ),
        clientId: this.getHeader(
            configuration.config.baseOptions["headers"],
            "mx-client-id"
        )
      }
    });
    this.configuration = configuration;
  }

  getHeader = (headers: any, key: string): string => {
    for (let header of Object.keys(headers)) {
      if (header.toLowerCase() === key) {
        return headers[header]!;
      }
    }
    return undefined;
  };

  public sessionCreate = async (
    createSessionRequest: CreateSessionRequest
  ): Promise<AxiosResponse<CreateSessionResponse>> => {
    return this.fuseApi.createSession(createSessionRequest);
  };

  public linkTokenCreate = async (
    linkTokenCreateRequest: LinkTokenCreateRequest,
    options?: any
  ): Promise<AxiosResponse<LinkTokenCreateResponse>> => {
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
      user_id: linkTokenCreateRequest.user.client_user_id,
      session_client_secret: linkTokenCreateRequest.session_client_secret,
      ...(linkTokenCreateRequest.webhook && {
        webhook_url: linkTokenCreateRequest.webhook,
      }),
      institution_id: linkTokenCreateRequest.fuse_institution_id,
      plaid: {
        config: requestDeepCopy,
      },
      ...(mxFieldDeepCopy && {
        mx: mxFieldDeepCopy,
      }),
    } as CreateLinkTokenRequest);

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
    } as ExchangeFinancialConnectionsPublicTokenRequest);

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

  public verify = async (
    body: SyncUpdatesAvailableWebhook,
    headers: any
  ): Promise<boolean> => {
    return await this.fuseApi.verify(body.unified_webhook, headers);
  };
}
