"use client";

import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";
import { useEffect, useState } from "react";

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    console.log(personalData.devUserName);
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(
                    `https://dev.to/api/articles?username=${personalData.devUserName}`
                );
                if (!res.ok) throw new Error("Failed to fetch data");

                const data = await res.json();
                const filtered = data
                    .filter((item) => item?.cover_image)
                    .sort(() => Math.random() - 0.5);

                setBlogs(filtered);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div>
            <HeroSection />
            <AboutSection />
            <Experience />
            <Skills />
            <Projects />
            <Education />
            <Blog blogs={blogs} />
            <ContactSection />
        </div>
    );
}
