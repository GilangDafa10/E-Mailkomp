import React, { useState, useEffect } from "react";
import Navbar from "../../components/Layouts/Navbar";
import Footer from "../../components/Layouts/Footer";
import DivisionSlider from "../../components/Organization/DivisionSlider";
import { motion } from "framer-motion";
import axios from "axios";

const Mawa = () => {
    // State untuk menampung data departemen Mawa
    const [MawaData, setMawaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedData = sessionStorage.getItem("MawaData");
                let departments;

                if (cachedData) {
                    departments = JSON.parse(cachedData);
                } else {
                    const response = await axios.get("/api/structure");
                    departments = response.data.data.departments;
                    sessionStorage.setItem(
                        "MawaData",
                        JSON.stringify(departments)
                    );
                }
                const targetDept = departments.find(
                    (d) =>
                        d.slug === "kemahasiswaan" || d.name === "Kemahasiswaan"
                );
                setMawaData(targetDept);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (!MawaData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-dark text-white">
                {error ? (
                    `Error: ${error}`
                ) : (
                    <span>Memuat Bidang Kemahasiswaan......</span>
                )}
            </div>
        );
    }

    const { head_of_bidang, divisions = [] } = MawaData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-purple to-primary-dark overflow-x-hidden">
            <Navbar />
            <main className="relative">
                {/* Background Effects (Sama seperti kode asli) */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[1200px] md:h-[1200px] bg-primary-blue opacity-20 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute -top-1/3 -left-1/4 w-[50vw] h-[45vw] md:w-[700px] md:h-[600px] bg-primary-orange opacity-8 blur-3xl animate-pulse-slow delay-700 rotate-[15deg]"></div>
                    <div className="absolute bottom-1/4 -left-1/3 w-[45vw] h-[55vw] md:w-[650px] md:h-[750px] bg-primary-orange opacity-10 blur-3xl animate-pulse-slow delay-1500 -rotate-[25deg]"></div>
                    <div className="absolute -top-1/4 -right-1/3 w-[60vw] h-[40vw] md:w-[800px] md:h-[550px] bg-primary-orange opacity-8 blur-3xl animate-pulse-slow delay-1000 -rotate-[10deg]"></div>
                    <div className="absolute -bottom-1/4 -right-1/4 w-[55vw] h-[50vw] md:w-[750px] md:h-[700px] bg-primary-orange opacity-10 blur-3xl animate-pulse-slow delay-2000 rotate-[35deg]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-primary-purple via-transparent to-transparent opacity-30"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 pt-24 ">
                    {/* Header Section */}
                    <motion.header
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            className="relative"
                        >
                            <div className="absolute -inset-x-8 -inset-y-4 bg-primary-blue/20 blur-3xl -z-10 opacity-50 rounded-full"></div>
                            <h1 className="text-3xl md:text-4xl lg:text-7xl font-bold tracking-tight mb-6">
                                <span className="inline-block bg-gradient-to-r from-white via-primary-orange/80 to-white bg-clip-text text-transparent animate-gradient-x p-1">
                                    {MawaData.name}
                                </span>
                            </h1>
                        </motion.div>
                    </motion.header>

                    {/* Ketua Bidang (Head of Heading) */}
                    {head_of_bidang && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 text-center"
                        >
                            <div className="group relative w-[130px] sm:w-[180px] md:w-[200px] mx-auto ">
                                <div className="relative transform skew-x-[-12deg] overflow-hidden rounded-lg bg-gradient-to-br from-primary-dark/90 to-primary-purple/90 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-primary-orange/20">
                                    <div className="aspect-[9/16] relative overflow-hidden">
                                        <img
                                            src={
                                                head_of_bidang.image_url ||
                                                "/assets/default-avatar.png"
                                            }
                                            alt={head_of_bidang.name}
                                            loading="lazy"
                                            decoding="async" // <--- Agar rendering teks tidak terblokir decoding gambar
                                            className="absolute inset-0 w-full h-full object-cover transform skew-x-[12deg] scale-140 group-hover:scale-160 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 text-center bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-xs sm:text-sm font-bold text-white">
                                            {head_of_bidang.name}
                                        </h3>
                                        <span className="mt-1 px-2 sm:px-3 py-1 bg-primary-blue/30 rounded-full text-[10px] sm:text-xs text-white border border-white/10">
                                            {head_of_bidang.position}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Divisi Sections (Looping Dinamis dari JSON) */}
                    {divisions &&
                        divisions.map((division) => (
                            <DivisionSlider
                                key={division.id}
                                title={division.name}
                                members={division.members}
                            />
                        ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Mawa;
