export type ProductCategory =
  | 'Groceries'
  | 'Electronics'
  | 'Clothing'
  | 'Home & Furniture'
  | 'Dining'
  | 'Health & Beauty'
  | 'Other';

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  likely_has_warranty: boolean;
  estimated_warranty_months: number;
  serial_number?: string;
  notes?: string;
  productImageUrl?: string;
}

export interface Receipt {
  id: string;
  store_name: string;
  storeLogoUrl?: string;
  date: string; // YYYY-MM-DD
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  payment_method: string;
  imageUrl?: string;
  receiptPhotoUrl?: string;
  notes?: string;
  tags?: string[];
  isInsuranceBacked?: boolean;
  createdAt: string;
}

export interface WarrantyItem {
  id: string;
  receiptId: string;
  itemName: string;
  storeName: string;
  purchaseDate: string;
  expiryDate: string;
  months: number;
  price: number;
  category: ProductCategory;
  status: 'safe' | 'warning' | 'critical' | 'expired';
  daysRemaining: number;
  receiptImageUrl?: string;
  productImageUrl?: string;
  claimPolicyUrl?: string;
  serialNumber?: string;
  modelNumber?: string;
  notes?: string;
}

export type SubscriptionTier = 'free' | 'premium';
export type BillingCycle = 'monthly' | 'annual';

export interface UserSubscription {
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  scansUsedThisMonth: number;
  maxFreeScans: number;
  insuranceModeEnabled: boolean;
  renewsAt?: string;
  transactionId?: string;
}

export type AppLanguage = 'en' | 'es' | 'fr' | 'ar' | 'ur';

export type AppCurrency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'AED' | 'PKR' | 'SAR';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: AppCurrency;
  language: AppLanguage;
  notificationSettings: {
    notify30Days: boolean;
    notify7Days: boolean;
    notify1Day: boolean;
  };
  onboardingCompleted: boolean;
  isLoggedIn?: boolean;
  createdAt?: string;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'authenticator' | 'sms' | 'email';
  biometricsEnabled?: boolean;
  vaultLocked?: boolean;
  autoLockMinutes?: number;
  recoveryKeyGenerated?: boolean;
}

export type PaymentMethodType = 'credit_card' | 'apple_pay' | 'google_pay' | 'paypal' | 'bank_account';
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  brand?: CardBrand;
  last4: string;
  expMonth?: number;
  expYear?: number;
  cardholderName: string;
  isDefault: boolean;
  billingZip?: string;
  billingCountry?: string;
  createdAt: string;
}

export interface SecuritySession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityAuditLog {
  id: string;
  event: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'security';
}
