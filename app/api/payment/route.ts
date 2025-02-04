import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/auth';
import { didUserPay, getUserInvoice } from './lightningServices';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await getUserInvoice(session.user.email);
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error getting invoice:', error);
    return NextResponse.json({ error: 'Failed to get invoice' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentRequest } = await request.json();
    if (!paymentRequest) {
      return NextResponse.json({ error: 'Payment request is required' }, { status: 400 });
    }

    // Here you would implement the actual payment processing logic
    // For now, we'll just check if the user has paid
    const paid = await didUserPay(session.user.email);

    if (paid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
