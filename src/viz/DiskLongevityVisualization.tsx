import React, { useState } from 'react';
import { interpolateReds } from 'd3-scale-chromatic';
import { DiskVisualization, DiskVisualizationType } from './DiskVisualization';
import { LongevityDiskData } from '../scripts/types';
import { Box, ButtonGroup, IconButton, Stack } from '@mui/joy';
import { Female, JoinFull, Male } from '@mui/icons-material';

interface DiskLongevityVisualizationProps {
  data: LongevityDiskData['tree'];
}

export const DiskLongevityVisualization: React.FC<DiskLongevityVisualizationProps> = ({ data }) => {
  const [gender, setGender] = useState<boolean | null>(null);
  const GenerationNumber = (sosa: number) => Math.floor(Math.log2(sosa)) + 1;
  const genderSymbol = (sosa: number): string => (sosa % 2 === 0 ? '♂' : '♀');
  return (
    <Box>
      <DiskVisualization
        data={data}
        color={interpolateReds}
        tooltip={(d) => (
          <Stack alignItems="center">
            <Box>
              Génération {GenerationNumber(d.sosa)} | Sosa {d.sosa} {genderSymbol(d.sosa)}
            </Box>
            <Box>{d.sosa > 7 ? `${d.birthYear ?? '?'}-${d.deathYear ?? '?'}` : ''}</Box>
            <Box>{d.longevity !== null ? `${d.longevity} ans` : d.sosa >= 1 << 3 ? 'Inconnu' : 'En vie'}</Box>
          </Stack>
        )}
        type={DiskVisualizationType.SCALE}
        scale={(d) => (gender === null ? d.longevity : !!(d.sosa % 2) === gender ? d.longevity : null)}
      />
      <ButtonGroup sx={{ '--ButtonGroup-radius': '40px', justifyContent: 'center', mt: 1 }}>
        <IconButton onClick={() => setGender(false)} variant={gender === false ? 'solid' : 'soft'} color="primary">
          <Male />
        </IconButton>
        <IconButton onClick={() => setGender(null)} variant={gender === null ? 'solid' : 'soft'} color="primary">
          <JoinFull />
        </IconButton>
        <IconButton onClick={() => setGender(true)} variant={gender === true ? 'solid' : 'soft'} color="primary">
          <Female />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};
