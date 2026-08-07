import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup>
        <div className="w-56 p-1 bg-white font-body">
          <Link to={`/${item.id}`} className="block relative overflow-hidden rounded-btn mb-2 aspect-[4/3]">
            <img
              src={item.images[0] || "/default-image.jpg"}
              alt=""
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="space-y-1">
            <Link
              to={`/${item.id}`}
              className="font-body font-semibold text-body-sm text-navy-900 hover:text-accent-600 line-clamp-1 block"
            >
              {item.title}
            </Link>
            <p className="text-caption text-navy-400">{item.bedroom} bedroom · {item.bathroom} bath</p>
            <p className="font-heading font-bold text-accent-600 text-body-sm">${item.price.toLocaleString()}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
