/**
 * Bentuk data yang dibutuhkan navbar. Sengaja terpisah dari `Category` dan
 * `Collection`: endpoint publik (contract.md Bagian 32 & 34) mengirim field yang
 * jauh lebih sedikit, dan room type di backend bukan union tetap seperti
 * `CategoryRoom` — admin bebas membuat room type baru.
 */
export type NavCategory = {
  id: string;
  slug: string;
  name: string;
};

export type NavRoomGroup = {
  id: string;
  slug: string;
  name: string;
  categories: NavCategory[];
};

export type NavCollection = {
  id: string;
  slug: string;
  name: string;
};

export type NavigationMenu = {
  shopGroups: NavRoomGroup[];
  collections: NavCollection[];
};
