import { useState } from "react";
import { Link } from "react-router-dom";
import { FaLeaf, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Button from "./ui/Button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      toast.success("Subscribed successfully!");
      setEmail("");
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <footer className="mt-12">
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <img src="/logo.png" alt="KrishokBazar Logo" className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">KrishokBazar</h3>
                  <p className="text-sm opacity-90">Farm to table marketplace</p>
                </div>
              </div>
              <p className="text-sm opacity-90">Connecting local farmers with consumers for fresh, sustainable produce.</p>
            </div>

            <div>
              <h4 className="text-md font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {['Home','Products','Farmers','About'].map((text,i)=> (
                  <li key={i}><Link to={`/${text.toLowerCase()}`} className="text-white/90 hover:text-white">{text}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-md font-medium mb-3">Contact Us</h4>
              <ul className="space-y-3 text-white/90 text-sm">
                <li className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1"/> <span>MBSTU</span></li>
                <li className="flex items-center gap-3"><FaPhone/> <span>03241441444</span></li>
                <li className="flex items-center gap-3"><FaEnvelope/> <span>info@freshharvestconnect.com</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-medium mb-3">Newsletter</h4>
              <p className="text-sm opacity-90 mb-3">Subscribe for updates on fresh produce and local farmers.</p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Input id="newsletter-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Your email address" aria-label="Email for newsletter" className="flex-1" />
                <Button type="submit" variant="secondary" ariaLabel="Subscribe to newsletter">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">&copy; {currentYear} KrishokBazar. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;

