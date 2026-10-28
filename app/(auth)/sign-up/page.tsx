import { Metadata } from "next";
import SignUpForm from './_components/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign up | Sidekick Social',
  description: 'Create your account in Sidekick social',
  alternates: {
    canonical: '/sign-up',
  },
};

export default function SignUp () {
  return (
    <div className="auth-container">
      <section className="sign-up">
        <SignUpForm/>
      </section>
    </div>
  );
};
