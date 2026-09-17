import { Receipt, WarrantyItem } from '../types';
import { getFallbackProductImage, DEFAULT_PRODUCT_IMAGES } from '../utils/imageFallbacks';

export function generateReceiptSvg(store: string, date: string, total: number, items: { name: string; price: number }[]): string {
  const itemsSvg = items
    .map(
      (it, idx) => `
    <text x="24" y="${180 + idx * 26}" font-family="monospace" font-size="12" fill="#334155">${it.name.substring(0, 24)}</text>
    <text x="320" y="${180 + idx * 26}" font-family="monospace" font-size="12" text-anchor="end" font-weight="bold" fill="#0f172a">$${it.price.toFixed(2)}</text>
  `
    )
    .join('');

  const barcodeSvg = Array.from({ length: 42 })
    .map((_, i) => {
      const width = (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1);
      return `<rect x="${30 + i * 7}" y="390" width="${width}" height="38" fill="#1e293b"/>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 480" width="100%" height="100%">
    <defs>
      <filter id="paper-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/>
      </filter>
    </defs>
    <!-- Thermal paper jagged edge top -->
    <path d="M 10,10 L 340,10 L 340,460 L 330,470 L 320,460 L 310,470 L 300,460 L 290,470 L 280,460 L 270,470 L 260,460 L 250,470 L 240,460 L 230,470 L 220,460 L 210,470 L 200,460 L 190,470 L 180,460 L 170,470 L 160,460 L 150,470 L 140,460 L 130,470 L 120,460 L 110,470 L 100,460 L 90,470 L 80,460 L 70,470 L 60,460 L 50,470 L 40,460 L 30,470 L 20,460 L 10,470 Z" fill="#ffffff" filter="url(#paper-shadow)" stroke="#e2e8f0" stroke-width="1"/>
    
    <!-- Store Header -->
    <text x="175" y="55" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#0f172a">${store.toUpperCase()}</text>
    <text x="175" y="75" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#64748b">OFFICIAL STORE RECEIPT • VERIFIED</text>
    <text x="175" y="92" font-family="monospace" font-size="11" text-anchor="middle" fill="#475569">DATE: ${date}  |  REG #04</text>
    
    <!-- Dashed separator -->
    <line x1="24" y1="108" x2="326" y2="108" stroke="#cbd5e1" stroke-dasharray="4,4" stroke-width="1.5"/>
    <text x="24" y="130" font-family="monospace" font-size="11" font-weight="bold" fill="#64748b">ITEM DESCRIPTION</text>
    <text x="320" y="130" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end" fill="#64748b">AMOUNT</text>
    <line x1="24" y1="140" x2="326" y2="140" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Items -->
    ${itemsSvg}

    <!-- Total Section -->
    <line x1="24" y1="310" x2="326" y2="310" stroke="#cbd5e1" stroke-dasharray="4,4" stroke-width="1.5"/>
    <text x="24" y="335" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">TOTAL AMOUNT</text>
    <text x="320" y="335" font-family="sans-serif" font-size="18" font-weight="800" text-anchor="end" fill="#0f172a">$${total.toFixed(2)}</text>
    <text x="175" y="360" font-family="sans-serif" font-size="9" text-anchor="middle" fill="#94a3b8">WARRANTY TRACKED BY RECEIPTMIND AI</text>

    <!-- Barcode -->
    ${barcodeSvg}
    <text x="175" y="445" font-family="monospace" font-size="10" text-anchor="middle" fill="#64748b">RM-${Math.abs(store.length * 1024 + total).toString().padStart(8, '0')}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const initialReceipts: Receipt[] = [
  {
    id: 'rcpt_1',
    store_name: 'Apple Fifth Avenue',
    storeLogoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-20',
    items: [
      {
        id: 'item_1_1',
        name: 'MacBook Pro 16" M3 Max 36GB',
        price: 3499.0,
        category: 'Electronics',
        likely_has_warranty: true,
        estimated_warranty_months: 12,
        serial_number: 'C02G91J4MD6R',
        notes: 'Includes 1-Year Limited Hardware Warranty and 90-day complimentary support.',
        productImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'item_1_2',
        name: '140W USB-C Power Adapter',
        price: 99.0,
        category: 'Electronics',
        likely_has_warranty: true,
        estimated_warranty_months: 12,
        productImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'item_1_3',
        name: 'Magic Trackpad - Black',
        price: 149.0,
        category: 'Electronics',
        likely_has_warranty: true,
        estimated_warranty_months: 12,
        productImageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 3747.0,
    tax: 332.55,
    total: 4079.55,
    currency: 'USD',
    payment_method: 'Apple Pay (Mastercard •••• 8821)',
    notes: 'Bought for design and mobile dev work. Covered by standard manufacturer warranty.',
    tags: ['Apple', 'Hardware', 'WorkSetup', 'TaxDeductible'],
    isInsuranceBacked: true,
    createdAt: '2026-08-20T14:32:00Z',
    receiptPhotoUrl: 'https://images.unsplash.com/photo-1554415707-9e4466a01534?w=800&auto=format&fit=crop&q=80',
    imageUrl: generateReceiptSvg('Apple Fifth Avenue', '2026-08-20', 4079.55, [
      { name: 'MacBook Pro 16" M3 Max', price: 3499.0 },
      { name: '140W USB-C Adapter', price: 99.0 },
      { name: 'Magic Trackpad Black', price: 149.0 },
    ]),
  },
  {
    id: 'rcpt_2',
    store_name: 'The Home Depot #1204',
    storeLogoUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=120&auto=format&fit=crop&q=80',
    date: '2026-09-02',
    items: [
      {
        id: 'item_2_1',
        name: 'DeWalt 20V MAX Brushless Hammer Drill Kit',
        price: 249.0,
        category: 'Home & Furniture',
        likely_has_warranty: true,
        estimated_warranty_months: 36,
        serial_number: 'DW-991823-B',
        notes: '3-Year Limited Warranty with 1-Year Free Service Contract.',
        productImageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'item_2_2',
        name: 'Titanium Drill Bit 29-Pc Set',
        price: 49.97,
        category: 'Other',
        likely_has_warranty: false,
        estimated_warranty_months: 0,
        productImageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 298.97,
    tax: 25.41,
    total: 324.38,
    currency: 'USD',
    payment_method: 'Visa •••• 4129',
    notes: 'Home renovation project tools.',
    tags: ['Tools', 'HomeImprovement', 'Workshop', 'DeWalt'],
    isInsuranceBacked: true,
    createdAt: '2026-09-02T10:15:00Z',
    receiptPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    imageUrl: generateReceiptSvg('The Home Depot', '2026-09-02', 324.38, [
      { name: 'DeWalt 20V Drill Kit', price: 249.0 },
      { name: 'Titanium Drill Bits', price: 49.97 },
    ]),
  },
  {
    id: 'rcpt_3',
    store_name: 'Best Buy Electronics',
    storeLogoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-10',
    items: [
      {
        id: 'item_3_1',
        name: 'Sony 65" BRAVIA XR OLED 4K HDR TV',
        price: 1899.99,
        category: 'Electronics',
        likely_has_warranty: true,
        estimated_warranty_months: 24,
        serial_number: 'SNY-65A80L-882',
        notes: '2-Year manufacturer panel & parts warranty.',
        productImageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'item_3_2',
        name: 'AudioQuest 4K-8K HDMI Cable 2m',
        price: 39.99,
        category: 'Electronics',
        likely_has_warranty: true,
        estimated_warranty_months: 12,
        productImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 1939.98,
    tax: 164.9,
    total: 2104.88,
    currency: 'USD',
    payment_method: 'Amex •••• 1004',
    tags: ['Electronics', 'HomeTheater', 'LivingRoom', 'Sony'],
    isInsuranceBacked: true,
    createdAt: '2026-08-10T16:45:00Z',
    receiptPhotoUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
    imageUrl: generateReceiptSvg('Best Buy', '2026-08-10', 2104.88, [
      { name: 'Sony 65" BRAVIA OLED TV', price: 1899.99 },
      { name: 'AudioQuest HDMI Cable', price: 39.99 },
    ]),
  },
  {
    id: 'rcpt_4',
    store_name: 'Dyson Flagship Store',
    storeLogoUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=120&auto=format&fit=crop&q=80',
    date: '2026-07-28',
    items: [
      {
        id: 'item_4_1',
        name: 'Dyson V15 Detect Cordless Vacuum',
        price: 749.99,
        category: 'Home & Furniture',
        likely_has_warranty: true,
        estimated_warranty_months: 24,
        serial_number: 'DYS-V15-3910A',
        notes: '2-Year Dyson official warranty on parts and labor.',
        productImageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 749.99,
    tax: 63.75,
    total: 813.74,
    currency: 'USD',
    payment_method: 'Apple Pay (Visa •••• 9012)',
    tags: ['Appliances', 'Cleaning', 'Home', 'Dyson'],
    isInsuranceBacked: true,
    createdAt: '2026-07-28T12:00:00Z',
    receiptPhotoUrl: 'https://images.unsplash.com/photo-1554415707-9e4466a01534?w=800&auto=format&fit=crop&q=80',
    imageUrl: generateReceiptSvg('Dyson Flagship', '2026-07-28', 813.74, [
      { name: 'Dyson V15 Vacuum', price: 749.99 },
    ]),
  },
  {
    id: 'rcpt_5',
    store_name: 'Whole Foods Market',
    storeLogoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
    date: '2026-09-06',
    items: [
      {
        id: 'item_5_1',
        name: 'Organic Artisanal Sourdough',
        price: 7.99,
        category: 'Groceries',
        likely_has_warranty: false,
        estimated_warranty_months: 0,
        productImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'item_5_2',
        name: 'Cold Pressed Olive Oil 750ml',
        price: 18.5,
        category: 'Groceries',
        likely_has_warranty: false,
        estimated_warranty_months: 0,
        productImageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'item_5_3',
        name: 'Wild Caught Alaskan Salmon 1.2lb',
        price: 24.99,
        category: 'Groceries',
        likely_has_warranty: false,
        estimated_warranty_months: 0,
        productImageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 51.48,
    tax: 3.12,
    total: 54.6,
    currency: 'USD',
    payment_method: 'Apple Pay (Visa •••• 4921)',
    tags: ['Groceries', 'Organic', 'WeeklyFood', 'Healthy'],
    createdAt: '2026-09-06T18:20:00Z',
    receiptPhotoUrl: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=800&auto=format&fit=crop&q=80',
    imageUrl: generateReceiptSvg('Whole Foods', '2026-09-06', 54.6, [
      { name: 'Organic Sourdough', price: 7.99 },
      { name: 'Olive Oil 750ml', price: 18.5 },
      { name: 'Wild Alaskan Salmon', price: 24.99 },
    ]),
  },
  {
    id: 'rcpt_6',
    store_name: 'Zara Men Fifth Ave',
    storeLogoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&auto=format&fit=crop&q=80',
    date: '2026-08-28',
    items: [
      {
        id: 'item_6_1',
        name: 'Structured Wool Blend Blazer',
        price: 189.0,
        category: 'Clothing',
        likely_has_warranty: false,
        estimated_warranty_months: 0,
        notes: '30-day return policy with original tags.',
        productImageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'item_6_2',
        name: 'Pleated Tailored Trousers',
        price: 79.9,
        category: 'Clothing',
        likely_has_warranty: false,
        estimated_warranty_months: 0,
        productImageUrl: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format&fit=crop&q=80',
      },
    ],
    subtotal: 268.9,
    tax: 23.53,
    total: 292.43,
    currency: 'USD',
    payment_method: 'Mastercard •••• 7712',
    tags: ['Clothing', 'Wardrobe', 'BusinessCasual', 'Apparel'],
    createdAt: '2026-08-28T15:30:00Z',
    receiptPhotoUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80',
    imageUrl: generateReceiptSvg('Zara Men', '2026-08-28', 292.43, [
      { name: 'Wool Blend Blazer', price: 189.0 },
      { name: 'Tailored Trousers', price: 79.9 },
    ]),
  },
];

// Calculate warranty items dynamically based on current date
export function computeWarrantiesFromReceipts(receipts: Receipt[], currentDate = new Date('2026-09-09')): WarrantyItem[] {
  const warranties: WarrantyItem[] = [];

  for (const receipt of receipts) {
    for (const item of receipt.items) {
      if (item.likely_has_warranty && item.estimated_warranty_months > 0) {
        const purchase = new Date(receipt.date);
        const expiry = new Date(purchase);
        expiry.setMonth(expiry.getMonth() + item.estimated_warranty_months);

        const diffTime = expiry.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status: 'safe' | 'warning' | 'critical' | 'expired';
        if (daysRemaining < 0) {
          status = 'expired';
        } else if (daysRemaining <= 7) {
          status = 'critical';
        } else if (daysRemaining <= 30) {
          status = 'warning';
        } else {
          status = 'safe';
        }

        warranties.push({
          id: `warr_${receipt.id}_${item.id}`,
          receiptId: receipt.id,
          itemName: item.name,
          storeName: receipt.store_name,
          purchaseDate: receipt.date,
          expiryDate: expiry.toISOString().split('T')[0],
          months: item.estimated_warranty_months,
          price: item.price,
          category: item.category,
          status,
          daysRemaining,
          receiptImageUrl: receipt.receiptPhotoUrl || receipt.imageUrl || DEFAULT_PRODUCT_IMAGES.receipt,
          productImageUrl: item.productImageUrl || getFallbackProductImage(item.name, item.category),
          serialNumber: item.serial_number,
          notes: item.notes,
          claimPolicyUrl: `https://www.google.com/search?q=${encodeURIComponent(receipt.store_name + ' ' + item.name + ' warranty return policy')}`,
        });
      }
    }
  }

  // Sort by urgency: shortest days remaining first
  return warranties.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
