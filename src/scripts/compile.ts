import { readGedcom, SelectionEvent, SelectionGedcom, SelectionIndividualRecord, toJsDate } from 'read-gedcom';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Data, GenealogyData, GeographyDiskData, LongevityDiskData } from './types';
import * as _ from 'radash';
import { buildIndividualTree } from './utils.ts';

// Production
const INPUT_FILE = 'genealogy/genealogy.ged';
// Local
// const INPUT_FILE = 'genealogy.ged';
const OUTPUT_DIRECTORY = 'public/data';

const TREE_DEPTH_LIMIT = 9;
// const TREE_DEPTH_SENSITIVE = 3;

const targetGenealogyData = (gedcom: SelectionGedcom): GenealogyData => ({
  count: gedcom.getIndividualRecord().array().length,
});

const targetGeographyDisk = (gedcom: SelectionGedcom): GeographyDiskData => {
  const root = gedcom.getIndividualRecord().arraySelect()[0];
  const dataForIndividual = (node: SelectionIndividualRecord): GeographyDiskData['tree']['data'] => {
    const dateForEvent = (event: SelectionEvent): Date | null => {
      const dateValue = event.getDate().valueAsDate()[0];
      return dateValue != null && dateValue.hasDate && dateValue.isDatePunctual ? toJsDate(dateValue.date) : null;
    };
    const birthYear = dateForEvent(node.getEventBirth());
    let parts: string[] | null;
    if (birthYear === null || birthYear.getFullYear() < 1793) {
      parts = node.getEventChristening().getPlace().valueAsParts()[0];
    } else {
      parts = node.getEventBirth().getPlace().valueAsParts()[0];
    }
    const place =
      parts != null
        ? // ? _.list(3 - 1)
          //     .reverse()
          //     .map((i) => (i !== 2 || depth >= TREE_DEPTH_SENSITIVE ? parts[parts.length - 1 - i] || null : null))
          [
            parts[5] || null, // Lieu-dit
            parts[0] || null, // Ville
            parts[2] || null, // Département
            parts[3] || null, // Région
            parts[4] ? parts[4].toUpperCase() : null, // Pays
          ]
        : null;
    return { place };
  };
  return {
    tree: buildIndividualTree(root, dataForIndividual, TREE_DEPTH_LIMIT),
  };
};

const targetLongevityDisk = (gedcom: SelectionGedcom): LongevityDiskData => {
  const root = gedcom.getIndividualRecord().arraySelect()[0];
  const dataForIndividual = (node: SelectionIndividualRecord): LongevityDiskData['tree']['data'] => {
    const dateForEvent = (event: SelectionEvent): Date | null => {
      const dateValue = event.getDate().valueAsDate()[0];
      return dateValue != null && dateValue.hasDate && dateValue.isDatePunctual ? toJsDate(dateValue.date) : null;
    };
    let birth = dateForEvent(node.getEventBirth());
    if (birth === null || birth.getFullYear() < 1793) {
      birth = dateForEvent(node.getEventChristening());
    }
    let death = dateForEvent(node.getEventDeath());
    if (death === null || death.getFullYear() < 1793) {
      death = dateForEvent(node.getEventBurial());
    }
    // Extract birth and death years
    const birthYear = birth !== null ? birth.getFullYear() : null;
    const deathYear = death !== null ? death.getFullYear() : null;
    // Not the best rounding, but good enough
    const longevity = birth !== null && death !== null ? death.getFullYear() - birth.getFullYear() : null;
    // Exclude data for contemporary individual
    if (birthYear !== null && Number.isInteger(birthYear) && (birthYear as number) > 1920) {
      return { longevity, birthYear: null, deathYear: null };
    } else {
      return { longevity, birthYear, deathYear };
    }
  };
  return {
    tree: buildIndividualTree(root, dataForIndividual, TREE_DEPTH_LIMIT),
  };
};

const targets = (gedcom: SelectionGedcom): Data => ({
  data: targetGenealogyData(gedcom),
  geographyDisk: targetGeographyDisk(gedcom),
  longevityDisk: targetLongevityDisk(gedcom),
});

const generateTargets = () => {
  console.log('Loading file...');
  const buffer = readFileSync(INPUT_FILE);
  console.log('Reading Gedcom...');
  const gedcom = readGedcom(buffer);
  console.log('Generating targets...');
  const allTarget = targets(gedcom);
  console.log('Writing targets...');
  _.alphabetical(Object.entries(allTarget), ([name]) => name).forEach(([name, target]) => {
    const filename = `${name}.json`;
    console.log(`  Writing ${filename}...`);
    writeFileSync(join(OUTPUT_DIRECTORY, filename), JSON.stringify(target));
  });
  console.log('Done');
};

void generateTargets();
