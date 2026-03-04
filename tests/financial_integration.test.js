const { afterUpdate: updateKasMasuk } = require('../src/api/kas-masuk/content-types/kas-masuk/lifecycles');
const { afterUpdate: updateKasKeluar } = require('../src/api/kas-keluar/content-types/kas-keluar/lifecycles');

// Mock Strapi
global.strapi = {
  db: {
    query: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      update: jest.fn(),
      create: jest.fn()
    })
  }
};

describe('Financial Integration Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update Pos Keuangan saldo correctly on Kas Masuk confirmation (decimal)', async () => {
    const mockPos = { id: 1, nama_pos: 'Bank BCA', saldo: 1000000.00 };
    const mockKasMasuk = { id: 10, amount: 500.50, status_transaksi: 'confirmed' };
    const state = { previousData: { id: 10, amount: 500.50, status_transaksi: 'pending', pos_keuangan: { id: 1 } } };

    strapi.db.query().findOne.mockResolvedValueOnce(mockPos);
    
    await updateKasMasuk({ result: mockKasMasuk, state });

    expect(strapi.db.query().update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { saldo: 1000500.50 }
    });
  });

  test('should update Pos Keuangan saldo correctly on Kas Keluar approval (decimal)', async () => {
    const mockPos = { id: 1, nama_pos: 'Bank BCA', saldo: 1000000.00 };
    const mockKasKeluar = { id: 20, amount: 250.75, approval_status: 'approved' };
    const state = { previousData: { id: 20, amount: 250.75, approval_status: 'pending', pos_keuangan: { id: 1 } } };

    strapi.db.query().findOne.mockResolvedValueOnce(mockPos);
    
    await updateKasKeluar({ result: mockKasKeluar, state });

    expect(strapi.db.query().update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { saldo: 999749.25 }
    });
  });
});
