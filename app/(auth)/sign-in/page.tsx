import { Metadata } from "next";
import SignInForm from "./_components/sign-in-form";

export const metadata: Metadata = {
  title: 'Sign in | Sidekick Social',
  description: 'Enter your account Sidekick social',
  alternates: {
    canonical: '/sign-in',
  },
};

export default function SignIn () {
  return (
    <div className="auth-container">
      <section className="sign-in">
        <SignInForm/>
      </section>
    </div>
  );
};
