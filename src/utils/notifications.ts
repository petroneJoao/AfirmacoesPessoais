// src/utils/notifications.ts
import PushNotification from 'react-native-push-notification';
import { afirmacoes } from '../data/afirmacoes';
import { StorageService } from './storage';

interface Token {
  os: string;
  token: string;
}

interface NotificationObject {
  title?: string;
  message: string;
}

export class NotificationService {
  static configure() {
    PushNotification.configure({
      // Tipagem corrigida para os callbacks
      onRegister: function (token: Token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification: NotificationObject) {
        console.log('NOTIFICATION:', notification);
      },

      onRegistrationError: function(err: { message: string }) {
        console.error(err.message, err);
      },

      // Restante do código permanece igual
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  // Resto do código permanece o mesmo
  static async scheduleAfirmacaoDiaria() {
    // Carregar perfil para obter horário de notificação
    const perfil = await StorageService.carregarPerfil();
    const horario = perfil?.horarioNotificacao || '09:00';

    // Selecionar uma afirmação aleatória
    const afirmacaoAleatoria = afirmacoes[Math.floor(Math.random() * afirmacoes.length)];

    PushNotification.localNotificationSchedule({
      // Mensagem da notificação
      message: afirmacaoAleatoria.texto,
      
      // Título da notificação
      title: 'Sua Afirmação de Hoje',
      
      // Horário da notificação (formato HH:mm)
      date: this.parseHorario(horario),
      
      // Repetir diariamente
      repeatType: 'day',
    });
  }

  private static parseHorario(horario: string): Date {
    const [horas, minutos] = horario.split(':').map(Number);
    const data = new Date();
    data.setHours(horas, minutos, 0, 0);
    return data;
  }

  static cancelarTodasNotificacoes() {
    PushNotification.cancelAllLocalNotifications();
  }

  static mudarHorarioNotificacao(novoHorario: string) {
    // Cancela notificações anteriores
    this.cancelarTodasNotificacoes();
    
    // Agenda nova notificação
    this.scheduleAfirmacaoDiaria();
  }
}