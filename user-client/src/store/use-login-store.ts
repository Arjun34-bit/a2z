import { create } from 'zustand';

type Step = 1 | 2;

interface LoginStore {
  step: Step;
  phone: string;
  setStep: (step: Step) => void;
  setPhone: (phone: string) => void;
  reset: () => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  step: 1,
  phone: '',
  setStep: (step) => set({ step }),
  setPhone: (phone) => set({ phone }),
  reset: () => set({ step: 1, phone: '' }),
}));
