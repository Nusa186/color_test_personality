export interface WarnaPersonality {
  id_personality: string;
  warna: string;
  nama_personality: string;
  deskripsi: string;
}

export interface KeunggulanPersonality {
  id_personality: string;
  keunggulan: string;
}

export interface KelemahanPersonality {
  id_personality: string;
  kelemahan: string;
}

export interface PertanyaanPersonality {
  id: number;
  pertanyaan: string;
}

export interface PilihanPersonality {
  id_pertanyaan: number;
  id_pilihan: number;
  teks_pilihan: string;
  nilai_pilihan: string;
}