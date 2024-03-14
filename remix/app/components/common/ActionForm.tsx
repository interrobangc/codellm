import type { HTMLFormMethod } from '@remix-run/router';
import { Form } from '@remix-run/react';

export type ActionFormProps = {
  children?: React.ReactNode;
  className?: string;
  intent: string;
  isSubmitting: boolean;
  method: HTMLFormMethod;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  shouldHideSubmitButton?: boolean;
  submitButtonChildren: React.ReactNode;
  submitButtonClassName?: string;
};

export const ActionForm = ({
  children,
  className,
  intent,
  isSubmitting,
  method,
  onSubmit,
  shouldHideSubmitButton,
  submitButtonChildren,
  submitButtonClassName,
}: ActionFormProps) => {
  const buttonClass = `btn ${submitButtonClassName} ${isSubmitting ? 'btn-disabled' : ''}`;

  return (
    <Form method={method} className={className} onSubmit={onSubmit}>
      {children}
      {!shouldHideSubmitButton && (
        <button className={buttonClass} name="intent" value={intent}>
          {submitButtonChildren}
        </button>
      )}
    </Form>
  );
};

export default ActionForm;
