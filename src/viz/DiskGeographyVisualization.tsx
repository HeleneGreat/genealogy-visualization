import React, { useState } from 'react';
import { interpolateSinebow } from 'd3-scale-chromatic';
import { DiskVisualization, DiskVisualizationType } from './DiskVisualization.tsx';
import { GeographyDiskData } from '../scripts/types.ts';
import { Box, Slider, Stack } from '@mui/joy';

interface DiskGeographyVisualizationProps {
  data: GeographyDiskData['tree'];
}

export const DiskGeographyVisualization: React.FC<DiskGeographyVisualizationProps> = ({ data }) => {
  const [level, setLevel] = useState(1);
  const formatPlace = (place: (string | null)[] | null, strict: boolean): string | null => {
    if (place === null) {
      return null;
    }
    const formattedPlace = [
      place[0] ?? null, // Lieu-dit
      place[1] ?? null, // Ville
      place[2] ?? null, // Département
      place[3] ?? null, // Région
      place[4] ?? null, // Pays
    ];
    const parts = formattedPlace.slice(level);
    const joinChar = ',';
    if (parts.every((v): v is string => v !== null)) {
      return parts.join(joinChar);
    } else if (strict) {
      return null;
    } else {
      return parts.filter((v): v is string => v !== null).join(joinChar);
    }
  };
  const GenerationNumber = (sosa: number) => Math.floor(Math.log2(sosa)) + 1;
  const genderSymbol = (sosa: number): string => (sosa % 2 === 0 ? '♂' : '♀');
  return (
    <Box>
      <DiskVisualization
        data={data}
        color={interpolateSinebow}
        tooltip={(d) => (
          <Stack alignItems="center">
            <Box>
              Génération {GenerationNumber(d.sosa)} | Sosa {d.sosa} {genderSymbol(d.sosa)}
            </Box>
            <Box>{formatPlace(d.place, false)}</Box>
          </Stack>
        )}
        type={DiskVisualizationType.CATEGORY}
        category={(d) => formatPlace(d.place, true)}
      />
      <Slider
        step={1}
        min={0}
        max={4}
        valueLabelDisplay="off"
        marks={[
          { value: 0, label: 'Lieu-dit' },
          { value: 1, label: 'Ville' },
          { value: 2, label: 'Départment' },
          { value: 3, label: 'Région' },
          { value: 4, label: 'Pays' },
        ]}
        track={false}
        onChange={(e) => setLevel(parseInt((e.target as any).value))}
        value={level}
      />
    </Box>
  );
};
