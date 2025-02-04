import { createInvoice, getInvoiceByEmail } from '@/lib/db';

export interface Invoice {
  user: string;
  hash: string;
  request: string;
}

let apiKey = process.env.LNBITS_API_KEY;
if (!apiKey) apiKey = 'demo';

const lightningHeaders = {
  accept: 'application/json, text/plain, */*',
  'content-type': 'application/json',
  'x-api-key': apiKey,
};

export const getUserInvoice = async (email: string): Promise<Invoice> => {
  const invoice = getInvoiceByEmail(email);

  if (!invoice) {
    return await makeUserInvoice(1, email);
  }

  return {
    user: email,
    hash: (invoice as Invoice).hash,
    request: (invoice as Invoice).request,
  };
};

export const makeUserInvoice = async (sats: number, email: string): Promise<Invoice> => {
  const userHasInvoice = await doesUserHaveInvoice(email);

  if (userHasInvoice) {
    throw new Error('User already has an invoice');
  }

  const raw = JSON.stringify({
    out: false,
    amount: sats,
    memo: '.',
    unit: 'sat',
  });

  const requestOptions = {
    method: 'POST',
    headers: lightningHeaders,
    body: raw,
  };

  const res = await fetch('https://demo.lnbits.com/api/v1/payments', requestOptions);
  const data = await res.json();
  const invoice = {
    user: email,
    hash: data.payment_hash,
    request: data.payment_request,
  };

  createInvoice(email, data.payment_hash, data.payment_request);

  return invoice;
};

export const doesUserHaveInvoice = async (email: string): Promise<boolean> => {
  const invoice = getInvoiceByEmail(email);
  return !!invoice;
};

export const didUserPay = async (email: string): Promise<boolean> => {
  const invoice = getInvoiceByEmail(email);

  return !!invoice;
};
