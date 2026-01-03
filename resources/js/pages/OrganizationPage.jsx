import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Layouts/Navbar";
import LeadershipSection from "../components/Organization/LeadershipSection";
import FieldSection from "../components/Organization/FieldSection";
import Footer from "../components/Layouts/Footer";
import MouseCursorEffect from "../components/Layouts/MouseCursorEffect";

const OrganizationPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-purple to-primary-dark overflow-x-hidden">
            <Navbar />
            <MouseCursorEffect />
            <main className="relative">
                {/* Background Effects similar to Landing */}
                <div className="fixed inset-0 pointer-events-none">
                    {/* Center Blue Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[1200px] md:h-[1200px] bg-primary-blue opacity-20 blur-3xl animate-pulse-slow"></div>

                    {/* Left Orange Glows */}
                    <div className="absolute -top-1/3 -left-1/4 w-[50vw] h-[45vw] md:w-[700px] md:h-[600px] bg-primary-orange opacity-8 blur-3xl animate-pulse-slow delay-700 rotate-[15deg]"></div>
                    <div className="absolute bottom-1/4 -left-1/3 w-[45vw] h-[55vw] md:w-[650px] md:h-[750px] bg-primary-orange opacity-10 blur-3xl animate-pulse-slow delay-1500 -rotate-[25deg]"></div>

                    {/* Right Orange Glows */}
                    <div className="absolute -top-1/4 -right-1/3 w-[60vw] h-[40vw] md:w-[800px] md:h-[550px] bg-primary-orange opacity-8 blur-3xl animate-pulse-slow delay-1000 -rotate-[10deg]"></div>
                    <div className="absolute -bottom-1/4 -right-1/4 w-[55vw] h-[50vw] md:w-[750px] md:h-[700px] bg-primary-orange opacity-10 blur-3xl animate-pulse-slow delay-2000 rotate-[35deg]"></div>

                    {/* Middle gradient overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-primary-purple via-transparent to-transparent opacity-30"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 pt-24 pb-14">
                    <motion.header
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-10 md:mb-20 lg:mb-20 relative"
                    >
                        {/* Title glow effect */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120%] h-[200%] bg-primary-blue/5 blur-3xl rounded-full animate-pulse-slow"></div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            className="relative"
                        >
                            <div className="absolute -inset-x-8 -inset-y-4 bg-primary-blue/20 blur-3xl -z-10 opacity-50 rounded-full"></div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                                <span className="inline-block bg-gradient-to-r from-white via-primary-orange/80 to-white bg-clip-text text-transparent animate-gradient-x">
                                    Struktur
                                </span>{" "}
                                <span className="inline-block bg-gradient-to-r from-primary-blue via-white to-primary-blue bg-clip-text text-transparent animate-gradient-x animation-delay-500 p-1">
                                    Organisasi
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="relative"
                        >
                            <h2 className="text-2xl md:text-3xl font-medium mb-3">
                                <span className="bg-gradient-to-r from-white/90 via-primary-orange/70 to-white/90 bg-clip-text text-transparent">
                                    Pengurus E-Mailkomp
                                </span>
                            </h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-lg text-gray-200/90 font-light"
                            >
                                Periode Tahun 2026
                            </motion.p>
                        </motion.div>
                    </motion.header>

                    {/* Add margin bottom to prevent section overlap */}
                    <LeadershipSection className="mb-14" />

                    {/* Add margin bottom to prevent section overlap */}
                    <FieldSection className="mb-14" />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrganizationPage;
