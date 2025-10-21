import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaUsers,
  FaHandshake,
  FaShoppingBasket,
  FaCheck,
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1 mb-6 shadow-sm border border-green-200">
              <span className="uppercase tracking-wider">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">
              About KrishokBazar
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Bringing local farmers and communities closer through fresh,
              sustainable produce and transparent trade.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="section section--soft-gray">
          <div className="container mx-auto px-4">
            <div className="card--elevated max-w-6xl mx-auto p-10 rounded-3xl">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 text-center md:text-left">
                  <h2 className="text-4xl font-extrabold text-green-700 mb-6 leading-tight">
                    Our Mission
                  </h2>
                  <p className="text-gray-800 text-lg mb-4">
                    KrishokBazar aims to foster direct connections between
                    farmers and consumers, ensuring fresh produce and fair
                    treatment for all.
                  </p>
                  <p className="text-gray-800 text-lg">
                    By cutting out middlemen, we promote a transparent,
                    sustainable food supply chain that benefits local economies
                    and the environment.
                  </p>
                </div>

                <div className="md:w-1/2 flex justify-center">
                  <div className="w-60 h-60 bg-green-100 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
                    <FaLeaf className="text-green-500 text-8xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-heading text-center mb-6">How It Works</h2>
          <div className="section-divider" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card--elevated p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Farmers share detailed profiles about their farms and produce,
                while consumers discover and support local growers in their
                communities.
              </p>
            </div>

            <div className="card--elevated p-8 text-center animate-fade-in animate-delay-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingBasket className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Order</h3>
              <p className="text-gray-600">
                Browse fresh products, select your favorites, and place orders
                directly with farmers. Choose flexible pickup or delivery to
                suit your needs.
              </p>
            </div>

            <div className="card--elevated p-8 text-center animate-fade-in animate-delay-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy</h3>
              <p className="text-gray-600">
                Receive farm-fresh, seasonal produce and build meaningful
                relationships that support sustainable agriculture in your
                area.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-heading text-center mb-6">Benefits</h2>
          <div className="section-divider" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="card--elevated p-8">
              <h3 className="text-xl font-semibold mb-4 text-green-600">
                For Consumers
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Access to fresher and more nutritious produce</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Transparency about sourcing and farming methods</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Support for local economies and sustainable farming</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Environmental benefits from shortened supply chains</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Direct communication channels with farmers</span>
                </li>
              </ul>
            </div>
            <div className="card--elevated p-8">
              <h3 className="text-xl font-semibold mb-4 text-green-600">
                For Farmers
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Higher profit margins through direct sales</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Access to a reliable local market</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Minimized waste via accurate demand forecasting</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Showcasing sustainable and responsible farming</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-2" />
                  <span>Direct customer feedback for continuous improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section text-center">
          <h2 className="section-heading mb-6">Join Our Community</h2>
          <div className="section-divider" />
          <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-8">
            Whether you’re a farmer looking to grow your presence or a
            consumer eager for fresh, local food, KrishokBazar welcomes you to
            be part of our vibrant community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="btn btn-primary px-8 py-3 text-lg font-bold shadow-md"
            >
              Sign Up Now
            </Link>
            <Link
              to="/products"
              className="btn btn-outline px-8 py-3 text-lg font-bold"
            >
              Browse Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
