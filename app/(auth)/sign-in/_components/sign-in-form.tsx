"use client";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import MailIcon from "@/shared/assets/icons/mail.svg";
import KeyboardIcon from "@/shared/assets/icons/keyboard.svg";
import "./sign-in.css";
import { PasswordInput } from "@/shared/ui/password-input";
import { useAuth } from "@/features/auth/use-auth";
import { createSignInSchema, type SignInFormData } from "./signin-schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useNotifications } from "@/app/providers/notifications-provider/useNotifications";
import { ROUTES } from "@/app/lib/routes";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function SignInForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const { signin } = useAuth();
  const { add } = useNotifications();
  const [isPending, setIsPending] = useState(false);

  const schema = useMemo(() => createSignInSchema(t), [t, locale]);

  const { control, handleSubmit } = useForm<SignInFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsPending(true);
      await signin(data.email, data.password);
      add({ message: t("signIn.success") });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      add({
        message: t("signIn.error", { message: error }),
        type: "error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <h1>{t("signIn.title")}</h1>
        <p>
          {t("signIn.subtitleLine1")} <br />
          {t("signIn.subtitleLine2")}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label={t("signIn.email")}
              type="email"
              placeholder={t("signIn.emailPlaceholder")}
              icon={<MailIcon />}
              error={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <PasswordInput
              {...field}
              label={t("signIn.password")}
              placeholder={t("signIn.passwordPlaceholder")}
              icon={<KeyboardIcon />}
              error={error?.message}
            />
          )}
        />

        <Button type="submit" disabled={isPending}>
          {t("signIn.submit")}
        </Button>
      </form>

      <p className="auth-form-footer">
        {t("signIn.footer")}{" "}
        <Link href={ROUTES.SIGNUP}>{t("signIn.signUpLink")}</Link>
      </p>
    </>
  );
}
