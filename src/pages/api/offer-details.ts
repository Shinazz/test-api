import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware, cors } from "./_middlewares/cors";

type ResponseData = {
  message: string;
  response?: OfferDetailsApiResponse;
  error: any;
};
export interface Address {
  city: string;
  country_code: string;
  country_subdivision_code: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  street_address: string;
}

export interface MerchantLocation {
  address: Address;
  distance: string;
  id: string;
  is_in_radius: boolean;
  location_name: string;
}

interface Offer {
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
  merchant_website: string;
  minimum_spend: number;
  offer_mode: string;
  offer_preference: string;
  reward_rate: number;
  reward_type: string;
  terms_and_conditions: string;
  type: string;
}

export interface OfferDetailsApiResponse {
  merchant_locations: MerchantLocation[];
  offer: Offer;
}

export interface OfferDetailsApiRequest {
  offer_id?: string;
}

async function OffersDetails(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await runMiddleware(req, res, cors);
  try {
    const body: OfferDetailsApiRequest & { token: string } = req.body;
    const staticData = await fetch(
      `https://ui-api.partners.sandbox.tripleup.dev/offers-details`,
      {
        headers: {
          "X-Cardholder-Token": body.token ?? "",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          offer_id: body.offer_id,
          proximity_target: {
            latitude: 9.977856,
            longitude: 76.3133952,
          },
        }),
      }
    );

    if (!staticData.ok) {
      // Handle the error response
      if (staticData.status === 403) {
        res.status(403).json({
          response: undefined,
          message: "User Authentication",
          error: {
            status: 403,
            message:
              "Forbidden: You do not have permission to access this resource.",
          },
        });
      }
    }
    const data = await staticData.json();
    res.status(200).json({ response: data, message: "jhu", error: null });
  } catch (err: any) {
    res.status(500).json({
      response: undefined,
      message: err.message,
      error: {
        err: err,
      },
    });
  }
}

export default OffersDetails;
