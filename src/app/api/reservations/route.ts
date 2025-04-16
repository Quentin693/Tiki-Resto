import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Numéro de téléphone requis' }, { status: 400 });
  }

  try {
    const result = await query(
      'SELECT * FROM reservation WHERE "customerPhone" = $1 ORDER BY "reservationDateTime" DESC',
      [phone]
    );
    
    const reservations = result.rows.map(row => ({
      id: row.id,
      clientName: row.customerName,
      phoneNumber: row.customerPhone,
      email: row.customerEmail,
      eventDate: new Date(row.reservationDateTime).toISOString().split('T')[0],
      eventTime: new Date(row.reservationDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      numberOfGuests: row.numberOfGuests,
      status: row.status || 'confirmed'
    }));
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur lors de la recherche des réservations:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID de réservation requis' }, { status: 400 });
  }

  try {
    // Vérifier si la réservation existe et n'est pas dans les 24h
    const checkResult = await query(
      'SELECT "reservationDateTime" FROM reservation WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    const reservationDate = new Date(checkResult.rows[0].reservationDateTime);
    const now = new Date();
    const diffHours = (reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 24) {
      return NextResponse.json(
        { error: 'Impossible d\'annuler une réservation moins de 24h avant' },
        { status: 400 }
      );
    }

    // Annuler la réservation
    const result = await query(
      'UPDATE reservation SET status = $1 WHERE id = $2 RETURNING *',
      ['CANCELLED', id]
    );

    return NextResponse.json({ message: 'Réservation annulée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID de réservation requis' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { numberOfGuests, reservationDateTime } = body;

    // Vérifier si la réservation existe et n'est pas dans les 24h
    const checkResult = await query(
      'SELECT "reservationDateTime" FROM reservation WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    const currentReservationDate = new Date(checkResult.rows[0].reservationDateTime);
    const now = new Date();
    const diffHours = (currentReservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 24) {
      return NextResponse.json(
        { error: 'Impossible de modifier une réservation moins de 24h avant' },
        { status: 400 }
      );
    }

    // Modifier la réservation
    const result = await query(
      'UPDATE reservation SET "numberOfGuests" = $1, "reservationDateTime" = $2, status = $3 WHERE id = $4 RETURNING *',
      [numberOfGuests, reservationDateTime, 'MODIFIED', id]
    );

    return NextResponse.json({ 
      message: 'Réservation modifiée avec succès',
      reservation: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la réservation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 