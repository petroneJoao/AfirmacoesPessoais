// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { NotificationService } from './src/utils/notifications';
import { PaymentService } from './src/utils/paymentService';

const App = () => {
  useEffect(() => {
    // Configurações iniciais
    const inicializarApp = async () => {
      // Configurar notificações
      NotificationService.configure();

      // Conectar serviço de pagamento
      await PaymentService.conectar();

      // Agendar primeira notificação diária
      NotificationService.scheduleAfirmacaoDiaria();
    };

    inicializarApp();

    // Limpeza ao desmontar
    return () => {
      PaymentService.encerrarConexao();
    };
  }, []);

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#F5F5F5" 
      />
      <AppNavigator />
    </>
  );
};

export default App;