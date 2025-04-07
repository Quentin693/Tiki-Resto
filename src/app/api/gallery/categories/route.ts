import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/gallery/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery categories: ${response.statusText}`);
    }
    
    const categories = await response.json();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories de la galerie' },
      { status: 500 }
    );
  }
} 