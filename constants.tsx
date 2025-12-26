
import React from 'react';
import { Role, Task } from './types';
import { 
  Users, 
  DollarSign, 
  Stethoscope, 
  Sparkles
} from 'lucide-react';

export const CLINIC_TASKS: Task[] = [
  // ATENDENTE - ABERTURA
  { id: 'at-1', role: Role.ATENDENTE, category: 'Abertura', text: 'Bater o ponto.' },
  { id: 'at-2', role: Role.ATENDENTE, category: 'Abertura', text: 'Ligar luzes do consultório, ar condicionado da recepção (22º graus), café na máquina, TVs da recepção e brinquedoteca, trocar água do café da brinquedoteca.' },
  { id: 'at-3', role: Role.ATENDENTE, category: 'Abertura', text: 'Conferir limpeza e organização da recepção geral, brinquedoteca e banheiros.' },
  { id: 'at-4', role: Role.ATENDENTE, category: 'Abertura', text: 'Atualizar e carregar maquininhas de cartão.' },
  { id: 'at-5', role: Role.ATENDENTE, category: 'Abertura', text: 'Responder todos os pacientes que entraram em contato fora do expediente.' },
  { id: 'at-6', role: Role.ATENDENTE, category: 'Abertura', text: 'Priorizar mensagens de pacientes com agendamento para o dia.' },
  { id: 'at-7', role: Role.ATENDENTE, category: 'Abertura', text: 'Mandar mensagem de aniversário.' },

  // ATENDENTE - AGENDAMENTOS
  { id: 'at-8', role: Role.ATENDENTE, category: 'Agendamentos', text: 'Verificar se todos os pacientes confirmaram as consultas pelo sistema. Caso contrário, entrar em contato.' },
  { id: 'at-9', role: Role.ATENDENTE, category: 'Agendamentos', text: 'Confirmar com todos os pacientes agendados (mensagem ou ligação) e marcar status no sistema.' },
  { id: 'at-10', role: Role.ATENDENTE, category: 'Agendamentos', text: 'Informar pacientes sem retorno que a consulta está sendo desmarcada por falta de comunicação.' },

  // ATENDENTE - ALMOÇO
  { id: 'at-11', role: Role.ATENDENTE, category: 'Almoço', text: 'Bater ponto na saída e entrada do almoço.' },
  { id: 'at-12', role: Role.ATENDENTE, category: 'Almoço', text: 'Desligar ar condicionado do consultório da Elisama, brinquedoteca, sala da Thays e da recepção geral.' },

  // ATENDENTE - ATENDIMENTO
  { id: 'at-13', role: Role.ATENDENTE, category: 'Atendimento', text: 'Manter conectada com as mensagens dos pacientes durante todo o dia.' },
  { id: 'at-14', role: Role.ATENDENTE, category: 'Atendimento', text: 'Recepcionar os pacientes com cordialidade e acolhimento.' },
  { id: 'at-15', role: Role.ATENDENTE, category: 'Atendimento', text: 'Concluir cadastro do paciente e do representante no sistema.' },
  { id: 'at-16', role: Role.ATENDENTE, category: 'Atendimento', text: 'Coletar anamnese e autorização de imagem, encaminhar para a Bianca e escanear/anexar após a consulta.' },
  { id: 'at-17', role: Role.ATENDENTE, category: 'Atendimento', text: 'Levar o paciente até a recepção, oferecer café/água e avisar a equipe da chegada.' },
  { id: 'at-18', role: Role.ATENDENTE, category: 'Atendimento', text: 'Pós-consulta: perguntar se foi tudo bem e solicitar avaliação no Google via link.' },
  { id: 'at-19', role: Role.ATENDENTE, category: 'Atendimento', text: 'Caso necessário, mandar orientações de pós-consulta.' },
  { id: 'at-20', role: Role.ATENDENTE, category: 'Atendimento', text: 'Marcar ou remanejar horários de pacientes conforme necessário.' },
  { id: 'at-21', role: Role.ATENDENTE, category: 'Atendimento', text: 'Manter cordialidade e acolhimento em todas as mensagens (usar scripts de referência).' },

  // ATENDENTE - REDES SOCIAIS
  { id: 'at-22', role: Role.ATENDENTE, category: 'Redes Sociais', text: 'Responder comentários e mensagens com cordialidade e acolhimento.' },
  { id: 'at-23', role: Role.ATENDENTE, category: 'Redes Sociais', text: 'Estimular engajamento com os seguidores.' },
  { id: 'at-24', role: Role.ATENDENTE, category: 'Redes Sociais', text: 'Tirar dúvidas de procedimentos com profissionais antes de responder redes sociais/WhatsApp.' },

  // ATENDENTE - FECHAMENTO
  { id: 'at-25', role: Role.ATENDENTE, category: 'Fechamento', text: 'Relatório para a Dra. sobre pacientes que não responderam ou não foram localizados.' },
  { id: 'at-26', role: Role.ATENDENTE, category: 'Fechamento', text: 'Checar confirmações e alterações da agenda do dia seguinte.' },
  { id: 'at-27', role: Role.ATENDENTE, category: 'Fechamento', text: 'Caso haja sedação amanhã: pedir salgadinho, refrigerante e flor.' },
  { id: 'at-28', role: Role.ATENDENTE, category: 'Fechamento', text: 'Desligar todas as luzes, TVs e ares-condicionados.' },
  { id: 'at-29', role: Role.ATENDENTE, category: 'Fechamento', text: 'Colocar maquininhas de cartão e tablets para carregar.' },
  { id: 'at-30', role: Role.ATENDENTE, category: 'Fechamento', text: 'Organizar recepção e materiais.' },
  { id: 'at-31', role: Role.ATENDENTE, category: 'Fechamento', text: 'Recolher tapete.' },
  { id: 'at-32', role: Role.ATENDENTE, category: 'Fechamento', text: 'Apagar luzes internas (deixar apenas a externa acesa).' },
  { id: 'at-33', role: Role.ATENDENTE, category: 'Fechamento', text: 'Ligar alarme e trancar as duas portas.' },

  // FINANCEIRO - Waiting for user items
  // ASB - Waiting for user items
];

export const ROLE_CONFIG = {
  [Role.ATENDENTE]: {
    icon: <Users className="w-6 h-6" />,
    color: 'bg-pink-400',
    lightColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200'
  },
  [Role.FINANCEIRO]: {
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-blue-400',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  [Role.ASB]: {
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'bg-green-400',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  }
};
