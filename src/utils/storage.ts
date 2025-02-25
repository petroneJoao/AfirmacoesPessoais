// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  nome: string;
  email: string;
  categoriaSelecionadas: string[];
  horarioNotificacao?: string;
}

export interface AssinaturaInfo {
  dataInicio: string;
  dataExpiracao: string;
  ativo: boolean;
}

export class StorageService {
  static async salvarPerfil(perfil: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(perfil));
    } catch (error) {
      console.error('Erro ao salvar perfil', error);
    }
  }

  static async carregarPerfil(): Promise<UserProfile | null> {
    try {
      const perfil = await AsyncStorage.getItem('userProfile');
      return perfil ? JSON.parse(perfil) : null;
    } catch (error) {
      console.error('Erro ao carregar perfil', error);
      return null;
    }
  }

  static async salvarAssinatura(info: AssinaturaInfo): Promise<void> {
    try {
      await AsyncStorage.setItem('userSubscription', JSON.stringify(info));
    } catch (error) {
      console.error('Erro ao salvar assinatura', error);
    }
  }

  static async carregarAssinatura(): Promise<AssinaturaInfo | null> {
    try {
      const assinatura = await AsyncStorage.getItem('userSubscription');
      return assinatura ? JSON.parse(assinatura) : null;
    } catch (error) {
      console.error('Erro ao carregar assinatura', error);
      return null;
    }
  }

  static async salvarAfirmacoesPersonalizadas(afirmacoes: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem('userAffirmations', JSON.stringify(afirmacoes));
    } catch (error) {
      console.error('Erro ao salvar afirmações personalizadas', error);
    }
  }

  static async carregarAfirmacoesPersonalizadas(): Promise<string[]> {
    try {
      const afirmacoes = await AsyncStorage.getItem('userAffirmations');
      return afirmacoes ? JSON.parse(afirmacoes) : [];
    } catch (error) {
      console.error('Erro ao carregar afirmações personalizadas', error);
      return [];
    }
  }
}