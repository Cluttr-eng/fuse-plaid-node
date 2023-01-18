import {
  CountryCode,
  ItemPublicTokenExchangeRequest,
  ItemPublicTokenExchangeResponse,
  LinkTokenCreateRequest as LinkTokenCreateRequestPlaid,
  LinkTokenCreateResponse,
  SyncUpdatesAvailableWebhook as SyncUpdatesAvailableWebhookPlaid,
} from "plaid";
import { Configuration } from "./Configuration";
import {
  BasePath,
  Configuration as FuseConfiguration,
  CreateSessionLinkTokenRequest,
  CreateSessionRequest,
  CreateSessionResponse,
  ExchangeSessionPublicTokenRequest,
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
    this.fuseApi = new FuseApi(
      new FuseConfiguration(
        configuration.config.basePath === "sandbox"
          ? BasePath.SANDBOX
          : BasePath.SANDBOX,
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "x-api-key"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "x-client-id"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "plaid-client-id"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "plaid-secret"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "teller-application-id"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "teller-certificate"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "teller-token-signing-key"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "mx-client-id"
        ),
        this.getHeader(
          configuration.config.baseOptions["headers"],
          "mx-api-key"
        )
      )
    );
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

    const response = await this.fuseApi.createSessionLinkToken({
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
    } as CreateSessionLinkTokenRequest);

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
    const response = await this.fuseApi.exchangeSessionPublicToken({
      public_token: itemPublicTokenExchangeRequest.public_token,
    } as ExchangeSessionPublicTokenRequest);

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
