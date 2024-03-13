import { useNavigation } from '@remix-run/react';
import { useEffect, useRef } from 'react';

export const useChatForm = () => {
  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === 'submitting');
  const $form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSubmitting) {
      $form.current?.reset();
    }
  }, [isSubmitting]);

  return { $form, isSubmitting };
};
