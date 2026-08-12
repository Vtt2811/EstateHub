import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container py-10 max-w-6xl">
      <h1 className="font-heading text-display-sm text-navy-900 mb-8">Add New Property Listing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-card shadow-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="title" className="label-text mb-1 block">Title</label>
                <input id="title" name="title" type="text" placeholder="e.g. Modern Apartment with City View" required className="input-field" />
              </div>
              <div>
                <label htmlFor="price" className="label-text mb-1 block">Price (₹)</label>
                <input id="price" name="price" type="number" min={0} placeholder="1200" required className="input-field" />
              </div>
              <div>
                <label htmlFor="city" className="label-text mb-1 block">City</label>
                <input id="city" name="city" type="text" placeholder="e.g. New York" required className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="label-text mb-1 block">Street Address</label>
                <input id="address" name="address" type="text" placeholder="123 Main St" required className="input-field" />
              </div>
            </div>

            <div>
              <label className="label-text mb-1 block">Description</label>
              <div className="bg-white rounded-btn border border-navy-200 overflow-hidden">
                <ReactQuill theme="snow" onChange={setValue} value={value} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bedroom" className="label-text mb-1 block">Bedrooms</label>
                <input min={1} id="bedroom" name="bedroom" type="number" defaultValue={1} className="input-field" />
              </div>
              <div>
                <label htmlFor="bathroom" className="label-text mb-1 block">Bathrooms</label>
                <input min={1} id="bathroom" name="bathroom" type="number" defaultValue={1} className="input-field" />
              </div>
              <div>
                <label htmlFor="size" className="label-text mb-1 block">Size (sqft)</label>
                <input min={0} id="size" name="size" type="number" placeholder="850" className="input-field" />
              </div>
              <div>
                <label htmlFor="type" className="label-text mb-1 block">Type</label>
                <select name="type" className="select-field">
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>
              <div>
                <label htmlFor="property" className="label-text mb-1 block">Property</label>
                <select name="property" className="select-field">
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label htmlFor="utilities" className="label-text mb-1 block">Utilities Policy</label>
                <select name="utilities" className="select-field">
                  <option value="owner">Owner is responsible</option>
                  <option value="tenant">Tenant is responsible</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
              <div>
                <label htmlFor="pet" className="label-text mb-1 block">Pet Policy</label>
                <select name="pet" className="select-field">
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="income" className="label-text mb-1 block">Income Policy</label>
                <input id="income" name="income" type="text" placeholder="e.g. 3x rent" className="input-field" />
              </div>
              <div>
                <label htmlFor="school" className="label-text mb-1 block">School (m)</label>
                <input min={0} id="school" name="school" type="number" placeholder="250" className="input-field" />
              </div>
              <div>
                <label htmlFor="bus" className="label-text mb-1 block">Bus Stop (m)</label>
                <input min={0} id="bus" name="bus" type="number" placeholder="100" className="input-field" />
              </div>
              <div>
                <label htmlFor="restaurant" className="label-text mb-1 block">Restaurant (m)</label>
                <input min={0} id="restaurant" name="restaurant" type="number" placeholder="50" className="input-field" />
              </div>
            </div>

            {error && <p className="text-red-500 text-body-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? "Creating..." : "Publish Property"}
            </button>
          </form>
        </div>

        {/* Side Image Upload Panel */}
        <div className="bg-surface-100 rounded-card p-6 border border-surface-200 flex flex-col items-center justify-start space-y-4">
          <h3 className="font-heading text-lg text-navy-900 font-bold">Property Images</h3>
          <div className="grid grid-cols-2 gap-3 w-full max-h-96 overflow-y-auto">
            {images.map((image, index) => (
              <img src={image} key={index} alt="" className="w-full h-24 object-cover rounded-btn border border-surface-200" />
            ))}
          </div>
          <UploadWidget
            uwConfig={{
              cloudName: "dvigd3hvc",
              uploadPreset: "estatehub",
              multiple: true,
              maxImageFileSize: 2000000,
              folder: "posts",
            }}
            setState={setImages}
          />
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
