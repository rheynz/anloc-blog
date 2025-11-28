import { Article, Member, Page, Category, Banner, ShirtSize, AdminUser, Merchant } from '../types';
import { slugify } from '../utils/helpers';

// --- LocalStorage Persistence Layer ---

const getData = <T>(key: string, fallback: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error(`Failed to parse ${key} from localStorage`, e);
    }
    // If nothing is stored or parsing fails, return the fallback and don't write it yet.
    return fallback;
};

const saveData = <T>(key: string, data: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Failed to save ${key} to localStorage`, e);
    }
};

const initializeAndSaveData = <T>(key: string, initialData: T): void => {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) {
            localStorage.setItem(key, JSON.stringify(initialData));
        }
    } catch (e) {
        console.error(`Failed to initialize ${key} in localStorage`, e);
    }
};


// --- Initial Mock Data (used only if localStorage is empty) ---

const initialCategories: Category[] = [
  { id: '1', name: 'Popular News' },
  { id: '2', name: 'Event' },
  { id: '3', name: 'Tips & Trik' },
  { id: '4', name: 'Berita Nasional' },
  { id: '5', name: 'Chapter Jateng' },
];

const initialArticles: Article[] = [
  // Berita Nasional (for main grid)
  {
    id: '101',
    title: 'Musyawarah Nasional ANLOC',
    slug: 'musyawarah-nasional-anloc',
    featureImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Pesta Demokrasi, ANLOC Gelar MUNAS Dengan Konsep Pemilihan Langsung. Acara ini dihadiri oleh perwakilan dari seluruh chapter di Indonesia.',
    excerpt: 'Pesta Demokrasi, ANLOC Gelar MUNAS Dengan Konsep Pemilihan Langsung...',
    category: initialCategories[3],
    keywords: ['munas', 'anloc', 'nasional'],
    createdAt: '2023-11-20T10:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  {
    id: '102',
    title: 'Hangatnya Kebersamaan Jambore ANLOC Jatim',
    slug: 'jambore-anloc-jatim',
    featureImage: 'https://images.unsplash.com/photo-1617531322474-3c3354c4f05e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Keseruan acara Jambore daerah chapter Jawa Timur yang diadakan di Batu, Malang.',
    excerpt: 'Keseruan acara Jambore daerah chapter Jawa Timur...',
    category: initialCategories[3],
    keywords: ['jambore', 'jatim'],
    createdAt: '2023-11-19T11:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  {
    id: '103',
    title: 'Peresmian Pengurus Pusat ANLOC Periode Baru',
    slug: 'peresmian-pengurus-pusat',
    featureImage: 'https://images.unsplash.com/photo-1580414057902-b42f04d9a13b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Pengurus pusat ANLOC yang baru resmi dilantik dan siap membawa perubahan.',
    excerpt: 'Pengurus pusat ANLOC yang baru resmi dilantik...',
    category: initialCategories[3],
    keywords: ['pengurus', 'pusat'],
    createdAt: '2023-11-18T09:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
   {
    id: '104',
    title: 'Kopdar Rutin Chapter Banten Jawara',
    slug: 'kopdar-banten-jawara',
    featureImage: 'https://images.unsplash.com/photo-1541443131-153PAAD-543B?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Akran Nya Anggota ANLOC Chapter Banten Jawara.',
    excerpt: 'Akran Nya Anggota ANLOC Chapter Banten Jawara...',
    category: initialCategories[3],
    keywords: ['kopdar', 'banten'],
    createdAt: '2023-11-17T09:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  // Popular News
  {
    id: '201',
    title: 'Kekeluargaan dan Persaudaraan Sebagai Benefit Nyata Member Lintas Chapter',
    slug: 'benefit-member-lintas-chapter',
    featureImage: 'https://images.unsplash.com/photo-1555554317-76621b302d33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Kekeluargaan dalam ANLOC sebagai benefit nyata member lintas chapter Komunitas Otomotif merupakan salah satu media dalam menyatukan para pecinta otomotif.',
    excerpt: 'Kekeluargaan dalam ANLOC sebagai benefit nyata member lintas chapter Komunitas Otomotif...',
    category: initialCategories[0],
    keywords: ['kekeluargaan', 'chapter'],
    createdAt: '2023-11-15T10:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  {
    id: '202',
    title: 'Mengenal Rem Blong, dan Cara Mengatasinya',
    slug: 'mengenal-rem-blong',
    featureImage: 'https://images.unsplash.com/photo-1610466024956-43cde24a1b53?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Penyebab dan cara mengatasi rem blong pada mobil Anda.',
    excerpt: 'Penyebab dan cara mengatasi rem blong...',
    category: initialCategories[0],
    keywords: ['rem', 'tips'],
    createdAt: '2023-11-14T11:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  {
    id: '203',
    title: '4 Hal yang Harus Diketahui Agar Tidak Terjaring Kamera ETLE',
    slug: 'tips-hindari-etle',
    featureImage: 'https://images.unsplash.com/photo-1578496479701-7b0844a4e153?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Tips agar perjalanan Anda aman dan tidak terkena tilang elektronik.',
    excerpt: 'Tips agar perjalanan Anda aman dan tidak terkena...',
    category: initialCategories[0],
    keywords: ['etle', 'tilang'],
    createdAt: '2023-11-13T09:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  // Event
  {
    id: '301',
    title: 'Hangatnya Kebersamaan dan Persaudaraan Dalam Gelaran Jamnas ANLOC 2023',
    slug: 'jamnas-anloc-2023',
    featureImage: 'https://images.unsplash.com/photo-1533122638-34858e921325?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Rangkuman keseruan Jambore Nasional ANLOC yang diadakan di Yogyakarta dengan partisipasi ribuan member dari seluruh Indonesia.',
    excerpt: 'Rangkuman keseruan Jambore Nasional ANLOC yang diadakan di Yogyakarta...',
    category: initialCategories[1],
    keywords: ['jamnas', '2023', 'event'],
    createdAt: '2023-11-10T10:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  {
    id: '302',
    title: 'Pesta Demokrasi, ANLOC Gelar MUNAS Dengan Konsep Pemilihan Langsung',
    slug: 'pesta-demokrasi-munas',
    featureImage: 'https://images.unsplash.com/photo-1580273916551-585a4b5553a2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Detail acara Musyawarah Nasional yang berlangsung meriah.',
    excerpt: 'Detail acara Musyawarah Nasional...',
    category: initialCategories[1],
    keywords: ['munas', 'event'],
    createdAt: '2023-11-09T11:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  // Tips & Trik
  {
    id: '401',
    title: 'Tips Beli Mobil Bekas, Jangan Sampai Tertipu',
    slug: 'tips-beli-mobil-bekas',
    featureImage: 'https://images.unsplash.com/photo-1599912027806-cfec9f5944b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Hal-hal yang perlu diperhatikan saat membeli mobil bekas agar tidak menyesal di kemudian hari. Cek kondisi mesin, bodi, dan surat-surat.',
    excerpt: 'Hal-hal yang perlu diperhatikan saat membeli mobil bekas agar tidak menyesal...',
    category: initialCategories[2],
    keywords: ['mobil bekas', 'tips'],
    createdAt: '2023-11-05T10:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
  {
    id: '402',
    title: 'Salah Kaprah, Lampu Hazard Disaat Hujan',
    slug: 'salah-kaprah-lampu-hazard',
    featureImage: 'https://images.unsplash.com/photo-1610455326392-a9b71b7b0c44?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    images: [],
    content: 'Kapan waktu yang tepat untuk menggunakan lampu hazard? Simak penjelasannya.',
    excerpt: 'Kapan waktu yang tepat untuk menggunakan lampu hazard?...',
    category: initialCategories[2],
    keywords: ['hazard', 'safety'],
    createdAt: '2023-11-04T11:00:00Z',
    author: { name: 'Admin ANLOC', avatar: 'https://i.pravatar.cc/40?u=admin' },
  },
];
const initialMembers: Member[] = [
    {
        id: '1',
        email: 'johndoe@example.com',
        fullName: 'John Doe',
        nickname: 'John',
        chapter: 'Banten Jawara',
        address: 'Jl. Mobil Keren No. 1',
        phone: '081234567890',
        licensePlate: 'B 1234 XYZ',
        car: 'Nissan Livina',
        carColor: 'Hitam',
        carYear: 2021,
        shirtSize: ShirtSize.L,
        joinReason: 'Suka dengan komunitasnya',
        registeredAt: new Date().toISOString()
    },
    {
        id: '2',
        email: 'janedoe@example.com',
        fullName: 'Jane Doe',
        nickname: 'Jane',
        chapter: 'Jawa Timur',
        address: 'Jl. Otomotif No. 2',
        phone: '081298765432',
        licensePlate: 'L 5678 ABC',
        car: 'Nissan Livina',
        carColor: 'Putih',
        carYear: 2022,
        shirtSize: ShirtSize.M,
        joinReason: 'Menambah teman dan relasi',
        registeredAt: new Date().toISOString()
    }
];
const initialPages: Page[] = [
    { id: '1', title: 'Tentang Kami', slug: 'tentang-kami', content: 'Ini adalah halaman tentang kami. Kami adalah komunitas pecinta mobil yang solid.', updatedAt: new Date().toISOString() },
    { id: '2', title: 'Kontak', slug: 'kontak', content: 'Hubungi kami di email: kontak@klubmobil.com', updatedAt: new Date().toISOString() },
];
const initialBanner: Banner = {
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    text: 'Selamat Datang di ANLOC.ID!'
};
const initialMerchants: Merchant[] = [
    {
        id: '1',
        name: 'Warung Kopi Mantap',
        category: 'Kuliner',
        logoUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2070&auto=format&fit=crop',
        address: 'Jl. Kopi No. 1, Jakarta',
        discountInfo: 'Diskon 15% untuk minuman'
    },
    {
        id: '2',
        name: 'Bengkel Cepat Jaya',
        category: 'Otomotif',
        logoUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop',
        address: 'Jl. Otomotif Raya No. 5, Bandung',
        discountInfo: 'Gratis cek mesin & diskon 10% jasa servis'
    }
];

// Initialize all data sets on first load
initializeAndSaveData('mock_categories', initialCategories);
initializeAndSaveData('mock_articles', initialArticles);
initializeAndSaveData('mock_members', initialMembers);
initializeAndSaveData('mock_pages', initialPages);
initializeAndSaveData('mock_banner', initialBanner);
initializeAndSaveData('mock_merchants', initialMerchants);

const mockApi = {
  // Public
  getArticles: async ({ page = 1, limit = 10, categoryId, searchQuery }: { page?: number, limit?: number, categoryId?: string, searchQuery?: string }): Promise<{ data: Article[], total: number }> => {
    await new Promise(res => setTimeout(res, 300));
    let allArticles = getData('mock_articles', initialArticles);
    
    if (categoryId) {
        allArticles = allArticles.filter(a => a.category.id === categoryId);
    }
    
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        allArticles = allArticles.filter(a => 
            a.title.toLowerCase().includes(lowercasedQuery) || 
            a.content.toLowerCase().includes(lowercasedQuery)
        );
    }

    const total = allArticles.length;
    const data = allArticles.slice((page - 1) * limit, page * limit);
    return { data, total };
  },
  getArticleBySlug: async (slug: string): Promise<Article | undefined> => {
    await new Promise(res => setTimeout(res, 300));
    const allArticles = getData('mock_articles', initialArticles);
    return allArticles.find(a => a.slug === slug);
  },
  getCategories: async (): Promise<Category[]> => {
    await new Promise(res => setTimeout(res, 200));
    return getData('mock_categories', initialCategories);
  },
  getPageBySlug: async (slug: string): Promise<Page | undefined> => {
     await new Promise(res => setTimeout(res, 300));
     const allPages = getData('mock_pages', initialPages);
     return allPages.find(p => p.slug === slug);
  },
  getBanner: async (): Promise<Banner> => {
     await new Promise(res => setTimeout(res, 100));
     return getData('mock_banner', initialBanner);
  },
  getMerchants: async (): Promise<Merchant[]> => {
    await new Promise(res => setTimeout(res, 400));
    return getData('mock_merchants', initialMerchants);
  },
  registerMember: async (data: Omit<Member, 'id' | 'registeredAt'>): Promise<Member> => {
    await new Promise(res => setTimeout(res, 1000));
    const allMembers = getData('mock_members', initialMembers);
    const newMember: Member = {
        ...data,
        id: String(Date.now()),
        registeredAt: new Date().toISOString(),
    };
    const updatedMembers = [...allMembers, newMember];
    saveData('mock_members', updatedMembers);
    console.log("New member registered:", newMember);
    return newMember;
  },

  // Admin
  login: async (email: string, pass: string): Promise<{ user: AdminUser, token: string } | null> => {
    await new Promise(res => setTimeout(res, 500));
    if (email === 'admin@klub.com' && pass === 'password') {
        const user = { id: 'admin1', email: 'admin@klub.com', name: 'Admin Utama' };
        const token = 'fake-jwt-token';
        return { user, token };
    }
    return null;
  },
  getDashboardStats: async (): Promise<{ articles: number, members: number, pages: number }> => {
    await new Promise(res => setTimeout(res, 200));
    const articles = getData('mock_articles', initialArticles);
    const members = getData('mock_members', initialMembers);
    const pages = getData('mock_pages', initialPages);
    return { articles: articles.length, members: members.length, pages: pages.length };
  },
  
  // Admin Articles
  getAdminArticles: async (): Promise<Article[]> => {
     await new Promise(res => setTimeout(res, 500));
     const allArticles = getData('mock_articles', initialArticles);
     return [...allArticles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getAdminArticleById: async (id: string): Promise<Article | undefined> => {
     await new Promise(res => setTimeout(res, 300));
     const allArticles = getData('mock_articles', initialArticles);
     return allArticles.find(a => a.id === id);
  },
  createArticle: async (data: Omit<Article, 'id' | 'slug' | 'createdAt' | 'author'>): Promise<Article> => {
    await new Promise(res => setTimeout(res, 1000));
    const allArticles = getData('mock_articles', initialArticles);
    const newArticle: Article = {
      images: [], // Ensure images array exists
      keywords: [], // Ensure keywords array exists
      ...data,
      id: String(Date.now()),
      slug: slugify(data.title),
      createdAt: new Date().toISOString(),
      author: { name: 'Admin Klub', avatar: 'https://i.pravatar.cc/40?u=admin' },
    };
    const updatedArticles = [newArticle, ...allArticles];
    saveData('mock_articles', updatedArticles);
    return newArticle;
  },
  updateArticle: async (id: string, data: Partial<Omit<Article, 'id' | 'slug'>>): Promise<Article> => {
    await new Promise(res => setTimeout(res, 1000));
    let allArticles = getData('mock_articles', initialArticles);
    const articleIndex = allArticles.findIndex(a => a.id === id);
    if (articleIndex === -1) throw new Error("Article not found");
    
    const article = allArticles[articleIndex];
    const newSlug = data.title ? slugify(data.title) : article.slug;
    const updatedArticle = { ...article, ...data, slug: newSlug };
    
    allArticles[articleIndex] = updatedArticle;
    saveData('mock_articles', allArticles);
    return updatedArticle;
  },
  deleteArticle: async (id: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 500));
    let allArticles = getData('mock_articles', initialArticles);
    const updatedArticles = allArticles.filter(a => a.id !== id);
    saveData('mock_articles', updatedArticles);
  },

  // Admin Pages
  getAdminPages: async(): Promise<Page[]> => {
    await new Promise(res => setTimeout(res, 500));
    return getData('mock_pages', initialPages);
  },
  getAdminPageById: async (id: string): Promise<Page | undefined> => {
    await new Promise(res => setTimeout(res, 300));
    const allPages = getData('mock_pages', initialPages);
    return allPages.find(p => p.id === id);
  },
  createPage: async(data: Omit<Page, 'id' | 'slug' | 'updatedAt'>): Promise<Page> => {
     await new Promise(res => setTimeout(res, 1000));
     const allPages = getData('mock_pages', initialPages);
     const newPage: Page = {
         ...data,
         id: String(Date.now()),
         slug: slugify(data.title),
         updatedAt: new Date().toISOString()
     };
     const updatedPages = [...allPages, newPage];
     saveData('mock_pages', updatedPages);
     return newPage;
  },
  updatePage: async(id: string, data: Partial<Omit<Page, 'id' | 'slug'>>): Promise<Page> => {
    await new Promise(res => setTimeout(res, 1000));
    let allPages = getData('mock_pages', initialPages);
    const pageIndex = allPages.findIndex(p => p.id === id);
    if (pageIndex === -1) throw new Error("Page not found");

    const page = allPages[pageIndex];
    const newSlug = data.title ? slugify(data.title) : page.slug;
    const updatedPage = { ...page, ...data, slug: newSlug, updatedAt: new Date().toISOString() };
    
    allPages[pageIndex] = updatedPage;
    saveData('mock_pages', allPages);
    return updatedPage;
  },
  deletePage: async (id: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 500));
    const allPages = getData('mock_pages', initialPages);
    const updatedPages = allPages.filter(p => p.id !== id);
    saveData('mock_pages', updatedPages);
  },

  // Admin Members
  getAdminMembers: async (): Promise<Member[]> => {
    await new Promise(res => setTimeout(res, 500));
    return getData('mock_members', initialMembers);
  },
  getPublicMembers: async (): Promise<Member[]> => {
    await new Promise(res => setTimeout(res, 500));
    return getData('mock_members', initialMembers);
  },
  getAdminMemberById: async (id: string): Promise<Member | undefined> => {
    await new Promise(res => setTimeout(res, 300));
    const allMembers = getData('mock_members', initialMembers);
    return allMembers.find(m => m.id === id);
  },
  updateMember: async (id: string, data: Partial<Omit<Member, 'id'>>): Promise<Member> => {
    await new Promise(res => setTimeout(res, 1000));
    let allMembers = getData('mock_members', initialMembers);
    const memberIndex = allMembers.findIndex(m => m.id === id);
    if (memberIndex === -1) throw new Error("Member not found");

    const member = allMembers[memberIndex];
    const updatedMember = { ...member, ...data };
    
    allMembers[memberIndex] = updatedMember;
    saveData('mock_members', allMembers);
    return updatedMember;
  },
  deleteMember: async (id: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 500));
    const allMembers = getData('mock_members', initialMembers);
    const updatedMembers = allMembers.filter(m => m.id !== id);
    saveData('mock_members', updatedMembers);
  },

  // Admin Settings
  updateBanner: async (newBanner: Banner): Promise<Banner> => {
    await new Promise(res => setTimeout(res, 1000));
    saveData('mock_banner', newBanner);
    return newBanner;
  },
  
  // Admin Merchants
  getAdminMerchants: async (): Promise<Merchant[]> => {
    await new Promise(res => setTimeout(res, 400));
    return getData('mock_merchants', initialMerchants);
  },
  getAdminMerchantById: async (id: string): Promise<Merchant | undefined> => {
    await new Promise(res => setTimeout(res, 300));
    const allMerchants = getData('mock_merchants', initialMerchants);
    return allMerchants.find(m => m.id === id);
  },
  createMerchant: async (data: Omit<Merchant, 'id'>): Promise<Merchant> => {
    await new Promise(res => setTimeout(res, 1000));
    const allMerchants = getData('mock_merchants', initialMerchants);
    const newMerchant: Merchant = { ...data, id: String(Date.now()) };
    const updatedMerchants = [...allMerchants, newMerchant];
    saveData('mock_merchants', updatedMerchants);
    return newMerchant;
  },
  updateMerchant: async (id: string, data: Partial<Omit<Merchant, 'id'>>): Promise<Merchant> => {
    await new Promise(res => setTimeout(res, 1000));
    let allMerchants = getData('mock_merchants', initialMerchants);
    const merchantIndex = allMerchants.findIndex(m => m.id === id);
    if (merchantIndex === -1) throw new Error("Merchant not found");

    const merchant = allMerchants[merchantIndex];
    const updatedMerchant = { ...merchant, ...data };
    
    allMerchants[merchantIndex] = updatedMerchant;
    saveData('mock_merchants', allMerchants);
    return updatedMerchant;
  },
  deleteMerchant: async (id: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 500));
    const allMerchants = getData('mock_merchants', initialMerchants);
    const updatedMerchants = allMerchants.filter(m => m.id !== id);
    saveData('mock_merchants', updatedMerchants);
  }
};

export default mockApi;
