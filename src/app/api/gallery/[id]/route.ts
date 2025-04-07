import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    const response = await fetch(`${API_URL}/gallery/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery item: ${response.statusText}`);
    }
    
    const galleryItem = await response.json();
    
    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error(`Error fetching gallery item with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'élément de galerie' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const galleryItemData = await request.json();
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/gallery/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(galleryItemData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update gallery item');
    }

    const updatedGalleryItem = await response.json();
    return NextResponse.json(updatedGalleryItem);
  } catch (error) {
    console.error(`Error updating gallery item with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'élément de galerie' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete gallery item');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting gallery item with ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'élément de galerie' },
      { status: 500 }
    );
  }
} 