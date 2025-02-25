// src/screens/ProfileSetupScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { useAfirmacoes } from '../context/AfirmacoesContext';
import { CheckBox } from 'react-native-elements';

type ProfileSetupScreenNavigationProp = StackNavigationProp<
  RootStackParamList, 
  'ProfileSetup'
>;

interface ProfileSetupScreenProps {
  navigation: ProfileSetupScreenNavigationProp;
}

const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [categoriaSelecionadas, setCategoriaSelecionadas] = useState<string[]>([]);

  const { setPerfil } = useAuth();
  const { categoriasDisponiveis } = useAfirmacoes();

  const toggleCategoria = (categoriaId: string) => {
    setCategoriaSelecionadas(atual => 
      atual.includes(categoriaId)
        ? atual.filter(id => id !== categoriaId)
        : [...atual, categoriaId]
    );
  };

  const validarFormulario = () => {
    return nome.trim() !== '' && 
           email.trim() !== '' && 
           categoriaSelecionadas.length > 0;
  };

  const handleProximo = async () => {
    if (validarFormulario()) {
      await setPerfil({
        nome,
        email,
        categoriaSelecionadas
      });
      navigation.navigate('Payment');
    } else {
      // Mostrar erro de validação
      Alert.alert(
        'Campos Incompletos', 
        'Por favor, preencha todos os campos e selecione pelo menos uma categoria.'
      );
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.titulo}>Configure Seu Perfil</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.subtitulo}>
        Escolha as categorias de afirmações que mais te interessam:
      </Text>

      {categoriasDisponiveis.map((categoria) => (
        <View key={categoria.id} style={styles.checkboxContainer}>
          <CheckBox
            title={categoria.nome}
            checked={categoriaSelecionadas.includes(categoria.id)}
            onPress={() => toggleCategoria(categoria.id)}
            containerStyle={styles.checkbox}
            textStyle={styles.checkboxText}
            checkedColor="#5A31F4"
          />
        </View>
      ))}

      <TouchableOpacity 
        style={[
          styles.botaoProximo,
          !validarFormulario() && styles.botaoDesabilitado
        ]}
        onPress={handleProximo}
        disabled={!validarFormulario()}
      >
        <Text style={styles.botaoTexto}>Próximo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    color: '#666'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15
  },
  label: {
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 10
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  checkboxText: {
    fontWeight: 'normal',
    color: '#333'
  },
  botaoProximo: {
    backgroundColor: '#5A31F4',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  botaoDesabilitado: {
    backgroundColor: '#A0A0A0'
  },
  botaoTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default ProfileSetupScreen;