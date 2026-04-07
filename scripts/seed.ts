import { db } from "../src/lib/turso";
import { artworks } from "../src/lib/db/schema";

const artworkData = [
  {
        title: 'End of Horizon',
        artist: 'Kim Sun-woo',
        category: 'Modern',
        priceBuy: 2500000,
        priceRental: 45000,
        widthMm: 1000,
        heightMm: 800,
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
        modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        description: 'A modern piece expressing both conflict and tranquility.'
  },
  {
        title: 'Blue Aria',
        artist: 'Lee Jung-eun',
        category: 'Abstract',
        priceBuy: 1800000,
        priceRental: 32000,
        widthMm: 600,
        heightMm: 900,
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
        modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        description: 'Energy of life through abstract fluidity.'
  }
  ];

async function seed() {
    console.log('Seeding artworks...');
    try {
          for (const artwork of artworkData) {
                  await db.insert(artworks).values(artwork);
          }
          console.log('Seeding completed successfully!');
    } catch (error) {
          console.error('Error seeding database:', error);
    }
}

seed();
