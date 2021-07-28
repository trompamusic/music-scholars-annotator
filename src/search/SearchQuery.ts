export type Pitch = {
  pitch: string;
  oct: number;
};

export function parseMusicXml(document: Document) {
  const parts = document.getElementsByTagName("part");
  return Array.from(parts)
    .map(function (part) {
      let part_notes: Pitch[] = [];
      Array.from(part.getElementsByTagName("note")).forEach(function (note) {
        const pitch = note.getElementsByTagName("pitch");
        if (pitch.length) {
          const step = pitch[0].getElementsByTagName("step");
          const octave = pitch[0].getElementsByTagName("octave");
          if (step.length && octave.length) {
            part_notes.push({
              pitch: step[0].innerHTML,
              oct: parseInt(octave[0].innerHTML),
            });
          }
        }
      });
      return part_notes;
    })
    .map(pitchesToIntervalMapping);
}

export type Staff = {
  label: string;
  notes: Pitch[];
};

export function parseMei(document: Document) {
  const staffDefinitions = document.getElementsByTagName("staffDef");
  const staffs: { [n: string]: Staff } = {};
  Array.from(staffDefinitions).forEach(function (sd) {
    const attributes = sd.attributes;
    const label = sd.getElementsByTagName("label");
    let staffLabel: string;
    if (label.length) {
      staffLabel = label[0].innerHTML;
    }
    const n = attributes?.getNamedItem("n")?.value!;
    if (n) {
      staffs[n] = { label: staffLabel!, notes: [] };
    }
  });

  const measures = document.getElementsByTagName("measure");
  Array.from(measures).forEach(function (measure) {
    const measureStaffs = measure.getElementsByTagName("staff");
    Array.from(measureStaffs).forEach(function (staff) {
      const measureStaffId = staff.attributes.getNamedItem("n")?.value!;
      const notes = staff.getElementsByTagName("note");
      Array.from(notes).forEach(function (note) {
        const nattrs = note.attributes;
        const pname = nattrs.getNamedItem("pname")?.value!;
        const oct = nattrs.getNamedItem("oct")?.value!;
        staffs[measureStaffId].notes.push({
          pitch: pname,
          oct: parseInt(oct, 10),
        });
      });
    });
  });
  let ret: { [key: string]: { label: string; notes: string } } = {};
  Object.keys(staffs).forEach(function (i) {
    if (staffs[i].label) {
      ret[i] = {
        label: staffs[i].label,
        notes: pitchesToIntervalMapping(staffs[i].notes),
      };
    }
  });
  return ret;
}

/**
 * Take an array of pitches (objects with key pitch (letter) and oct (number))
 * and return a mapping of absolute pitches differences between the notes
 * - if there is no change
 * a for pitch 1, b for pitch 2, c for pitch 3. Upper-case if pitch is increasing,
 * lower-case if pitch is decreasing. Doesn't take in to account accidentals
 * @param pitches
 */
function pitchesToIntervalMapping(pitches: Pitch[]): string {
  const interval_mapping = "-abcdefghijklmnopqrstuvwxyz".split("");

  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  const pitch_nums = pitches.map(function (e) {
    // TODO: This replicates the behaviour of the awk script, where g is 0 and a->f is 1-6
    //  appears to be a bug because of awk string indexes starting from 1
    return (
      ((alphabet.indexOf(e.pitch.toUpperCase()) + 1) % 7) + ((7 * e.oct) % 7)
    );
  });

  let pitch_intervals = [];
  // Finish one before the end, because we're looking at the gaps
  for (let i = 0; i < pitch_nums.length - 1; i++) {
    pitch_intervals.push(pitch_nums[i + 1] - pitch_nums[i]);
  }
  return pitch_intervals
    .map(function (i) {
      // Clamp to a maximum interval of 25 notes
      if (i < -26) i = -26;
      if (i > 26) i = 26;
      let letter = interval_mapping[Math.abs(i)];
      if (i > 0) {
        letter = letter.toUpperCase();
      }
      return letter;
    })
    .join("");
}
