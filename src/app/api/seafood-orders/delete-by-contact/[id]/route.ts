import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { message: "ID de commande manquant" },
        { status: 400 }
      );
    }
    
    // Récupérer les données du corps de la requête
    const bodyData = await request.json();
    console.log('Données reçues pour suppression:', bodyData);
    
    // Vérifier que des coordonnées sont fournies pour authentifier la demande
    if (!bodyData.customerEmail && !bodyData.customerPhone) {
      return NextResponse.json(
        { message: "Email ou téléphone requis pour authentifier la demande" },
        { status: 400 }
      );
    }
    
    // Construire les paramètres de requête
    const searchParams = new URLSearchParams();
    if (bodyData.customerEmail) {
      searchParams.append('email', bodyData.customerEmail);
    }
    if (bodyData.customerPhone) {
      searchParams.append('phone', bodyData.customerPhone);
    }
    
    // Vérifier d'abord si la commande existe et appartient au client
    const verificationResponse = await fetch(`${API_URL}/seafood-orders/search?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!verificationResponse.ok) {
      return NextResponse.json(
        { message: "Erreur lors de la vérification des autorisations" },
        { status: verificationResponse.status }
      );
    }
    
    const userOrders = await verificationResponse.json();
    
    // Vérifier si l'ordre appartient à ce client
    const orderBelongsToUser = userOrders.some((order: any) => order.id === orderId);
    
    if (!orderBelongsToUser) {
      return NextResponse.json(
        { message: "Vous n'êtes pas autorisé à supprimer cette commande" },
        { status: 403 }
      );
    }
    
    // Préparer les paramètres pour la suppression
    let deleteUrl = `${API_URL}/seafood-orders/${orderId}`;
    if (bodyData.sendSms !== undefined) {
      deleteUrl += `?sendSms=${bodyData.sendSms}`;
    }
    
    // Effectuer la suppression
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('Erreur lors de la suppression:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { message: errorData.message || "Erreur lors de la suppression de la commande" },
          { status: deleteResponse.status }
        );
      } catch (e) {
        return NextResponse.json(
          { message: `Erreur ${deleteResponse.status} lors de la suppression` },
          { status: deleteResponse.status }
        );
      }
    }
    
    // Tenter de récupérer le résultat de suppression
    let result;
    try {
      result = await deleteResponse.json();
    } catch (e) {
      // Si la réponse n'est pas du JSON valide, retourner un message de succès
      result = { message: "Commande supprimée avec succès" };
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: error.message || "Erreur serveur lors de la suppression de la commande" },
      { status: 500 }
    );
  }
} 