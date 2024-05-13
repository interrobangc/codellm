import { SignIn } from '@clerk/remix';

import ContentWrapper from '@remix/components/common/ContentWrapper';

export default function SignInPage() {
  return (
    <ContentWrapper className="flex flex-col items-center justify-center">
      <SignIn />
    </ContentWrapper>
  );
}
