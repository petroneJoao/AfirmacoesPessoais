// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { useAfirmacoes } from '../context/AfirmacoesContext';
import { StorageService } from '../utils/storage';
import { NotificationService } from '../utils/notifications';
import { PaymentService } from '../utils/paymentService';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList, 
  'Settings'
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { perfil, isAssinanteAtivo } = useAuth();
  const { categoriasDisponiveis } = useAfirmacoes();

  const [notificacoesHabilitadas, setNotificacoesHabilitadas] = useState(true);
  const [horarioNotificacao, setHorarioNotificacao] = useState(new Date());
  const [categoriaSelecionadas, setCategoriaSelecionadas] = useState<string[]>(
    perfil?.categoriaSelecionadas || []
  );
  const [mostrarSelecionadorHora, setMostrarSelecionadorHora] = useState(false);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      const perfilSalvo = await StorageService.carregarPerfil();
      if (perfilSalvo) {
        setCategoriaSelecionadas(perfilSalvo.categoriaSelecionadas || []);
        
        // Configurar horário de notificação
        if (perfilSalvo.horarioNotificacao) {
          const [horas, minutos] = perfilSalvo.horarioNotificacao.split(':').map(Number);
          const novoHorario = new Date();
          novoHorario.setHours(horas, minutos);
          setHorarioNotificacao(novoHorario);
        }
      }
    };

    carregarConfiguracoes();
  }, []);

  const toggleCategoria = (categoriaId: string) => {
    setCategoriaSelecionadas(atual => 
      atual.includes(categoriaId)
        ? atual.filter(id => id !== categoriaId)
        : [...atual, categoriaId]
    );
  };

  const salvarConfiguracoes = async () => {
    try {
      // Atualizar perfil com novas configurações
      await StorageService.salvarPerfil({
        ...perfil!,
        categoriaSelecionadas,
        horarioNotificacao: `${horarioNotificacao.getHours().toString().padStart(2, '0')}:${horarioNotificacao.getMinutes().toString().padStart(2, '0')}`
      });

      // Atualizar notificações
      NotificationService.cancelarTodasNotificacoes();
      NotificationService.scheduleAfirmacaoDiaria();

      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const handleRestaurarCompras = async () => {
    try {
      const restaurado = await PaymentService.restaurarCompras();
      if (restaurado) {
        Alert.alert('Sucesso', 'Compras restauradas com sucesso!');
      } else {
        Alert.alert('Aviso', 'Nenhuma compra encontrada para restaurar.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível restaurar as compras.');
    }
  };

  const handleSairAssinatura = async () => {
    // Implementar lógica de cancelamento de assinatura
    Alert.alert(
      'Cancelar Assinatura', 
      'Entre em contato com nosso suporte para cancelar sua assinatura.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity 
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.tituloPagina}>Configurações</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Perfil</Text>
        <Text style={styles.texto}>Nome: {perfil?.nome}</Text>
        <Text style={styles.texto}>E-mail: {perfil?.email}</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Categorias de Afirmações</Text>
        {categoriasDisponiveis.map((categoria) => (
          <TouchableOpacity 
            key={categoria.id} 
            style={styles.itemCategoria}
            onPress={() => toggleCategoria(categoria.id)}
          >
            <Text style={styles.textoCategoria}>{categoria.nome}</Text>
            <Switch
              value={categoriaSelecionadas.includes(categoria.id)}
              onValueChange={() => toggleCategoria(categoria.id)}
              trackColor={{ false: "#767577", true: "#5A31F4" }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Notificações</Text>
        <View style={styles.itemNotificacao}>
          <Text style={styles.textoNotificacao}>Notificações Diárias</Text>
          <Switch
            value={notificacoesHabilitadas}
            onValueChange={setNotificacoesHabilitadas}
            trackColor={{ false: "#767577", true: "#5A31F4" }}
          />
        </View>

        {notificacoesHabilitadas && (
          <TouchableOpacity 
            style={styles.itemHorario}
            onPress={() => setMostrarSelecionadorHora(true)}
          >
            <Text style={styles.textoNotificacao}>
              Horário da Notificação
            </Text>
            <Text style={styles.horarioTexto}>
              {horarioNotificacao.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </TouchableOpacity>
        )}

        {mostrarSelecionadorHora && (
          <DateTimePicker
            testID="dateTimePicker"
            value={horarioNotificacao}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || horarioNotificacao;
              setMostrarSelecionadorHora(false);
              setHorarioNotificacao(currentDate);
            }}
          />
        )}
      </View>

      {isAssinanteAtivo && (
        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Assinatura</Text>
          <TouchableOpacity 
            style={styles.botaoSecundario}
            onPress={handleRestaurarCompras}
          >
            <Text style={styles.textoBotaoSecundario}>Restaurar Compras</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.botaoAlerta}
            onPress={handleSairAssinatura}
          >
            <Text style={styles.textoBotaoAlerta}>Cancelar Assinatura</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.botaoPrincipal}
        onPress={salvarConfiguracoes}
      >
        <Text style={styles.textoBotaoPrincipal}>Salvar Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
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
    alignItems: 'center',
    marginBottom: 20
  },
  botaoVoltar: {
    marginRight: 15
  },
  tituloPagina: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  secao: {
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
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A31F4',
    marginBottom: 15
  },
  texto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5
  },
  itemCategoria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  textoCategoria: {
    fontSize: 16,
    color: '#333'
  },
  itemNotificacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  textoNotificacao: {
    fontSize: 16,
    color: '#333'
  },
  itemHorario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  horarioTexto: {
    fontSize: 16,
    color: '#5A31F4',
    fontWeight: 'bold'
  },
  botaoSecundario: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#5A31F4',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  textoBotaoSecundario: {
    color: '#5A31F4',
    fontWeight: 'bold'
  },
  botaoAlerta: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center'
  },
  textoBotaoAlerta: {
    color: 'white',
    fontWeight: 'bold'
  },
  botaoPrincipal: {
    backgroundColor: '#5A31F4',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20
  },
  textoBotaoPrincipal: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default SettingsScreen;