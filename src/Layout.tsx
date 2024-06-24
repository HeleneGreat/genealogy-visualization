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
    return date.toLocaleDateString('fr-fr', { year: 'numeric', month: 'short', day: 'numeric' });
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
            <Typography color="neutral">
              Illustration de ma généalogie, à partir d&apos;un projet de{' '}
              <a href="https://genealogy.florian.cassayre.me" target="_blank" rel="noreferrer">
                Florian Cassayre
              </a>
            </Typography>
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
        <div id="legend">
          Ces roues sont une illustration de mon arbre généalogique. Chaque anneau représente une génération: plus on
          s&apos;éloigne du centre de la roue, plus il s&apos;agit d&apos;une génération ancienne. En survolant un
          quartier avec la souris, vous obtiendrez plus d&apos;information sur cet ancêtre.
        </div>
        <Divider sx={{ my: 2 }} />
        <footer>
          <Typography textAlign="center">
            Ce site est automatiquement généré à partir d&apos;un fichier Gedcom
          </Typography>
          <Typography textAlign="center">Dernière mise à jour : {renderDateBuilt()}</Typography>
        </footer>
      </Container>
    </>
  );
};
