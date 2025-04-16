import { NextResponse } from 'next/server';

// Remplacer par votre clé API Google Places
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
// Remplacer par l'ID de votre établissement Google
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

export async function GET() {
  try {
    // Première requête pour obtenir les détails du lieu et les avis
    const detailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}`
    );

    if (!detailsResponse.ok) {
      throw new Error('Erreur lors de la récupération des avis');
    }

    const data = await detailsResponse.json();

    if (!data.result || !data.result.reviews) {
      return NextResponse.json([]);
    }

    // Transformer et trier les avis
    const reviews = data.result.reviews
      .map((review: any) => ({
        author_name: review.author_name,
        rating: review.rating,
        relative_time_description: review.relative_time_description,
        text: review.text
      }))
      .sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis Google:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    );
  }
} 