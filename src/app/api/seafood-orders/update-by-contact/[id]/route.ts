import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tiki-resto-backend.onrender.com';

export async function PATCH(
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
    const updateData = await request.json();
    console.log('Données reçues pour mise à jour:', updateData);
    
    // Vérifier que les données minimales sont présentes
    if (!updateData.pickupDate || !updateData.pickupTime) {
      return NextResponse.json(
        { message: "Date et heure de retrait requises" },
        { status: 400 }
      );
    }
    
    // Vérifier que des coordonnées sont fournies pour authentifier la demande
    if (!updateData.customerEmail && !updateData.customerPhone) {
      return NextResponse.json(
        { message: "Email ou téléphone requis pour authentifier la demande" },
        { status: 400 }
      );
    }
    
    // Construire les paramètres de requête
    const searchParams = new URLSearchParams();
    if (updateData.customerEmail) {
      searchParams.append('email', updateData.customerEmail);
    }
    if (updateData.customerPhone) {
      searchParams.append('phone', updateData.customerPhone);
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
        { message: "Vous n'êtes pas autorisé à modifier cette commande" },
        { status: 403 }
      );
    }
    
    // Préparer les données à envoyer au backend
    const dataToUpdate = {
      pickupDate: updateData.pickupDate,
      pickupTime: updateData.pickupTime,
      isPickup: updateData.isPickup,
      specialRequests: updateData.specialRequests,
      // Ajouter d'autres champs si nécessaire
    };
    
    // SMS notification en option
    if (updateData.sendSms !== undefined) {
      dataToUpdate.sendSms = updateData.sendSms;
    }
    
    // Effectuer la mise à jour
    const updateResponse = await fetch(`${API_URL}/seafood-orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToUpdate)
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Erreur lors de la mise à jour:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { message: errorData.message || "Erreur lors de la mise à jour de la commande" },
          { status: updateResponse.status }
        );
      } catch (e) {
        return NextResponse.json(
          { message: `Erreur ${updateResponse.status} lors de la mise à jour` },
          { status: updateResponse.status }
        );
      }
    }
    
    const updatedOrder = await updateResponse.json();
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: error.message || "Erreur serveur lors de la mise à jour de la commande" },
      { status: 500 }
    );
  }
} 