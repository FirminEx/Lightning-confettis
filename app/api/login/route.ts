import { getUserByEmail } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// Add this type definition
type User = {
  email: string;
  password: string;
  isPremiumUser: boolean;
} | null;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);
    
    const user = getUserByEmail(email) as User;
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      console.log('Login successful');
      return NextResponse.json({ 
        success: true,
        email: user.email,
        isPremiumUser: user.isPremiumUser 
      });
    }

    console.log('Invalid password');
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}