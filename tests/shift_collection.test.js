const fs = require('fs');
const path = require('path');

describe('Shift Collection & Absensi Relation', () => {
  const shiftSchemaPath = path.join(__dirname, '../src/api/shift/content-types/shift/schema.json');
  const absensiSchemaPath = path.join(__dirname, '../src/api/absensi/content-types/absensi/schema.json');

  test('Shift collection should exist', () => {
    expect(fs.existsSync(shiftSchemaPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(shiftSchemaPath, 'utf8'));
    // Verify existing fields
    expect(content.attributes).toHaveProperty('nama_shift');
    expect(content.attributes).toHaveProperty('jam_mulai');
    expect(content.attributes).toHaveProperty('jam_selesai');
  });

  test('Absensi should have shift relation', () => {
    const content = JSON.parse(fs.readFileSync(absensiSchemaPath, 'utf8'));
    
    // Check for relation
    expect(content.attributes).toHaveProperty('shift');
    expect(content.attributes.shift.type).toBe('relation');
    expect(content.attributes.shift.relation).toBe('manyToOne');
    expect(content.attributes.shift.target).toBe('api::shift.shift');
    
    // Should NOT have the old enum
    expect(content.attributes).not.toHaveProperty('shift_type');
  });
});