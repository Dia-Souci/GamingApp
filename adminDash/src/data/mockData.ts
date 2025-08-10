// This file is kept for backward compatibility but most data now comes from the API
export const mockHomepageContent = {
  heroBanner: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
  categories: {
    xbox: true,
    playstation: true,
    pc: true,
    merchandise: true
  },
  carousel: [
    {
      id: '1',
      title: 'New Release: Cyberpunk 2077',
      image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      link: '/products/cyberpunk-2077',
      active: true
    },
    {
      id: '2',
      title: 'FIFA 24 - Now Available',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      link: '/products/fifa-24',
      active: true
    }
  ]
};