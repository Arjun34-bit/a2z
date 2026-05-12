"use client";

import { Modal } from "@/components/ui/modal";
import { LoginForm } from "@/components/auth/LoginForm";
import { useLoginStore } from "@/store/use-login-store";

interface LoginModalProps {
  /** controlled open state */
  open: boolean;
  /** called when the modal should close */
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { step, setStep, reset } = useLoginStore();

  const handleClose = () => {
    onClose();
    // reset after exit animation
    setTimeout(() => {
      reset();
    }, 300);
  };

  const handleSuccess = () => {
    handleClose();
    // TODO: redirect / set auth state
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      showBack={step > 1}
      onBack={() => setStep(1)}
    >
      <LoginForm onSuccess={handleSuccess} />
    </Modal>
  );
}