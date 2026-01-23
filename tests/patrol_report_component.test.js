const fs = require('fs');
const path = require('path');

describe('Patrol Report Component', () => {
  const componentPath = path.join(__dirname, '../src/components/attendance/patrol-report.json');

  test('should exist', () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  test('should have correct structure', () => {
    const content = JSON.parse(fs.readFileSync(componentPath, 'utf8'));
    expect(content.collectionName).toBe('components_attendance_patrol_reports');
    expect(content.attributes).toHaveProperty('foto');
    expect(content.attributes).toHaveProperty('lokasi');
    expect(content.attributes).toHaveProperty('status_keamanan');
    expect(content.attributes.status_keamanan.enum).toContain('Aman');
    expect(content.attributes.status_keamanan.enum).toContain('Kejadian');
  });
});
