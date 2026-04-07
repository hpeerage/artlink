export interface Artwork {
  id: string;
  title: string;
  artist: string;
  category: 'Modern' | 'Abstract' | 'Traditional' | 'Digital';
  priceBuy: number;
  priceRental: number;
  imageUrl: string;
  modelUrl: string;
  description: string;
}

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: '지평선의 끝 (End of Horizon)',
    artist: '김선우 (Kim Sun-woo)',
    category: 'Modern',
    priceBuy: 2500000,
    priceRental: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: '현대적인 갈등과 평온함을 동시에 표현한 작품으로, 공간의 깊이감을 더해줍니다.'
  },
  {
    id: '2',
    title: '푸른 아리아 (Blue Aria)',
    artist: '이정은 (Lee Jung-eun)',
    category: 'Abstract',
    priceBuy: 1800000,
    priceRental: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: '추상적인 유동성을 통해 생명의 에너지를 형상화한 작품입니다.'
  },
  {
    id: '3',
    title: '디지털 르네상스 (Digital Renaissance)',
    artist: 'Park Digital',
    category: 'Digital',
    priceBuy: 900000,
    priceRental: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: '고전 예술의 기법을 디지털 트랜스포메이션으로 재해석한 작품입니다.'
  },
  {
    id: '4',
    title: '달항아리의 꿈 (Dream of Moon Jar)',
    artist: '최민준 (Choi Min-jun)',
    category: 'Traditional',
    priceBuy: 3200000,
    priceRental: 58000,
    imageUrl: 'https://images.unsplash.com/photo-1515405848047-d49d0aa20786?q=80&w=1000&auto=format&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: '전통적인 달항아리의 곡선을 현대적인 색감으로 풀어내어 동양적인 미학을 선사합니다.'
  },
  {
    id: '5',
    title: '네온 시티 (Neon City)',
    artist: 'Vapor Wave',
    category: 'Digital',
    priceBuy: 1200000,
    priceRental: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: '도시의 화려한 조명과 고독을 사이버펑크 스타일로 구현한 디지털 아트워크입니다.'
  },
  {
    id: '6',
    title: '정선 아리아 블루 #08',
    artist: 'ArtLink Exclusive',
    category: 'Modern',
    priceBuy: 2100000,
    priceRental: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-41e734149581?q=80&w=1000&auto=format&fit=crop',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    description: '정선 아리아 시리즈의 8번째 작품으로, 강렬한 블루 톤이 공간에 생기를 불어넣습니다.'
  }
];
