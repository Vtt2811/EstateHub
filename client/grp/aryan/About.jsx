import React, { useEffect, useState } from "react";
import aboutImg from "../assets/about.jpg";
import { RiDoubleQuotesL } from 'react-icons/ri';
import CountUp from 'react-countup';

const About = () => {
    const statistics = [
        { label: "Happy Clients", value: 12 },
        { label: "Different Cities", value: 3 },
        { label: "Projects Completed", value: 45 },
    ];

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const top = aboutSection.getBoundingClientRect().top;
                const isVisible = top < window.innerHeight - 100;
                setIsVisible(isVisible);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <section id='about' className='max-padd-container py-16 xl:py-28'>
            {/* Container */}
            <div className='flex flex-col xl:flex-row gap-10'>
                {/* Left Side */}
                <div className='flex-1 relative'>
                    <img src={aboutImg} alt="About" className="rounded-3xl rounded-tr-[155px] w-[488px]" />
                    <div className="bg-white absolute bottom-16 left-16 max-w-xs p-4 rounded-lg flexCenter flex-col">
                        <span className="relative bottom-8 p-3 shadow-md bg-white h-12 w-12 flex items-center rounded-full">
                            <RiDoubleQuotesL className="text-2xl" />
                        </span>
                        <p className="text-center relative bottom-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed odit tenetur consequatur non saepe ab quas molestiae et. Praesentium sit maiores laborum qui tempora minima blanditiis, exercitationem a quas reiciendis?
                        </p>
                    </div>
                </div>
                {/* Right Side */}
                <div className='flex-1 flex justify-center flex-col'>
                    <span className="medium-18">Unveiling Our Journey</span>
                    <h2 className="h2">Our Commitment Crafting Extraordinary Real Estate Experience</h2>
                    <p className='py-5'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ullam sed minima vitae laboriosam doloremque et eligendi dolore est quis? Excepturi hic sapiente voluptatum voluptates aspernatur tempora voluptas quas repudiandae rerum. Saepe repellat molestiae nostrum praesentium hic, impedit quibusdam officia aspernatur sint doloremque mollitia commodi in repudiandae, quaerat quasi a obcaecati similique.
                    </p>
                    {/* Statistics Container */}
                    <div className='flex flex-wrap gap-4'>
                        {statistics.map((statistic, index) => (
                            <div key={index} className='bg-primary p-4 rounded-lg'>
                                <div className="flex items-center gap-1">
                                    <CountUp
                                        start={isVisible ? 0 : null}
                                        end={statistic.value}
                                        duration={10}
                                        delay={3}
                                    >
                                        {({ countUpRef }) => (
                                            <h3 ref={countUpRef} className='text-2xl font-semibold'></h3>
                                        )}
                                    </CountUp>
                                    <h4 className="font-bold text-2xl">k+</h4>
                                </div>
                                <p>{statistic.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
