// src/@types/react-native-iap.d.ts
declare module 'react-native-iap' {
    export interface Product {
      productId: string;
      price: string;
      currency: string;
      localizedPrice: string;
      title?: string;
      description?: string;
    }
  
    export interface Purchase {
      productId: string;
      transactionDate: string;
      transactionId: string;
      originalTransactionDate?: string;
      originalTransactionId?: string;
    }
  
    export interface SubscriptionPurchase extends Purchase {
      // Propriedades específicas de assinatura, se necessário
    }
  
    export interface ProductPurchase extends Purchase {
      // Propriedades específicas de compra de produto
    }
  
    export class PurchaseError extends Error {
      code?: string;
      message: string;
    }
  
    export function initConnection(): Promise<void>;
    export function endConnection(): Promise<void>;
    export function getSubscriptions(skus: string[]): Promise<Product[]>;
    export function requestSubscription(sku: string): Promise<Purchase>;
    export function getAvailablePurchases(): Promise<Purchase[]>;
  }