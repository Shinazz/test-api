import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
  response: any;
  error: any;
};
export interface ApplyFilter {
  category?: string;
  mode?: string;
}

export interface ProximityTarget {
  latitude?: number | null;
  longitude?: number | null;
  country_code?: string;
  postal_code?: string;
}
export interface OffersSearchApiRequest {
  apply_filter: ApplyFilter;
  page_offset?: number;
  page_size?: number;
  text_query?: string;
  proximity_target: ProximityTarget;
}

export interface OffersSearchApiResponse {
  offers: Offers[];
  total: number;
}

export interface Offers {
  activation_required: boolean;
  category: string;
  currency_code: string;
  display_currency: string;
  effective_date: string;
  expiration_date: string;
  external_id: string;
  headline: string;
  id: string;
  is_activated: boolean;
  merchant_logo_url: string;
  merchant_name: string;
  minimum_spend: number;
  offer_mode: string;
  offer_preference: string;
  reward_rate: number;
  reward_type: string;
  type: string;
}
export interface OffersDetailsResponse {
  activation_required: boolean;
  category: string;
  currency_code: string;
  description: string;
  display_currency: string;
  effective_date: string;
  expiration_date: string;
  external_id: string;
  headline: string;
  id: string;
  is_activated: boolean;
  merchant_logo_url: string;
  merchant_name: string;
  minimum_spend: number;
  offer_mode: string;
  offer_preference: string;
  reward_rate: number;
  reward_type: string;
  terms_and_conditions: string;
  type: string;
}

export default async function OffersSearch(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const body: OffersSearchApiRequest & { token: string } = req.body;
    const staticData = await fetch(`https://ui-api.partners.sandbox.tripleup.dev/offers-search`, {
      headers: {
        "X-Cardholder-Token": body.token ?? "",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        apply_filter: { ...body.apply_filter },
        proximity_target: {
          ...body.proximity_target
        },
        page_size: 24,
        page_offset: body.page_offset ?? 0,
        text_query: body.text_query ?? undefined
      })
    });

    if (!staticData.ok) {
      // Handle the error response
      if (staticData.status === 403) throw new Error(`User Authentication`);
    }

    const data = await staticData.json();
    console.log(data);
    res.status(200).json({ response: data, message: "jhu", error: null });
  } catch (err:any) {
    res.status(403).json({
      response: {},
      message: err.message,
      error: {
        err: err
      }
    });
  }
}
