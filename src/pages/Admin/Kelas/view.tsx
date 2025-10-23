import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableOne, { Column } from "../../../components/tables/BasicTables/BasicTableOne";
import { supabase } from "../../../lib/supabaseclient";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";

type Kelas = {
  id_kelas: number;
  nama_kelas: string;
  jurusan?: { nama_jurusan: string };
  pengajar?: { nama_pengajar: string };
  tahun_ajaran?: { tahun_ajaran: string };
  id_jurusan?: number;
  id_pengajar?: number;
  id_tahun?: number;
};

export default function KelolaKelas() {
  const [data, setData] = useState<Kelas[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Partial<Kelas>>({});

  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const [pengajarList, setPengajarList] = useState<any[]>([]);
  const [tahunList, setTahunList] = useState<any[]>([]);

  // Fetch data kelas + relasi
  useEffect(() => {
    fetchKelas();
    fetchDropdownData();
  }, []);

  async function fetchKelas() {
    const { data: kelasData, error } = await supabase
      .from("kelas")
      .select(`
        id_kelas,
        nama_kelas,
        id_jurusan,
        id_pengajar,
        id_tahun,
        jurusan (nama_jurusan),
        pengajar (nama_pengajar),
        tahun_ajaran (tahun_ajaran)
      `)
      .order("id_kelas", { ascending: true });

    if (error) {
      console.error("Error fetching kelas:", error);
      return;
    }
    setData(kelasData ?? []);
  }

  async function fetchDropdownData() {
    const [jurusan, pengajar, tahun] = await Promise.all([
      supabase.from("jurusan").select("id_jurusan, nama_jurusan"),
      supabase.from("pengajar").select("id_pengajar, nama_pengajar"),
      supabase.from("tahun_ajaran").select("id_tahun, tahun_ajaran"),
    ]);

    if (jurusan.data) setJurusanList(jurusan.data);
    if (pengajar.data) setPengajarList(pengajar.data);
    if (tahun.data) setTahunList(tahun.data);
  }

  // Hapus data
  const handleDelete = async (id_kelas: number) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("kelas").delete().eq("id_kelas", id_kelas);
    if (error) {
      alert("Gagal menghapus data!");
      console.error(error);
      return;
    }
    setData((prev) => prev.filter((item) => item.id_kelas !== id_kelas));
  };

  // Tambah data
  const handleAdd = () => {
    setFormMode("add");
    setFormData({});
    setShowForm(true);
  };

  // Edit data
  const handleEdit = (row: Kelas) => {
    setFormMode("edit");
    setFormData(row);
    setShowForm(true);
  };

  // Simpan data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama_kelas) {
      alert("Nama kelas harus diisi!");
      return;
    }

    if (formMode === "add") {
      const { data: newData, error } = await supabase
        .from("kelas")
        .insert([
          {
            nama_kelas: formData.nama_kelas,
            id_jurusan: formData.id_jurusan,
            id_pengajar: formData.id_pengajar,
            id_tahun: formData.id_tahun,
          },
        ])
        .select(`
          id_kelas,
          nama_kelas,
          jurusan (nama_jurusan),
          pengajar (nama_pengajar),
          tahun_ajaran (tahun_ajaran)
        `);

      if (error) {
        alert("Gagal menambah data!");
        console.error(error);
        return;
      }
      setData((prev) => [...prev, ...(newData ?? [])]);
    } else if (formMode === "edit" && formData.id_kelas) {
      const { data: updatedData, error } = await supabase
        .from("kelas")
        .update({
          nama_kelas: formData.nama_kelas,
          id_jurusan: formData.id_jurusan,
          id_pengajar: formData.id_pengajar,
          id_tahun: formData.id_tahun,
        })
        .eq("id_kelas", formData.id_kelas)
        .select(`
          id_kelas,
          nama_kelas,
          jurusan (nama_jurusan),
          pengajar (nama_pengajar),
          tahun_ajaran (tahun_ajaran)
        `);

      if (error) {
        alert("Gagal mengupdate data!");
        console.error(error);
        return;
      }

      setData((prev) =>
        prev.map((item) =>
          item.id_kelas === formData.id_kelas ? updatedData?.[0] ?? item : item
        )
      );
    }

    setShowForm(false);
  };

  // Kolom tabel
  const columns: Column[] = [
    {
      Header: "No",
      accessor: "no",
      render: (_v, row) => data.findIndex((r) => r === row) + 1,
    },
    { Header: "Nama Kelas", accessor: "nama_kelas" },
    {
      Header: "Jurusan",
      accessor: "jurusan.nama_jurusan",
      render: (_v, row) => row.jurusan?.nama_jurusan ?? "-",
    },
    {
      Header: "Wali Kelas",
      accessor: "pengajar.nama_pengajar",
      render: (_v, row) => row.pengajar?.nama_pengajar ?? "-",
    },
    {
      Header: "Tahun Ajaran",
      accessor: "tahun_ajaran.tahun_ajaran",
      render: (_v, row) => row.tahun_ajaran?.tahun_ajaran ?? "-",
    },
    {
      Header: "Aksi",
      accessor: "aksi",
      render: (_v, row) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => handleEdit(row)}>
            <Badge variant="light" color="primary">
              Edit
            </Badge>
          </button>
          <button type="button" onClick={() => handleDelete(row.id_kelas)}>
            <Badge variant="light" color="error">
              Hapus
            </Badge>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta title="Kelola Kelas" description="Kelola data kelas" />
      <PageBreadcrumb pageTitle="Kelola Kelas" />
      <div className="space-y-6 relative">
        <ComponentCard title="Data Kelas">
          <div className="mb-4 flex justify-end">
            <Button size="sm" variant="primary" onClick={handleAdd}>
              Tambah Data
            </Button>
          </div>
          <BasicTableOne columns={columns} data={data} />
        </ComponentCard>

        {/* Popup Form */}
        {showForm && (
          <div className="absolute top-0 left-0 right-0 flex justify-center mt-20 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                {formMode === "add" ? "Tambah Kelas" : "Edit Kelas"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nama Kelas */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.nama_kelas ?? ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nama_kelas: e.target.value }))
                    }
                    required
                  />
                </div>

                {/* Dropdown Jurusan */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    Jurusan
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    value={formData.id_jurusan ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        id_jurusan: Number(e.target.value) || null,
                      }))
                    }
                    required
                  >
                    <option value="">-- Pilih Jurusan --</option>
                    {jurusanList.map((j) => (
                      <option key={j.id_jurusan} value={j.id_jurusan}>
                        {j.nama_jurusan}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Pengajar */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    Wali Kelas
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    value={formData.id_pengajar ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        id_pengajar: Number(e.target.value) || null,
                      }))
                    }
                    required
                  >
                    <option value="">-- Pilih Pengajar --</option>
                    {pengajarList.map((p) => (
                      <option key={p.id_pengajar} value={p.id_pengajar}>
                        {p.nama_pengajar}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Tahun */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    Tahun Ajaran
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    value={formData.id_tahun ?? ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        id_tahun: Number(e.target.value) || null,
                      }))
                    }
                    required
                  >
                    <option value="">-- Pilih Tahun Ajaran --</option>
                    {tahunList.map((t) => (
                      <option key={t.id_tahun} value={t.id_tahun}>
                        {t.tahun_ajaran}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-2 justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                  >
                    {formMode === "add" ? "Simpan" : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
