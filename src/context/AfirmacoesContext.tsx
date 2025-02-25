 // src/context/AfirmacoesContext.tsx
 import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect, 
    ReactNode 
  } from 'react';
 import { Afirmacao, afirmacoes, categorias } from '../data/afirmacoes';
 import { StorageService } from '../utils/storage';
 
 interface AfirmacoesContextType {
   afirmacoesPadrao: Afirmacao[];
   categoriasDisponiveis: typeof categorias;
   afirmacoesPersonalizadas: string[];
   adicionarAfirmacaoPersonalizada: (afirmacao: string) => Promise<void>;
   removerAfirmacaoPersonalizada: (afirmacao: string) => Promise<void>;
 }
 
 const AfirmacoesContext = createContext<AfirmacoesContextType | undefined>(undefined);
 
 export const AfirmacoesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [afirmacoesPersonalizadas, setAfirmacoesPersonalizadas] = useState<string[]>([]);
 
   // Carregar afirmações personalizadas ao iniciar
   React.useEffect(() => {
     const carregarAfirmacoes = async () => {
       const afirmacoesSalvas = await StorageService.carregarAfirmacoesPersonalizadas();
       setAfirmacoesPersonalizadas(afirmacoesSalvas);
     };
 
     carregarAfirmacoes();
   }, []);
 
   const adicionarAfirmacaoPersonalizada = async (afirmacao: string) => {
     const novasAfirmacoes = [...afirmacoesPersonalizadas, afirmacao];
     await StorageService.salvarAfirmacoesPersonalizadas(novasAfirmacoes);
     setAfirmacoesPersonalizadas(novasAfirmacoes);
   };
 
   const removerAfirmacaoPersonalizada = async (afirmacao: string) => {
     const novasAfirmacoes = afirmacoesPersonalizadas.filter(a => a !== afirmacao);
     await StorageService.salvarAfirmacoesPersonalizadas(novasAfirmacoes);
     setAfirmacoesPersonalizadas(novasAfirmacoes);
   };
 
   return (
     <AfirmacoesContext.Provider 
       value={{ 
         afirmacoesPadrao: afirmacoes,
         categoriasDisponiveis: categorias,
         afirmacoesPersonalizadas,
         adicionarAfirmacaoPersonalizada,
         removerAfirmacaoPersonalizada 
       }}
     >
       {children}
     </AfirmacoesContext.Provider>
   );
 };
 
 export const useAfirmacoes = () => {
   const context = useContext(AfirmacoesContext);
   if (context === undefined) {
     throw new Error('useAfirmacoes deve ser usado dentro de um AfirmacoesProvider');
   }
   return context;
 };