import React, { useState, useEffect } from "react"; // 1. Tambah useState & useEffect
import { motion } from "framer-motion";

const LeadershipSection = () => {
    // 2. Siapkan State untuk menampung data dari API
    const [leaders, setLeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 3. Ambil data saat komponen pertama kali dimuat dengan caching
    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                // Cek apakah data sudah ada di localStorage
                const cachedData = localStorage.getItem("leadershipData");
                const cacheTimestamp =
                    localStorage.getItem("leadershipDataTime");
                const CACHE_DURATION = 60 * 60 * 1000; // Cache selama 1 jam (dalam milliseconds)

                // Jika cache masih valid, gunakan cache
                if (
                    cachedData &&
                    cacheTimestamp &&
                    Date.now() - parseInt(cacheTimestamp) < CACHE_DURATION
                ) {
                    setLeaders(JSON.parse(cachedData));
                    setIsLoading(false);
                    return;
                }

                // Jika cache tidak ada atau sudah kadaluarsa, fetch dari API
                const response = await fetch("api/structure");
                const result = await response.json();

                if (result.status === "success") {
                    // Kita ambil bagian 'bph_inti' sesuai struktur JSON Controller tadi
                    const data = result.data.bph_inti;
                    setLeaders(data);

                    // Simpan ke localStorage
                    localStorage.setItem(
                        "leadershipData",
                        JSON.stringify(data)
                    );
                    localStorage.setItem(
                        "leadershipDataTime",
                        Date.now().toString()
                    );
                }
            } catch (error) {
                console.error("Gagal mengambil data leadership:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaders();
    }, []);

    // Opsional: Tampilkan loading sederhana jika data belum siap
    if (isLoading) {
        return (
            <div className="text-center text-white py-10">
                Memuat Data Pimpinan...
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 max-w-3xl mx-auto">
                {/* Loop data dari State (bukan variabel statis lagi) */}
                {leaders.map((leader, index) => (
                    <motion.div
                        key={leader.id || index} // Gunakan ID dari database sebagai key
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className={`flex justify-center ${
                            index === 0 ? "md:-mt-16" : "md:mt-0"
                        }`}
                    >
                        <div className="group relative w-[200px]">
                            {/* Card */}
                            <div className="relative transform skew-x-[-12deg] overflow-hidden rounded-lg bg-gradient-to-br from-primary-dark/90 to-primary-purple/90 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-primary-orange/20">
                                {/* Image Container */}
                                <div className="aspect-[9/16] relative overflow-hidden">
                                    <img
                                        // PERUBAHAN PENTING:
                                        // Dari API namanya 'image_url', di kode lama 'imageUrl'
                                        src={leader.image_url}
                                        alt={leader.name}
                                        loading="lazy"
                                        decoding="async" // <--- Agar rendering teks tidak terblokir decoding gambar
                                        className="absolute inset-0 w-full h-full object-cover transform skew-x-[12deg] scale-140 group-hover:scale-160 transition-transform duration-500"
                                        onError={(e) => {
                                            // Fallback jika gambar rusak/kosong
                                            e.target.src =
                                                "https://via.placeholder.com/200x350?text=No+Image";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/30 to-transparent" />
                                </div>

                                {/* Info */}
                                <div className="absolute bottom-0 inset-x-0 transform p-3 bg-gradient-to-t from-primary-dark/95 to-primary-dark/80">
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-sm font-bold text-white text-center">
                                            {leader.name}
                                        </h3>
                                        <span className="mt-1 px-2.5 py-0.5 bg-gradient-to-r from-primary-orange/20 to-primary-blue/20 rounded-full text-[10px] text-white/90 border border-white/10">
                                            {leader.position}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default LeadershipSection;
