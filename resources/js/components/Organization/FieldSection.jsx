import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useNavigate } from "react-router-dom";

const initialFields = [
    {
        id: 1,
        name: "Sekretaris & Bendahara",
        logo: "/assets/organization/bidang/LogoSekBend.png",
        link: "/bidang/sekretaris-bendahara",
    },
    {
        id: 2,
        name: "Pengembangan Organisasi & Kewirausahaan",
        logo: "/assets/organization/bidang/LogoPO.png",
        link: "/bidang/pengembangan-organisasi",
    },
    {
        id: 3,
        name: "Kemahasiswaan",
        logo: "/assets/organization/bidang/LogoMawa.png",
        link: "/bidang/kemahasiswaan",
    },
    {
        id: 4,
        name: "Jaringan",
        logo: "/assets/organization/bidang/LogoJaringan.png",
        link: "/bidang/jaringan",
    },
    {
        id: 5,
        name: "Penelitian & Pengembangan",
        logo: "/assets/organization/bidang/LogoLitBang.png",
        link: "/bidang/penelitian-pengembangan",
    },
];

const FieldSection = () => {
    const [fields, setFields] = useState(initialFields);
    const [isDesktop, setIsDesktop] = useState(true);
    const [pressStart, setPressStart] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const handlePointerDown = () => {
        setPressStart(Date.now());
    };

    const handlePointerUp = (link) => {
        const pressDuration = Date.now() - pressStart;
        if (pressDuration < 100) {
            navigate(link);
        }
    };

    return (
        <div className="w-full py-10 mt-6">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <h2 className="text-center text-3xl md:text-4xl font-bold text-primary-orange mb-10">
                        <span className="bg-gradient-to-r from-white/90 via-primary-orange/70 to-white/90 bg-clip-text text-transparent">
                            Bidang dalam Organisasi
                        </span>
                    </h2>
                </motion.div>

                {isDesktop ? (
                    <Reorder.Group
                        axis="x"
                        values={fields}
                        onReorder={setFields}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                    >
                        <AnimatePresence>
                            {fields.map((field) => (
                                <Reorder.Item
                                    key={field.id}
                                    value={field}
                                    className="h-full cursor-pointer"
                                    whileDrag={{ scale: 1.05 }}
                                    layout
                                    onPointerDown={handlePointerDown}
                                    onPointerUp={() =>
                                        handlePointerUp(field.link)
                                    }
                                >
                                    <div className="flex flex-col justify-between items-center p-6 rounded-lg bg-primary-purple shadow-lg border border-primary-indigo h-full hover:shadow-xl transition">
                                        <div className="w-24 h-24 flex items-center justify-center bg-primary-dark p-4 rounded-full shadow-md">
                                            <img
                                                src={field.logo}
                                                alt={field.name}
                                                className="w-full h-full object-contain rounded-full"
                                                loading="lazy"
                                            />
                                        </div>
                                        <h3 className="text-lg md:text-xl font-semibold text-primary-orange text-center min-h-[64px] flex items-center">
                                            {field.name}
                                        </h3>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {fields.map((field) => (
                            <div
                                key={field.id}
                                onPointerDown={handlePointerDown}
                                onPointerUp={() => handlePointerUp(field.link)}
                                className="flex flex-col justify-between items-center p-6 rounded-lg bg-primary-purple shadow-lg border border-primary-indigo h-full hover:shadow-xl transition cursor-pointer"
                            >
                                <div className="w-24 h-24 flex items-center justify-center bg-primary-dark p-4 rounded-full shadow-md">
                                    <img
                                        src={field.logo}
                                        alt={field.name}
                                        className="w-full h-full object-contain rounded-full"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-primary-orange text-center min-h-[64px] flex items-center">
                                    {field.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FieldSection;
