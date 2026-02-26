import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../email.tailwind.config';

interface ResetPasswordProps {
  url?: string;
}

export const ResetPassword = ({
  url,
}: ResetPasswordProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-[#f3f3f5] font-brand m-0 py-10">
        <Preview>Forgot your password? Click the button below to set a new password for your account.</Preview>
        <Container className="bg-white rounded-lg max-w-xl mx-auto px-12 pt-12 pb-10">
          <Section className="mb-12">
            <Img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
              width="50"
              height="44"
              alt="Logo"
              className="block"
            />
          </Section>
          <Heading className="text-[#0a0a0a] text-[28px] font-bold leading-snug m-0 mb-4">
            Forgot your password?
          </Heading>
          <Text className="text-[#0a0a0a] text-base leading-relaxed m-0 mb-8">
       		  Click the button below to set a new password for your account. If you did not request to reset your password, you can safely ignore this email.
          </Text>
          <Section className="mb-10">
            <Button
              href={url}
              target="_blank"
              className="bg-blue-700 rounded-lg text-white text-base font-medium px-8 py-4 no-underline text-center block"
            >
            Set new password →
            </Button>
          </Section>
          <Text className="text-[#0a0a0a] text-base font-bold m-0 mb-1">
            Stay awesome,
          </Text>
          <Text className="text-[#0a0a0a] text-base m-0 mb-8">
          	The Tanstack Starter Team
          </Text>
          <Hr className="border-[#e5e5e5] m-0 mb-12" />
          <Heading as="h2" className="text-[#0a0a0a] text-base font-bold m-0 mb-3">
            Need help?
          </Heading>
          <Text className="text-[#0a0a0a] text-base m-0">
            If you have any questions, please contact us by email at{' '}
            <Link href="mailto:hello@tanstack-starter.com" className="text-[#5746ea] underline">
              hello@tanstack-starter.com
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

ResetPassword.PreviewProps = {
  url: 'http://localhost:3000/api/auth/reset-password/jwt?callbackURL=%2Fchange-password',
} as ResetPasswordProps;

export default ResetPassword;