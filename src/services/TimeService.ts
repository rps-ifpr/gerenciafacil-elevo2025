export class TimeService {
  private static instance: TimeService;
  
  private constructor() {}

  static getInstance(): TimeService {
    if (!TimeService.instance) {
      TimeService.instance = new TimeService();
    }
    return TimeService.instance;
  }

  getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

export const timeService = TimeService.getInstance();