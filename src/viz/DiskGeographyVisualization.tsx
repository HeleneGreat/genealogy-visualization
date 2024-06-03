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
      place[5] || null,  // Lieu-dit
      place[0] || null,  // Ville
      place[2] || null,  // Département
      place[3] || null,  // Région
      place[4] || null,  // Pays
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
  return (
    <Box>
      <DiskVisualization
        data={data}
        color={interpolateSinebow}
        tooltip={(d) => (
          <Stack alignItems="center">
            <Box>Sosa {d.sosa}</Box>
            <Box>{formatPlace(d.place, false)}</Box>
          </Stack>
        )}
        type={DiskVisualizationType.CATEGORY}
        category={(d) => formatPlace(d.place, true)}
      />
      <Slider
        step={1}
        min={0}
        max={5}
        valueLabelDisplay="off"
        marks={[
          { value: 5, label: 'Lieu-dit' },
          { value: 0, label: 'Town' },
          { value: 2, label: 'Department' },
          { value: 3, label: 'Région' },
          { value: 4, label: 'Country' },
        ]}
        track={false}
        onChange={(e) => setLevel(parseInt((e.target as any).value))}
        value={level}
      />
    </Box>
  );
};
