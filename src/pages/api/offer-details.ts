import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
  response: OfferDetailsApiResponse;
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

const allowCors =
  (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    await fn(req, res);
  };

async function OffersDetails(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
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
    const data = await staticData.json();
    console.log(data);
    res.status(200).json({ response: data, message: "jhu" });
  } catch (err) {
    res
      .status(403)
      .json({ response: {} as OfferDetailsApiResponse, message: "error" });
  }
}

export default allowCors(OffersDetails);
