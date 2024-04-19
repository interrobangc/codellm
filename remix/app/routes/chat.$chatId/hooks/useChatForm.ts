import { useNavigation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { useCurrentChat } from './useCurrentChat';

export const useChatForm = () => {
  const navigation = useNavigation();
  const currentChat = useCurrentChat();
  const isSubmitting = Boolean(
    navigation.state === 'submitting' || currentChat.isLoading,
  );
  const $form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isSubmitting) {
      $form.current?.reset();
    }
  }, [isSubmitting]);

  return { $form, currentChat, isSubmitting };
};

export default useChatForm;
