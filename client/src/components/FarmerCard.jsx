import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaLeaf } from "react-icons/fa";
import { placeholder } from "../assets";

const FarmerCard = ({ farmer }) => {
  const id = farmer?.id || farmer?._id;
  const avatar = farmer?.profilePicture || placeholder;

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  return (
    <Link to={`/farmers/${id}`} className="m3-card block p-4 focus:outline-none" role="article" aria-label={`Open ${farmer?.name || 'farmer'} profile`} tabIndex={0}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-green-50 flex items-center justify-center">
          <img src={avatar} alt={`${farmer?.name || 'Farmer'} avatar`} onError={handleImgError} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{farmer?.name}</h3>
          {farmer?.address && (
            <div className="flex items-center text-sm text-gray-500">
              <FaMapMarkerAlt className="mr-1" />
              <span>{farmer.address.city}, {farmer.address.state}</span>
            </div>
          )}
        </div>

        <div>
          <span className="m3-pill text-sm">View</span>
        </div>
      </div>
    </Link>
  );
};

export default FarmerCard;
