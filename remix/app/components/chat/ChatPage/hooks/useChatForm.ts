import { useNavigation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { useCurrentChat } from './useCurrentChat';

export const useChatForm = () => {
  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.state === 'submitting');
  const $form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSubmitting) {
      $form.current?.reset();
    }
  }, [isSubmitting]);

  const currentChat = useCurrentChat();

  return { $form, currentChat, isSubmitting };
};
