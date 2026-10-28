"use client";

import { Input } from "@/shared/ui/input";
import MailIcon from "@/shared/assets/icons/mail.svg";
import KeyboardIcon from "@/shared/assets/icons/keyboard.svg";
import UserIcon from "@/shared/assets/icons/user.svg";
import "./sign-up.css";
import { Button } from "@/shared/ui/button";
import { PasswordInput } from "@/shared/ui/password-input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSignupSchema, type SignUpFormData } from "./signup-schema";
import { useAuth } from "@/features/auth/use-auth";
import { useMemo, useState } from "react";
import { useNotifications } from "@/app/providers/notifications-provider/useNotifications";
import { ROUTES } from "@/app/lib/routes";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function SignUpForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const { signup } = useAuth();
  const { add } = useNotifications();
  const [isPending, setIsPending] = useState(false);

  const schema = useMemo(() => createSignupSchema(t), [t, locale]);

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", secondName: "", email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsPending(true);
      await signup(data);
      add({ message: t("signUp.success") });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      add({
        message: t("signUp.error", { message: String(error) }),
        type: "error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="sign-up-header">
        <h1>{t("signUp.title")}</h1>
        <p>
          {t("signUp.subtitleLine1")} <br />
          {t("signUp.subtitleLine2")}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState: { error, isTouched } }) => (
            <Input
              {...field}
              label={t("signUp.firstName")}
              placeholder={t("signUp.firstNamePlaceholder")}
              icon={<UserIcon />}
              error={error?.message}
              custom={isTouched}
            />
          )}
        />
        <Controller
          name="secondName"
          control={control}
          render={({ field, fieldState: { error, isTouched } }) => (
            <Input
              {...field}
              label={t("signUp.secondName")}
              placeholder={t("signUp.secondNamePlaceholder")}
              icon={<UserIcon />}
              error={error?.message}
              custom={isTouched}
            />
          )}
        />
        <div className="input-container">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState: { error, isTouched } }) => (
              <Input
                {...field}
                label={t("signUp.email")}
                type="email"
                placeholder={t("signUp.emailPlaceholder")}
                icon={<MailIcon />}
                error={error?.message}
                custom={isTouched}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState: { error, isTouched } }) => (
              <PasswordInput
                {...field}
                label={t("signUp.password")}
                placeholder={t("signUp.passwordPlaceholder")}
                icon={<KeyboardIcon />}
                error={error?.message}
                custom={isTouched}
              />
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} data-testid="submit-button">
          {t("signUp.submit")}
        </Button>
      </form>

      <small>
        {t("signUp.termsPrefix")} <b>{t("signUp.termsOfService")}</b>{" "}
        {t("signUp.and")} <b>{t("signUp.privacyPolicy")}</b>
      </small>

      <p className="auth-form-footer">
        {t("signUp.footer")}{" "}
        <Link href={ROUTES.SIGNIN}>{t("signUp.signInLink")}</Link>
      </p>
    </>
  );
}
