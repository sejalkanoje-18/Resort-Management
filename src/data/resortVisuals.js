export const resortImages = {
  goa: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
  coorg: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  manali: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  udaipur: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1200&q=80',
  restaurant: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  suite: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
  lobby: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
}

export const resortImageByName = {
  'Serenity Goa': resortImages.goa,
  'Serenity Coorg': resortImages.coorg,
  'Serenity Manali': resortImages.manali,
  'Serenity Udaipur': resortImages.udaipur,
}

export function getResortImage(resort) {
  return resort?.imageUrl || resortImageByName[resort?.name] || resortImages.lobby
}
