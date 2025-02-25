// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Modal,
  TextInput
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { useAfirmacoes } from '../context/AfirmacoesContext';
import { Afirmacao, categorias } from '../data/afirmacoes';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList, 
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { perfil } = useAuth();
  const { 
    afirmacoesPadrao, 
    categoriasDisponiveis,
    adicionarAfirmacaoPersonalizada,
    afirmacoesPersonalizadas
  } = useAfirmacoes();

  const [afirmacoesExibidas, setAfirmacoesExibidas] = useState<Afirmacao[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaAfirmacao, setNovaAfirmacao] = useState('');

  // Animação de escala
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }]
    };
  });

  useEffect(() => {
    // Filtrar afirmações baseadas nas categorias selecionadas pelo usuário
    const afirmacoesFiltradas = afirmacoesPadrao.filter(
      afirmacao => perfil?.categoriaSelecionadas.includes(afirmacao.categoria)
    );

    // Adicionar afirmações personalizadas
    const todasAfirmacoes: Afirmacao[] = [
  ...afirmacoesFiltradas,
  ...afirmacoesPersonalizadas.map(texto => ({
    id: `personalizada_${texto.replace(/\s+/g, '_').toLowerCase()}`, // Cria um ID único
    texto,
    categoria: 'personalizada' as const
  }))
];

    setAfirmacoesExibidas(todasAfirmacoes);
  }, [perfil, afirmacoesPadrao, afirmacoesPersonalizadas]);

  const handleAdicionarAfirmacao = async () => {
    if (novaAfirmacao.trim() !== '') {
      await adicionarAfirmacaoPersonalizada(novaAfirmacao);
      setNovaAfirmacao('');
      setModalVisivel(false);
    }
  };

  const renderAfirmacao = ({ item }: { item: Afirmacao }) => {
    const categoriaInfo = categoriasDisponiveis.find(
      cat => cat.id === item.categoria
    );

    return (
      <Animated.View 
        style={[styles.afirmacaoContainer, animatedStyle]}
        onTouchStart={() => scale.value = 0.95}
        onTouchEnd={() => scale.value = 1}
      >
        <Text style={styles.afirmacaoTexto}>{item.texto}</Text>
        <View style={styles.afirmacaoRodape}>
          <Text style={styles.categoriaTexto}>
            {categoriaInfo?.nome || 'Personalizada'}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.boasVindas}>
          Olá, {perfil?.nome?.split(' ')[0] || 'Usuário'}
        </Text>
        <TouchableOpacity 
          style={styles.botaoConfiguracoes}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Suas Afirmações de Hoje</Text>

      <FlatList
        data={afirmacoesExibidas}
        renderItem={renderAfirmacao}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaAfirmacoes}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.botaoAdicionar}
        onPress={() => setModalVisivel(true)}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>
              Adicionar Nova Afirmação
            </Text>
            <TextInput
              style={styles.modalInput}
              multiline
              placeholder="Digite sua afirmação positiva"
              value={novaAfirmacao}
              onChangeText={setNovaAfirmacao}
            />
            <View style={styles.modalBotoesContainer}>
              <TouchableOpacity 
                style={styles.modalBotaoCancelar}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalBotaoSalvar}
                onPress={handleAdicionarAfirmacao}
              >
                <Text style={styles.modalBotaoSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  boasVindas: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  botaoConfiguracoes: {
    padding: 10
  },
  subtitulo: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15
  },
  listaAfirmacoes: {
    paddingBottom: 20
  },
  afirmacaoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  afirmacaoTexto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  afirmacaoRodape: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  categoriaTexto: {
    fontSize: 14,
    color: '#5A31F4',
    fontWeight: 'bold'
  },
  botaoAdicionar: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#5A31F4',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalConteudo: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top'
  },
  modalBotoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalBotaoCancelar: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#5A31F4'
  },
  modalBotaoCancelarTexto: {
    color: '#5A31F4',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalBotaoSalvar: {
    flex: 1,
    backgroundColor: '#5A31F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25
  },
  modalBotaoSalvarTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default HomeScreen;