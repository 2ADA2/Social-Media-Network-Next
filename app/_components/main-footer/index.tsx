import { Box, Typography } from "@mui/material";

export const MainFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'primary.main',
        bgcolor: 'var(--bg-primary)',
        height: { xs: 56, md: 68 },
        fontSize: { xs: 14, md: 18 },
        fontFamily: 'var(--font-family-secondary), serif',
      }}
    >
      <Typography>
        &copy; 2026 Sidekick
      </Typography>
    </Box>
  );
};
