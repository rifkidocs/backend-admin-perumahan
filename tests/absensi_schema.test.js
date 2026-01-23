const fs = require('fs');
const path = require('path');

describe('Absensi Collection', () => {
  const schemaPath = path.join(__dirname, '../src/api/absensi/content-types/absensi/schema.json');

  test('should have patrol_reports and shift fields', () => {
    const content = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    // Check for laporan_patroli (repeatable component)
    expect(content.attributes).toHaveProperty('laporan_patroli');
    expect(content.attributes.laporan_patroli.type).toBe('component');
    expect(content.attributes.laporan_patroli.repeatable).toBe(true);
    expect(content.attributes.laporan_patroli.component).toBe('attendance.patrol-report');

    // Check for shift relation
    expect(content.attributes).toHaveProperty('shift');
    expect(content.attributes.shift.type).toBe('relation');
  });
});