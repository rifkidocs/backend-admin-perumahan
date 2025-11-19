# Stock Opname Item API

## System Stock Calculation

**System Stock** pada stock opname item dihitung secara otomatis berdasarkan transaksi material per gudang:

### Formula
```
System Stock = Total Penerimaan Material - Total Pengeluaran Material
```

### Detail Kalkulasi

1. **Total Penerimaan Material**
   - Sum dari `sisa_quantity` di `penerimaan_materials`
   - Filter berdasarkan `material_id` dan `gudang_id`
   - Hanya menghitung sisa stock yang tersedia

2. **Total Pengeluaran Material**
   - Sum dari `quantity` di `pengeluaran_materials`
   - Filter berdasarkan `material_id` dan `gudang_id`
   - Hanya menghitung yang sudah `approved`

### Auto-Calculation Features

1. **Create Item**
   - System stock otomatis dihitung saat membuat stock opname item
   - Variance status otomatis ditentukan (Match/Over/Short)

2. **Update Item**
   - System stock otomatis di-refresh saat update physical stock
   - Difference dan variance status otomatis dihitung ulang

3. **Batch Refresh**
   - Refresh semua system stock dalam satu stock opname
   - Endpoint: `POST /api/stock-opname-items/refresh-system-stock/:stockOpnameId`

4. **Auto-Generate Items**
   - Generate stock opname items dari material yang ada di gudang
   - Endpoint: `POST /api/stock-opname-items/generate-items-from-gudang/:stockOpnameId`

### API Endpoints

**Standard CRUD**
- `GET /api/stock-opname-items` - Get all items
- `GET /api/stock-opname-items/:id` - Get single item
- `POST /api/stock-opname-items` - Create item (auto-generate system stock)
- `PUT /api/stock-opname-items/:id` - Update item (auto-recalculate system stock)
- `DELETE /api/stock-opname-items/:id` - Delete item

**Lifecycle Hooks**
- `beforeCreate` - Auto-generate system stock dan calculate variance
- `beforeUpdate` - Auto-recalculate system stock dan variance status
- `afterCreate` - Update stock opname totals
- `afterUpdate` - Update stock opname totals
- `afterDelete` - Update stock opname totals

### Usage Examples

#### Create Stock Opname Item
```javascript
const itemData = {
  "data": {
    "material_name": "Semen Tiga Roda",
    "physical_stock": 150, // Hasil hitungan fisik
    "unit": "sak",
    "material": 1, // ID material
    "stock_opname": 1 // ID stock opname
  }
};

// System stock akan otomatis dihitung
// Jika system stock = 160, maka:
// - difference = 150 - 160 = -10
// - variance_status = "Short"
```

#### Create Stock Opname Item (Auto-Generate System Stock)
```javascript
const itemData = {
  "data": {
    "material_name": "Semen Tiga Roda",
    "physical_stock": 150, // Hasil hitungan fisik
    "unit": "sak",
    "material": 1, // ID material
    "stock_opname": 1 // ID stock opname
  }
};

// POST /api/stock-opname-items
const response = await fetch('/api/stock-opname-items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(itemData)
});

// System stock akan otomatis dihitung oleh lifecycle hooks
// Response akan berisi:
// - system_stock: 160 (dari perhitungan transaksi)
// - difference: -10 (150 - 160)
// - variance_status: "Short"
```

#### Update Stock Opname Item (Auto-Recalculate)
```javascript
const updateData = {
  "data": {
    "physical_stock": 165 // Update hasil hitungan fisik
  }
};

// PUT /api/stock-opname-items/1
const response = await fetch('/api/stock-opname-items/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(updateData)
});

// System stock otomatis di-refresh dan variance dihitung ulang:
// - difference: 5 (165 - 160)
// - variance_status: "Over"
```

### Important Notes

1. **Per Gudang Calculation**: System stock dihitung per gudang, bukan global
2. **Lifecycle Hooks**: Semua kalkulasi otomatis via lifecycle (beforeCreate, beforeUpdate, etc.)
3. **Real-time**: System stock selalu update sesuai transaksi terakhir
4. **Decimal Support**: Mendukung kalkulasi desimal untuk material yang presisi
5. **Approved Only**: Pengeluaran material hanya dihitung jika sudah approved
6. **Sisa Quantity**: Penerimaan material menggunakan `sisa_quantity` bukan `quantity`
7. **Auto Totals**: Total items dan variance di stock opname otomatis update

### Lifecycle Behavior

- **Before Create**: Generate system stock, calculate difference & variance status
- **Before Update**: Recalculate system stock jika material/stock_opname/physical_stock berubah
- **After Create/Update/Delete**: Update totals di stock opname (total_items, total_variance)
- **Error Handling**: Fallback ke manual calculation jika service gagal

### Variance Status

- **Match**: `physical_stock == system_stock`
- **Over**: `physical_stock > system_stock` (kelebihan)
- **Short**: `physical_stock < system_stock` (kekurangan)

### Business Logic

1. Stock opname harus memiliki gudang terkait
2. System stock tidak bisa di-edit manual (calculated field)
3. Physical stock bisa di-edit untuk menyesuaikan hasil hitungan fisik
4. Variance status otomatis ter-update saat physical stock berubah