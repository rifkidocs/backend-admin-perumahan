'use strict';

/**
 * Sample data for Master Shift
 */

const sampleShifts = [
  {
    nama_shift: 'Pagi',
    jam_mulai: '07:00',
    jam_selesai: '15:00',
    kode_shift: 'SHIFT-001',
    keterangan: 'Shift kerja pagi hari (8 jam)',
    is_active: true
  },
  {
    nama_shift: 'Siang',
    jam_mulai: '15:00',
    jam_selesai: '23:00',
    kode_shift: 'SHIFT-002',
    keterangan: 'Shift kerja siang hari (8 jam)',
    is_active: true
  },
  {
    nama_shift: 'Malam',
    jam_mulai: '23:00',
    jam_selesai: '07:00',
    kode_shift: 'SHIFT-003',
    keterangan: 'Shift kerja malam hari (8 jam)',
    is_active: true
  }
];

async function seedShifts() {
  try {
    console.log('🌱 Starting to seed sample shift data...');

    // Check if shifts already exist
    const existingShifts = await strapi.entityService.findMany('api::shift.shift', {
      filters: {
        kode_shift: ['SHIFT-001', 'SHIFT-002', 'SHIFT-003']
      }
    });

    if (existingShifts.length > 0) {
      console.log('⚠️  Sample shifts already exist. Skipping seed.');
      return;
    }

    // Create the sample shifts
    for (const shiftData of sampleShifts) {
      const createdShift = await strapi.entityService.create('api::shift.shift', {
        data: shiftData
      });
      console.log(`✅ Created shift: ${createdShift.nama_shift} (${createdShift.kode_shift})`);
    }

    console.log('🎉 Sample shift data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding shift data:', error);
  }
}

// Export for use in Strapi console or script runner
module.exports = { seedShifts };

// If running directly through Strapi CLI
if (require.main === module && process.argv.includes('--strapi')) {
  // This will work when run with strapi command
  require('@strapi/strapi').load().then(async (app) => {
    global.strapi = app;
    await seedShifts();
    process.exit(0);
  }).catch((error) => {
    console.error('Failed to load Strapi:', error);
    process.exit(1);
  });
}