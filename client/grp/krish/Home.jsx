import React from "react";
import Blogs from '../components/Blogs'
import bannerImg from "../assets/banner.png"

const Home = () => {
    return (
        <main>
            <Blogs />
            <div className='max-padd-container py16 overflow-x-hidden'>
                <img src={bannerImg} alt="" />
            </div>
        </main>
    )
}

export default Home