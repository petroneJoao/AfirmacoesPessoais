// src/screens/PaymentScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  Alert 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { PaymentService } from '../utils/paymentService';
import { useAuth } from '../context/AuthContext';
import LottieView from 'lottie-react-native';

type PaymentScreenNavigationProp = StackNavigationProp<
  RootStackParamList, 
  'Payment'
>;

interface PaymentScreenProps {
  navigation: PaymentScreenNavigationProp;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation }) => {
  const [produto, setProduto] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const { verificarAssinatura } = useAuth();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const produtoAssinatura = await PaymentService.verificarAssinatura();
        setProduto(produtoAssinatura);
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao carregar produtos', error);
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  const handleComprarAssinatura = async () => {
    try {
      setCarregando(true);
      await PaymentService.comprarAssinatura();
      
      // Verificar status da assinatura
      const assinaturaAtiva = await verificarAssinatura();
      
      if (assinaturaAtiva) {
        navigation.navigate('Home');
      } else {
        Alert.alert(
          'Erro na Assinatura', 
          'Não foi possível confirmar sua assinatura. Por favor, tente novamente.'
        );}} catch (error) {
            console.error('Erro ao comprar assinatura', error);
            Alert.alert(
              'Erro de Pagamento', 
              'Não foi possível processar sua assinatura. Por favor, tente novamente.'
            );
          } finally {
            setCarregando(false);
          }
        };
      
        const handleRestaurarCompras = async () => {
          try {
            setCarregando(true);
            const comprasRestauradas = await PaymentService.restaurarCompras();
            
            if (comprasRestauradas) {
              navigation.navigate('Home');
            } else {
              Alert.alert(
                'Restaurar Compras', 
                'Nenhuma assinatura anterior encontrada.'
              );
            }
          } catch (error) {
            console.error('Erro ao restaurar compras', error);
            Alert.alert(
              'Erro', 
              'Não foi possível restaurar suas compras. Por favor, tente novamente.'
            );
          } finally {
            setCarregando(false);
          }
        };
      
        if (carregando) {
          return (
            <View style={styles.carregandoContainer}>
              <LottieView
                source={require('../assets/animations/loading.json')}
                autoPlay
                loop
                style={styles.animacao}
              />
            </View>
          );
        }
      
        return (
          <View style={styles.container}>
            <Text style={styles.titulo}>Desbloqueie o Poder das Afirmações</Text>
            
            <View style={styles.planoContainer}>
              <Text style={styles.planoTitulo}>Plano Anual</Text>
              <Text style={styles.planoDetalhes}>
                3 dias grátis, depois {produto?.localizedPrice || 'R$ 49,99'}/ano
              </Text>
              
              <View style={styles.beneficiosContainer}>
                <Text style={styles.beneficioTexto}>✓ Afirmações diárias ilimitadas</Text>
                <Text style={styles.beneficioTexto}>✓ Personalização completa</Text>
                <Text style={styles.beneficioTexto}>✓ Notificações motivacionais</Text>
                <Text style={styles.beneficioTexto}>✓ Cancelamento a qualquer momento</Text>
              </View>
            </View>
      
            <TouchableOpacity 
              style={styles.botaoAssinar}
              onPress={handleComprarAssinatura}
            >
              <Text style={styles.botaoTexto}>Começar Assinatura Grátis</Text>
            </TouchableOpacity>
      
            <TouchableOpacity 
              style={styles.botaoRestaurar}
              onPress={handleRestaurarCompras}
            >
              <Text style={styles.botaoRestaurarTexto}>
                {Platform.OS === 'ios' 
                  ? 'Restaurar Compras do iOS' 
                  : 'Restaurar Compras do Google Play'}
              </Text>
            </TouchableOpacity>
      
            <Text style={styles.avisoTexto}>
              Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade. 
              A assinatura será renovada automaticamente. Você pode cancelar a qualquer momento.
            </Text>
          </View>
        );
      };
      
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          padding: 20
        },
        carregandoContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5F5F5'
        },
        animacao: {
          width: 200,
          height: 200
        },
        titulo: {
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginVertical: 20,
          color: '#333'
        },
        planoContainer: {
          backgroundColor: 'white',
          borderRadius: 15,
          padding: 20,
          width: '100%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
          marginBottom: 20
        },
        planoTitulo: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#5A31F4',
          marginBottom: 10
        },
        planoDetalhes: {
          fontSize: 16,
          color: '#666',
          marginBottom: 15
        },
        beneficiosContainer: {
          marginTop: 10
        },
        beneficioTexto: {
          fontSize: 16,
          color: '#333',
          marginBottom: 8,
          paddingLeft: 10
        },
        botaoAssinar: {
          backgroundColor: '#5A31F4',
          paddingVertical: 15,
          paddingHorizontal: 50,
          borderRadius: 25,
          width: '100%',
          alignItems: 'center',
          marginBottom: 15
        },
        botaoTexto: {
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold'
        },
        botaoRestaurar: {
          marginBottom: 20
        },
        botaoRestaurarTexto: {
          color: '#5A31F4',
          fontSize: 16
        },
        avisoTexto: {
          fontSize: 12,
          color: '#666',
          textAlign: 'center',
          marginTop: 10
        }
      });
      
      export default PaymentScreen;