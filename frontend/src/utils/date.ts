import { format as dateFnsFormat } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const format = (date: Date | string | number, formatStr: string) => {
  return dateFnsFormat(typeof date === 'string' ? new Date(date) : date, formatStr, { locale: zhCN });
};

export const formatDate = (date: Date | string) => {
  return format(date, 'yyyy年M月d日');
};

export const formatDateTime = (date: Date | string) => {
  return format(date, 'yyyy年M月d日 HH:mm');
};

