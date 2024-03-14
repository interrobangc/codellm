import type { HTMLFormMethod } from '@remix-run/router';
import { ActionForm } from './ActionForm';

export type ActionButtonProps = {
  buttonClassName?: string;
  children: React.ReactNode;
  formClassName?: string;
  intent: string;
  isSubmitting: boolean;
  method: HTMLFormMethod;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const ActionButton = ({
  buttonClassName,
  children,
  formClassName,
  intent,
  isSubmitting,
  method,
  onSubmit,
}: ActionButtonProps) => {
  const buttonClass = `btn ${buttonClassName} ${isSubmitting ? 'btn-disabled' : ''}`;

  return (
    <ActionForm
      className={formClassName}
      intent={intent}
      isSubmitting={isSubmitting}
      method={method}
      onSubmit={onSubmit}
      submitButtonChildren={children}
      submitButtonClassName={buttonClass}
    />
  );
};

export default ActionButton;
