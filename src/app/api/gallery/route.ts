import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    // Extraire les paramètres de requête si nécessaire
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    let url = `${API_URL}/gallery`;
    
    // Si une catégorie est spécifiée (et n'est pas 'all'), filtrer par catégorie
    if (category && category !== 'all') {
      url = `${API_URL}/gallery/category/${category}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery items: ${response.statusText}`);
    }
    
    const galleryItems = await response.json();
    
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des images de la galerie' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const galleryItemData = await request.json();
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(galleryItemData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create gallery item');
    }

    const galleryItem = await response.json();
    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'élément de galerie' },
      { status: 500 }
    );
  }
} 