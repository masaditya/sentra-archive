<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rekapitulasi Notifikasi Retensi - {{ $date }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 1.5cm;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 10pt;
            color: #333;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #223771;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #223771;
            margin: 0;
            text-transform: uppercase;
            font-size: 18pt;
            letter-spacing: 1px;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .meta {
            margin-bottom: 20px;
            font-size: 9pt;
            display: flex;
            justify-content: space-between;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #223771;
            color: white;
            text-transform: uppercase;
            font-size: 8pt;
            padding: 12px 8px;
            text-align: left;
        }
        td {
            padding: 10px 8px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 7pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-musnah { background-color: #fee2e2; color: #dc2626; }
        .status-inaktif { background-color: #dbeafe; color: #2563eb; }
        .status-permanen { background-color: #fef3c7; color: #d97706; }
        
        .footer {
            margin-top: 50px;
            text-align: right;
            font-size: 9pt;
        }
        .signature {
            margin-top: 60px;
            border-top: 1px solid #333;
            display: inline-block;
            width: 200px;
            text-align: center;
        }

        @media print {
            .no-print { display: none; }
            body { margin: 0; }
        }

        .btn-print {
            background: #223771;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: center; background: #f8f9fa; padding: 10px; border-bottom: 1px solid #ddd;">
        <button onclick="window.print()" class="btn-print">CETAK PDF / PRINT</button>
        <p style="font-size: 8pt; color: #888;">Gunakan opsi "Save as PDF" pada dialog cetak untuk menyimpan sebagai file.</p>
    </div>

    <div class="header">
        <h1>REKAPITULASI NOTIFIKASI RETENSI ARSIP</h1>
        <p>Sistem Informasi Manajemen Arsip (SENTRA)</p>
    </div>

    <div class="meta">
        <div><strong>Tanggal Simulasi:</strong> {{ $date }}</div>
        <div style="text-align: right;"><strong>Dicetak Pada:</strong> {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="15%">OPD / Instansi</th>
                <th width="12%">No. Arsip</th>
                <th width="20%">Uraian Masalah</th>
                <th width="10%">Tahun</th>
                <th width="12%">Jatuh Tempo</th>
                <th width="13%">Tindakan</th>
                <th width="13%">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($notifications as $index => $notif)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td><strong>{{ $notif->organization->name }}</strong></td>
                <td><code>{{ $notif->archive_number }}</code></td>
                <td style="font-size: 9pt;">
                    <strong>{{ $notif->series }}</strong><br>
                    <span style="color: #666;">{{ $notif->description }}</span>
                </td>
                <td style="text-align: center;">{{ $notif->year }}</td>
                <td>{{ \Carbon\Carbon::parse($notif->due_date)->format('d/m/Y') }}</td>
                <td>
                    <span class="status-badge {{ 'status-' . strtolower($notif->due_type) }}">
                        {{ $notif->due_type }}
                    </span>
                </td>
                <td>
                    @php
                        $isFollowedUp = $notif->retentionActions->isNotEmpty();
                    @endphp
                    @if($isFollowedUp)
                        <span style="color: #059669; font-weight: bold; font-size: 8pt;">✓ SUDAH TINDAK LANJUT</span>
                    @else
                        <span style="color: #dc2626; font-weight: bold; font-size: 8pt;">⚠ BELUM MERESPON</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">Tidak ada data notifikasi retensi yang ditemukan.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak secara otomatis oleh Sistem SENTRA</p>
        <br><br>
        <p>Petugas Administrasi,</p>
        <div class="signature">
            ( Nama Lengkap & Tanda Tangan )
        </div>
    </div>

    <script>
        // window.print(); // Uncomment to auto-open print dialog
    </script>
</body>
</html>
