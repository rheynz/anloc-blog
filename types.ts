export interface Category {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  featureImage: string;
  images: string[];
  content: string; // Markdown content
  excerpt: string;
  category: Category;
  keywords: string[];
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

export enum ShirtSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL',
    XXXL = 'XXXL'
}

export interface Member {
  id: string;
  email: string;
  fullName: string;
  nickname: string;
  chapter?: string;
  birthPlace?: string;
  birthDate?: string;
  address: string;
  phone: string;
  car?: string;
  carYear?: number;
  carColor?: string;
  licensePlate: string;
  shirtSize: ShirtSize;
  joinReason: string;
  registeredAt: string;
}

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown content
    updatedAt: string;
}

export interface Banner {
    imageUrl: string;
    text: string;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  address: string;
  discountInfo: string;
}

declare module 'react-quill';