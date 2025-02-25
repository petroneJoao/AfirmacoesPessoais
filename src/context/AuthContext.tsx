// src/context/AuthContext.tsx
import React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode 
  } from 'react';
  import { StorageService } from '../utils/storage';
  
  interface UserProfile {
    nome: string;
    email: string;
    categoriaSelecionadas: string[];
  }
  
  interface AuthContextType {
    perfil: UserProfile | null;
    isAssinanteAtivo: boolean;
    setPerfil: (perfil: UserProfile) => Promise<void>;
    verificarAssinatura: () => Promise<boolean>;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [perfil, setPerfil] = useState<UserProfile | null>(null);
    const [isAssinanteAtivo, setIsAssinanteAtivo] = useState(false);
  
    const atualizarPerfil = async (novoPerfil: UserProfile) => {
      await StorageService.salvarPerfil(novoPerfil);
      setPerfil(novoPerfil);
    };
  
    const verificarAssinatura = async () => {
      const assinatura = await StorageService.carregarAssinatura();
      
      if (assinatura && assinatura.ativo) {
        const dataExpiracao = new Date(assinatura.dataExpiracao);
        const estaAtivo = dataExpiracao > new Date();
        
        setIsAssinanteAtivo(estaAtivo);
        return estaAtivo;
      }
      
      setIsAssinanteAtivo(false);
      return false;
    };
  
    // Carregar perfil ao iniciar
    React.useEffect(() => {
      const carregarDados = async () => {
        const perfilSalvo = await StorageService.carregarPerfil();
        if (perfilSalvo) {
          setPerfil(perfilSalvo);
        }
        
        await verificarAssinatura();
      };
  
      carregarDados();
    }, []);
  
    return (
      <AuthContext.Provider 
        value={{ 
          perfil, 
          isAssinanteAtivo, 
          setPerfil: atualizarPerfil,
          verificarAssinatura 
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
  };
  