import {
  Configuration,
  CountryCode,
  ItemPublicTokenExchangeRequest,
  ItemPublicTokenExchangeResponse,
  LinkTokenCreateRequest as LinkTokenCreateRequestPlaid,
  LinkTokenCreateResponse,
  PlaidEnvironments,
} from "plaid";
import {
  CreateLinkTokenRequest,
  CreateSessionRequest,
  ExchangeFinancialConnectionsPublicTokenRequest,
  FuseApi,
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

export class PlaidApi {
  private fuseApi: FuseApi;

  constructor(configuration: Configuration) {
    let basePath = "";
    if (configuration.basePath === PlaidEnvironments.sandbox) {
      basePath = "https://sandbox-api.letsfuse.com/v1/"
    } else {
      basePath = configuration.basePath
    }
    this.fuseApi = new FuseApi({
      basePath: basePath,
      baseOptions: configuration.baseOptions
    } as any);
  }

  public sessionCreate = async (
    createSessionRequest: CreateSessionRequest
  ): Promise<AxiosResponse> => {
    // @ts-ignore
    return this.fuseApi.createSession(createSessionRequest);
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
}
