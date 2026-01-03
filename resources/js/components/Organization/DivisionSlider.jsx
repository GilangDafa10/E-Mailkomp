// components/DivisionSlider.js (atau bisa disatukan di file yang sama di atas Jaringan)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import { useMediaQuery } from "react-responsive";
import "keen-slider/keen-slider.min.css";

const DivisionSlider = ({ title, members }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        mode: "free-snap",
        slides: { perView: 5, spacing: 0 },
        breakpoints: {
            "(max-width: 1280px)": { slides: { perView: 5, spacing: 0 } },
            "(max-width: 1024px)": { slides: { perView: 3, spacing: 0 } },
            "(max-width: 768px)": { slides: { perView: 3, spacing: 0 } },
        },
        created() {
            setLoaded(true);
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    return (
        <div className="mb-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} // Changed to whileInView for lazy load effect
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative text-center mb-10"
            >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-white/90 via-primary-orange/70 to-white/90 bg-clip-text text-transparent">
                        {title}
                    </span>
                </h2>
            </motion.div>

            {/* Slider Container */}
            <div className="px-4 md:px-8 max-w-7xl mx-auto">
                {!isLargeScreen || members.length > 5 ? (
                    <div ref={sliderRef} className="keen-slider">
                        {members.map((member, index) => (
                            <motion.div
                                key={`${member.id}-${index}`}
                                className="keen-slider__slide"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.6,
                                }}
                            >
                                {/* Member Card Component Reused */}
                                <MemberCard member={member} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div
                        className={`flex justify-around ${
                            members.length < 5 ? "flex-wrap" : ""
                        }`}
                    >
                        {members.map((member, index) => (
                            <div
                                key={`${member.id}-${index}`}
                                className="text-center mx-2"
                            >
                                <MemberCard member={member} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Indicators */}
                {loaded && instanceRef.current && (
                    <div className="flex justify-center gap-2 mt-4">
                        {[
                            ...Array(
                                instanceRef.current.track.details.slides.length
                            ).keys(),
                        ].map((idx) => (
                            <button
                                key={idx}
                                onClick={() =>
                                    instanceRef.current?.moveToIdx(idx)
                                }
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentSlide === idx
                                        ? "bg-primary-orange/90 w-4"
                                        : "bg-white/30 hover:bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component untuk kartu anggota agar kode lebih rapi
const MemberCard = ({ member }) => (
    <div className="group relative w-[80px] sm:w-[110px] md:w-[130px] lg:w-[170px] text-center mx-auto">
        <div className="relative transform skew-x-[-12deg] overflow-hidden rounded-lg bg-gradient-to-br from-primary-dark/90 to-primary-purple/90 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-primary-orange/20">
            <div className="aspect-[9/16] relative overflow-hidden">
                <img
                    src={member.image_url || "/assets/default-avatar.png"} // Handle null image
                    alt={member.name}
                    loading="lazy"
                    decoding="async" // <--- Agar rendering teks tidak terblokir decoding gambar
                    className="absolute inset-0 w-full h-full object-cover transform skew-x-[12deg] scale-140 group-hover:scale-160 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 text-center bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-white">
                    {member.name}
                </h3>
                <span className="mt-1 px-1 sm:px-2 py-0.5 bg-primary-orange/30 rounded-full text-[8px] sm:text-[10px] md:text-xs text-white border border-white/10">
                    {member.position}
                </span>
            </div>
        </div>
    </div>
);

export default DivisionSlider;
