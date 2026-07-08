export interface IEvents {
  id: number;
  title: string;
  slug: string;
  priceRupiah: number;
  date: Date | string;
  location: string;
  seats: number;
  isAvailable: boolean;
  category: string;
  content: string;
  image: string & { file: { url: string } };
  author?: {
    id: number;
    name?: string;
    email?: string;
    password: string;
    role: string;
    avatar: string & { file: { url: string } };
    token?: string;
    users?: IUserState;
  };
}

export interface EventsInput {
  id?: number;
  title: string;
  slug?: string;
  priceRupiah: number;
  date: string | Date;
  location: string;
  seats: number;
  isAvailable: boolean;
  category: string;
  content: string;
  image: string | File;
  author?: IAuthorState;
}

export interface EventsUpdate {
  id?: number;
  title: string;
  slug?: string;
  priceRupiah: number;
  date: string | Date;
  location: string;
  seats: number;
  isAvailable: boolean;
  category: string;
  content: string;
  image?: string | File;
  author?: IAuthorState;
}

export interface IEditImage {
  image: string | File;
}

export interface IAuthorState {
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: string | null;
  avatar?: string | File | { url: string };
  token?: string | null;
  users?: IUserState;
}

export interface IUserState {
  id?: number;
  name?: string;
  email: string;
  provider?: string;
  avatar?: { url: string } | File | string;
  token?: string | null;
  isStored?: boolean;
  authorEmail?: string | null;
}

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  data?: Option[];
}

export interface DateTimeValue {
  date?: Date;
  time?: string;
}

export interface IBlogs {
  sys: { id: number | null | undefined };
  fields: {
    title: string;
    slug: string;
    image: { fields: { file: { url: string } } };
    author: {
      fields: {
        avatar: {
          fields: {
            file: { url: string };
          };
        };
        name: string;
        email: string;
      };
    };
  };
}

export interface BlogInput {
  title: string;
  category: string;
  content: string;
  slug: string;
  image?: File | string | null;
}

export interface ICardBlog {
  title: string;
  slug: string;
  avatar?: string;
  email: string;
  author: string;
  category?: string;
  content?: string;
  image: string;
}

export interface IAuthorReg {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface IAuthorLogin {
  name?: string;
  email: string;
  password: string;
  role?: string;
  token?: string;
}

export interface IAuthorUpdate {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  avatar?: string | File | { url: string };
  usersEmail?: string;
}

// CARTs
export interface ICartItem {
  id: number;
  name: string;
  priceRupiah: number;
  quantity: number;
}

export interface CheckoutFormProps {
  event: {
    id: number;
    slug: string;
    image: string;
    title: string;
    priceRupiah: number;
    content: string;
  };
}

export interface PurchaseReceiptEmailProps {
  event: {
    title: string;
    slug: string;
    image: string;
    content: string;
  };
  order: { id: number; createdAt: Date; pricePaid: number };
  pdfUrl: string;
}

export interface OrderInformationProps {
  order: {
    id: number;
    createdAt: Date;
    pricePaid: number
  };
  event: {
    title: string;
    slug: string
    content: string;
    image: string;
  };
  pdfUrl: string;
}

export interface OrderHistoryEmailProps {
  orders: {
    id: number;
    pricePaid: number;
    createdAt: Date;
    verificationId: string;
    event: {
      title: string;
      slug: string;
      image: string;
      content: string;
    };
  }[];
}

export interface IstripeSession {
  eventId: number;
  quantity: number;
  email: string;
}