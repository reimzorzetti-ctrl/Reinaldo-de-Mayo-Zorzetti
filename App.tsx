
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Role, TaskState, StorageState } from './types';
import { CLINIC_TASKS, ROLE_CONFIG } from './constants';
import { Clock, Calendar as CalendarIcon, Sparkles, Bell, BellOff, Info, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'sorriso_kids_checklist';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<Role>(Role.ATENDENTE);
  const [taskState, setTaskState] = useState<TaskState>({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lastNotifiedDate, setLastNotifiedDate] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // Load state from localStorage
  const loadState = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state: StorageState = JSON.parse(stored);
      setTaskState(state.tasks || {});
      setNotificationsEnabled(state.notificationsEnabled || false);
      setLastNotifiedDate(state.lastNotificationDate || null);
      return state;
    }
    return null;
  }, []);

  const saveState = useCallback((
    tasks: TaskState, 
    notifEnabled?: boolean, 
    lastNotifDate?: string | null,
    resetTime?: string
  ) => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const newState: StorageState = {
      tasks,
      lastReset: resetTime || existing.lastReset || new Date().toISOString(),
      notificationsEnabled: notifEnabled !== undefined ? notifEnabled : existing.notificationsEnabled,
      lastNotificationDate: lastNotifDate !== undefined ? lastNotifDate : existing.lastNotificationDate
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  // Notification logic
  const triggerNotification = useCallback((roleName: string) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const messages = [
      `Bom dia! ☀️ Os checklists de ${roleName} já estão disponíveis. Vamos começar?`,
      `Olá! 🦷 Hora de iniciar as tarefas de ${roleName}. Tenha um ótimo dia!`,
      `Checklist disponível! ✅ Não esqueça de ticar suas tarefas de ${roleName} hoje.`
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

    new Notification("Sorriso Kids", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/3467/3467831.png", // Child-friendly dental icon
    });
  }, []);

  const checkNotifications = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayStr = now.toISOString().split('T')[0];
    
    // Only Mon-Fri (1-5)
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;

    if (isWeekday && notificationsEnabled && currentHour >= 8 && lastNotifiedDate !== todayStr) {
      triggerNotification(activeRole);
      setLastNotifiedDate(todayStr);
      saveState(taskState, notificationsEnabled, todayStr);
    }
  }, [notificationsEnabled, lastNotifiedDate, activeRole, taskState, triggerNotification, saveState]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Este navegador não suporta notificações.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      saveState(taskState, true);
      setShowNotificationPrompt(false);
      triggerNotification(activeRole);
    } else {
      setNotificationsEnabled(false);
      saveState(taskState, false);
    }
  };

  // Logic to determine if we should reset (Every day at 20h, Mon-Fri)
  const checkAndReset = useCallback(() => {
    const now = new Date();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const state: StorageState = JSON.parse(stored);
    const lastResetDate = new Date(state.lastReset);
    
    const resetTimeToday = new Date(now);
    resetTimeToday.setHours(20, 0, 0, 0);

    const isPast20h = now.getTime() >= resetTimeToday.getTime();
    const wasLastResetBefore20hToday = lastResetDate.getTime() < resetTimeToday.getTime();
    const day = now.getDay();
    const isWeekday = day >= 1 && day <= 5;

    if (isWeekday && isPast20h && wasLastResetBefore20hToday) {
      setTaskState({});
      saveState({}, undefined, undefined, now.toISOString());
      return;
    }

    const lastResetDay = lastResetDate.toDateString();
    const currentDay = now.toDateString();
    if (currentDay !== lastResetDay) {
      setTaskState({});
      saveState({}, undefined, undefined, now.toISOString());
    }
  }, [saveState]);

  useEffect(() => {
    loadState();
    checkAndReset();
    
    // Check permission status on load
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(() => setShowNotificationPrompt(true), 2000);
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkAndReset();
      checkNotifications();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAndReset, checkNotifications, loadState]);

  const toggleTask = (taskId: string) => {
    const newState = {
      ...taskState,
      [taskId]: !taskState[taskId]
    };
    setTaskState(newState);
    saveState(newState);
  };

  const currentRoleTasks = useMemo(() => 
    CLINIC_TASKS.filter(t => t.role === activeRole), 
  [activeRole]);

  const progress = useMemo(() => {
    const total = currentRoleTasks.length;
    const completed = currentRoleTasks.filter(t => taskState[t.id]).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [currentRoleTasks, taskState]);

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-white shadow-2xl relative overflow-hidden flex flex-col">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full translate-x-1/2 translate-y-1/2 opacity-30 pointer-events-none"></div>

      {/* Permission Bar */}
      {showNotificationPrompt && (
        <div className="bg-blue-600 text-white p-3 flex items-center justify-between text-xs animate-bounce shadow-lg relative z-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="font-semibold">Ativar lembretes diários (8h)?</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowNotificationPrompt(false)} className="px-2 py-1 opacity-70">Agora não</button>
            <button onClick={requestNotificationPermission} className="bg-white text-blue-600 px-3 py-1 rounded-full font-bold">Ativar</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-500 to-blue-400 p-2.5 rounded-2xl rotate-3 shadow-xl">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-kids font-bold text-gray-800 leading-none">Sorriso Kids</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Gestão de Clínica</p>
            </div>
          </div>
          <button 
            onClick={requestNotificationPermission}
            className={`p-2.5 rounded-xl transition-all ${notificationsEnabled ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500'}`}
            title={notificationsEnabled ? "Notificações Ativas" : "Ativar Notificações"}
          >
            {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 bg-gray-50/50 p-2 rounded-xl border border-gray-100 inline-flex">
          <div className="flex items-center gap-1.5 border-r border-gray-200 pr-3">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
            <span className="capitalize">{currentTime.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>{currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </header>

      {/* Role Navigation */}
      <nav className="flex px-4 gap-2 mb-6">
        {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`flex-1 flex flex-col items-center py-4 px-1 rounded-3xl transition-all duration-300 border-2 ${
              activeRole === role 
                ? `${ROLE_CONFIG[role].color} text-white border-transparent shadow-xl scale-105 -translate-y-1` 
                : `${ROLE_CONFIG[role].lightColor} ${ROLE_CONFIG[role].textColor} ${ROLE_CONFIG[role].borderColor} hover:bg-white`
            }`}
          >
            <div className={`p-1 rounded-full ${activeRole === role ? 'bg-white/20' : ''}`}>
              {ROLE_CONFIG[role].icon}
            </div>
            <span className="text-[10px] font-black mt-2 uppercase tracking-tighter">{role}</span>
          </button>
        ))}
      </nav>

      {/* Progress Card */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Sua Jornada</p>
              <h2 className="text-3xl font-kids font-bold text-gray-800">{progress}%</h2>
              <p className="text-xs font-semibold text-gray-500">concluído hoje</p>
            </div>
            <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 mb-1">
                  <Info className="w-3 h-3" />
                  Reset às 20h
                </div>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden p-1 shadow-inner relative z-10">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${ROLE_CONFIG[activeRole].color}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Task List container */}
      <main className="flex-1 px-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-3 pb-8">
          {currentRoleTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex items-center p-4 rounded-3xl cursor-pointer transition-all duration-300 border-2 ${
                taskState[task.id] 
                  ? 'bg-gray-50 border-gray-100 opacity-60' 
                  : `bg-white border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md active:scale-[0.98]`
              }`}
            >
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                taskState[task.id] 
                  ? `${ROLE_CONFIG[activeRole].color} border-transparent rotate-12 scale-110` 
                  : 'border-gray-200 group-hover:border-blue-300'
              }`}>
                {taskState[task.id] && <div className="w-2.5 h-2.5 bg-white rounded-full checkbox-pop"></div>}
              </div>
              <div className="ml-4 flex-1">
                <span className={`text-[9px] font-black uppercase tracking-widest block mb-0.5 ${
                   taskState[task.id] ? 'text-gray-400' : 'text-blue-500'
                }`}>{task.category}</span>
                <p className={`text-sm font-bold transition-all ${
                  taskState[task.id] ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}>
                  {task.text}
                </p>
              </div>
            </div>
          ))}

          {/* Observations for Atendente */}
          {activeRole === Role.ATENDENTE && (
            <div className="mt-8 bg-amber-50 rounded-[2rem] p-6 border border-amber-100 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full translate-x-1/2 -translate-y-1/2 opacity-30"></div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-amber-500 w-5 h-5" />
                <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest">Observações & Diretrizes</h3>
              </div>
              <div className="space-y-4 text-xs font-semibold text-amber-800 leading-relaxed">
                <p>
                  <span className="font-black text-amber-600">Negociação:</span> Nunca diga que passará o contato da CRC. Diga que a <span className="underline italic">CRC entrará em contato</span> para continuidade e avise a equipe imediatamente.
                </p>
                <p>
                  <span className="font-black text-amber-600">Agendamento:</span> Habilitar <span className="bg-amber-200/50 px-1 rounded">CONFIRMAÇÃO</span> (1 dia antes) e <span className="bg-amber-200/50 px-1 rounded">ALERTA</span> (no dia). Sempre definir a categoria da consulta.
                </p>
                <p>
                  <span className="font-black text-amber-600">Documentação:</span> Mandar uso de imagem pelo sistema; se não assinado, imprimir e solicitar no dia. <span className="italic">Anamnese deve ser preenchida presencialmente no dia da consulta.</span>
                </p>
                <p>
                  <span className="font-black text-amber-600">Zelo:</span> Verificar água na geladeira, enviar pré/pós consulta e mensagem de acompanhamento para pacientes que realizaram procedimentos.
                </p>
                <div className="bg-white/50 p-3 rounded-2xl border border-amber-200/50 space-y-2">
                  <p>
                    <span className="font-black text-red-500">PROIBIDO DIMINUTIVOS:</span> Nunca use mãezinha, filhinho, dorzinha, querida, etc. Chame <span className="underline">SEMPRE</span> pelo nome.
                  </p>
                  <p>
                    <span className="font-black text-blue-600">VOCABULÁRIO:</span> Troque a palavra <span className="line-through text-gray-400">custo</span> por <span className="font-black uppercase tracking-tighter">investimento</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentRoleTasks.length === 0 && activeRole !== Role.ATENDENTE && (
            <div className="text-center py-12 px-6">
              <div className="bg-gray-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-gray-300 w-8 h-8" />
              </div>
              <p className="text-gray-400 font-bold">Tudo limpo por aqui!</p>
              <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest">Aproveite o seu dia</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Navigation/Footer Placeholder */}
      <footer className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 text-center absolute bottom-0 left-0 right-0 z-20">
        <div className="flex flex-col items-center">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Sorriso Kids • {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-1 mt-1">
             <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
             <p className="text-[8px] text-gray-400 font-medium uppercase">Sistema Operacional • Reset 20:00 (Seg-Sex)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
