"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SidekickLogo from "@/shared/assets/icons/sidekick-logo.svg";
import { BurgerMenu } from "./burger-menu";
import { AuthButtons } from "./auth-buttons";
import { UserNav } from "./user-nav";
import { NavBar } from "./navbar";
import { useAuth } from "@/features/auth/use-auth";
import { ROUTES } from "@/app/lib/routes";
import Link from "next/link";

export interface HeaderProps {
  hiddenNav?: boolean;
}

export const MainHeader = ({ hiddenNav = false }: HeaderProps) => {
  const { isAuth } = useAuth();
  const [isNavBar, setIsNavBar] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const toggleNavBar = () => {
    setIsNavBar((prev) => !prev);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: { xs: 30, md: 68 },
          minHeight: { xs: "30px", md: "68px" },
          px: { xs: 1.5, md: 3 },
          fontFamily: "var(--font-family-secondary), serif",
          bgcolor: "var(--bg-primary)",
          display: "flex",
          alignItems: "center",
        }}>
        <Box
          component={Link}
          href={ROUTES.HOME}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            color: "var(--color-primary)",
            textDecoration: "none",
          }}>
          <Box
            sx={{
              height: 24,
              display: "flex",
              alignItems: "center",
              "& svg": {
                transform: {
                  xs: "scale(0.5)",
                  md: "scale(1)",
                },
              },
            }}>
            <SidekickLogo />
          </Box>
          <Typography
            component={"span"}
            sx={{
              lineHeight: 1,
              letterSpacing: 0,
              fontSize: { xs: 10, md: 16 },
              fontFamily: "inherit",
            }}>
            sidekick
          </Typography>
        </Box>

        {!hiddenNav && (
          <>
            {!isDesktop && <BurgerMenu onClick={toggleNavBar} />}

            {isDesktop && (isAuth ? <UserNav /> : <AuthButtons />)}

            <NavBar setNavBar={toggleNavBar} isOpen={isNavBar} />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
