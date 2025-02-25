// src/utils/paymentService.ts
import RNIap, { 
    Product, 
    Purchase, 
    PurchaseError,
    SubscriptionPurchase,
    ProductPurchase
  } from 'react-native-iap';
  import { StorageService, AssinaturaInfo } from '../utils/storage';
  
  // SKUs das assinaturas (configurar no Google Play e App Store)
  export const ANNUAL_SUB_SKU = 'br.com.afirmacoes.anual';
  
  export class PaymentService {
    static async conectar() {
      try {
        await RNIap.initConnection();
        console.log('Conexão com IAP estabelecida');
      } catch (error) {
        console.error('Erro ao conectar IAP', error);
      }
    }
  
    static async verificarAssinatura(): Promise<Product | null> {
      try {
        const produtos = await RNIap.getSubscriptions([ANNUAL_SUB_SKU]);
        console.log('Produtos disponíveis:', produtos);
        return produtos[0] || null;
      } catch (error) {
        console.error('Erro ao verificar assinaturas', error);
        return null;
      }
    }
  
    static async comprarAssinatura(): Promise<Purchase | ProductPurchase | SubscriptionPurchase> {
      try {
        const compra = await RNIap.requestSubscription(ANNUAL_SUB_SKU);
        
        // Salvar detalhes da assinatura
        const infoAssinatura: AssinaturaInfo = {
          dataInicio: new Date().toISOString(),
          dataExpiracao: this.calcularDataExpiracao(),
          ativo: true
        };
  
        await StorageService.salvarAssinatura(infoAssinatura);
  
        return compra;
      } catch (error) {
        if (error instanceof PurchaseError) {
          console.error('Erro na compra:', error.message);
        }
        throw error;
      }
    }
  
    static async restaurarCompras(): Promise<boolean> {
      try {
        const compras = await RNIap.getAvailablePurchases();
        
        // Verifica se há assinaturas ativas
        const assinaturasValidas = compras.filter(
          compra => this.isAssinaturaValida(compra)
        );
  
        if (assinaturasValidas.length > 0) {
          // Salva a assinatura mais recente
          const infoAssinatura: AssinaturaInfo = {
            dataInicio: assinaturasValidas[0].transactionDate,
            dataExpiracao: this.calcularDataExpiracao(),
            ativo: true
          };
  
          await StorageService.salvarAssinatura(infoAssinatura);
  
          return true;
        }
  
        return false;
      } catch (error) {
        console.error('Erro ao restaurar compras', error);
        return false;
      }
    }
  
    private static calcularDataExpiracao(): string {
      const dataAtual = new Date();
      const dataExpiracao = new Date(dataAtual);
      dataExpiracao.setFullYear(dataAtual.getFullYear() + 1);
      return dataExpiracao.toISOString();
    }
  
    private static isAssinaturaValida(compra: Purchase): boolean {
      // Lógica para verificar se a assinatura ainda está ativa
      const dataAtual = new Date();
      const dataExpiracao = new Date(compra.transactionDate);
      dataExpiracao.setFullYear(dataExpiracao.getFullYear() + 1);
  
      return dataExpiracao > dataAtual;
    }
  
    static async encerrarConexao() {
      await RNIap.endConnection();
    }
  }