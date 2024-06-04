import React from 'react';
import { Box, Container, CssBaseline, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/joy';
import { AutoStories, GitHub } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const renderDateBuilt = () => {
    const timestamp = import.meta.env.BUILD_TIMESTAMP as number | undefined;
    const date = new Date(timestamp ?? new Date().getTime());
    return date.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  return (
    <>
      <CssBaseline />
      <Container sx={{ my: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AutoStories />
              <Typography level="h3" color="neutral">
                Hélène Carriou
              </Typography>
            </Stack>
            <Typography color="neutral">Projet d'illustration de ma généalogie, à partir d'un projet de <a href="https://genealogy.florian.cassayre.me" target="_blank" rel="noreferrer">Florian Cassayre</a></Typography>
          </Stack>
          <Box>
            <Tooltip title="View on GitHub">
              <IconButton
                variant="outlined"
                component="a"
                href="https://github.com/HeleneGreat/genealogy-visualization"
                target="_blank"
                rel="noopener"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
        {children}
        <Divider sx={{ my: 2 }} />
        <footer>
          <Typography textAlign="center">This website is automatically generated from a Gedcom file</Typography>
          <Typography textAlign="center">Date updated: {renderDateBuilt()}</Typography>
        </footer>
      </Container>
    </>
  );
};