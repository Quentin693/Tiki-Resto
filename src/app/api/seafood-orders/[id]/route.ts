import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Token d'authentification manquant ou invalide" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token
    try {
      const secret = process.env.JWT_SECRET as string;
      jwt.verify(token, secret);
      
      // Appeler le backend pour mettre à jour la commande
      const response = await fetch(`${API_URL}/seafood-orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { message: errorData.message || "Erreur lors de la mise à jour de la commande" },
          { status: response.status }
        );
      }
      
      const updatedOrder = await response.json();
      return NextResponse.json(updatedOrder);
    } catch (error: any) {
      console.error('Erreur de vérification du token:', error);
      return NextResponse.json(
        { message: error.message || "Token invalide" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise à jour de la commande" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Token d'authentification manquant ou invalide" },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Récupérer le corps de la demande (pour l'option sendSms)
    const body = await request.json().catch(() => ({}));
    const sendSms = body.sendSms !== undefined ? body.sendSms : true;
    
    // Vérifier le token
    try {
      const secret = process.env.JWT_SECRET as string;
      jwt.verify(token, secret);
      
      // Appeler le backend pour supprimer la commande
      const response = await fetch(`${API_URL}/seafood-orders/${id}?sendSms=${sendSms}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { message: errorData.message || "Erreur lors de la suppression de la commande" },
          { status: response.status }
        );
      }
      
      return NextResponse.json(
        { message: "Commande annulée avec succès" },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Erreur de vérification du token:', error);
      return NextResponse.json(
        { message: error.message || "Token invalide" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la suppression de la commande" },
      { status: 500 }
    );
  }
} 