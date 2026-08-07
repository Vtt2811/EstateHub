import React from "react";
import HeartBtn from "./HeartBtn";
import {
    MdOutlineBathtub,
    MdOutlineBed,
    MdOutlineGarage,
} from "react-icons/md";
import { Link } from "react-router-dom";

const Item = ({ property }) => {
    return (
        <div className="relative rounded-2xl bg-white shadow-lg overflow-hidden">
            {/* Image Section */}
            <div className="relative">
                <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-60 object-cover rounded-t-2xl"
                />
                {/* Like button */}
                <div className="absolute top-4 right-4">
                    <HeartBtn />
                </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
                <h5 className="text-lg font-semibold text-gray-700">{property.city}</h5>
                <h4 className="text-xl font-medium text-gray-900 truncate">{property.title}</h4>

                {/* Info Section */}
                <div className="flex gap-x-4 mt-2 mb-3 text-gray-600">
                    <div className="flex items-center gap-x-1 border-r border-gray-300 pr-4">
                        <MdOutlineBed className="text-lg" /> 
                        {property.facilities.bedrooms}
                    </div>
                    <div className="flex items-center gap-x-1 border-r border-gray-300 pr-4">
                        <MdOutlineBathtub className="text-lg" />
                        {property.facilities.bathrooms}
                    </div>
                    <div className="flex items-center gap-x-1">
                        <MdOutlineGarage className="text-lg" />
                        {property.facilities.parkings}
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>

                {/* Price and Button */}
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">${property.price}.00</span>
                    <Link to={'/'}>
                        <button className="bg-blue-500 text-white rounded-lg py-2 px-4 shadow hover:bg-blue-600 transition duration-300">
                            View Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Item;
