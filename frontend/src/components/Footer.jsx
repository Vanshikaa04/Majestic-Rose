// components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Mail, 
  Instagram, 
  MessageCircle, 
  Facebook, 
  Twitter,
  Heart,
  ShoppingBagIcon,
  Gem,
  Scissors,
  Sparkles,
  Crown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I'm interested in your products at Majestic Rose.");
    window.open('https://wa.me/919979007261?text=' + message, '_blank');
  };

  const handleInstagram = () => {
    window.open('https://www.instagram.com/majestic_rose26?igsh=MWpuNG5jYzh1aHBtYg==', '_blank');
  };

  // Main Categories
  const mainCategories = [
    { name: 'Fashion', path: '/products/fashion', icon: ShoppingBagIcon, color: 'text-pink-400' },
    { name: 'Jewellery', path: '/products/jewellery', icon: Gem, color: 'text-purple-400' },
    { name: 'Stoles & Scarves', path: '/products/stoles-scarves', icon: Scissors, color: 'text-blue-400' },
  ];



  return (
    <footer className="text-white pt-12 pb-6"  style={{backgroundColor:"var(--primary-color)"}}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r  bg-clip-text text-transparent" style={{color:"var(--pink)"}}>
              Majestic Rose
            </h3>
            <p className="text-white ">   Feel rossy Everyday🌹 </p>
            <p className="text-gray-400 text-sm">
Contemporary couture  | Pret | Custom Made<br/>
Jewellery | Stoles & scarves <br/>
Exclusive for women and kids</p>

            
            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstagram}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full hover:shadow-lg transition-shadow"
              >
                <Instagram className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsApp}
                className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://www.facebook.com/share/1B7oJDseGs/', '_blank')}
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.button>
              
      
            </div>
          </motion.div>

          {/* Main Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold " style={{color:"var(--pink)"}}>Main Categories</h4>
            <ul className="space-y-3">
              {mainCategories.map((category) => {
                // const Icon = category.icon;
                return (
                  <li key={category.name}>
                    <Link 
                      to={category.path} 
                      className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-2"
                    >
                      {/* <Icon className={`w-4 h-4 ${category.color}`} /> */}
                      <span>{category.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Jewellery Subcategories */}
         
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold " style={{color:"var(--pink)"}}>Contact Us</h4>
            
            {/* Yukti Wadhwani - WhatsApp */}
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-300">Yukti Wadhwani</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleWhatsApp}
                  className="text-sm text-green-400 hover:text-green-300 transition-colors"
                >
                  +91 99790 07261
                </motion.button>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start space-x-3">
              <Instagram className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-300">Follow us on Instagram</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleInstagram}
                  className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                >
                  @majestic_rose26
                </motion.button>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">goplaniyukti40@gmail.com</p>
            </div>
          </motion.div>

          {/* Address with Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold " style={{color:"var(--pink)"}}>Visit Us</h4>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                73, Rajkumari Nivas Arvalli Society,<br />
                Idar, Sabarkantha, Gujarat,<br />
                Valasana Road, Mahavirnagar,<br />
                Idar - 383430, Gujarat
              </p>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 h-40 w-full">
              <iframe
                title="Majestic Rose Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2170.0490900053323!2d72.98871474344945!3d23.83377841405281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395da54264136d97%3A0xae8c573aac7fd74f!2sMAJESTIC%20ROSE!5e0!3m2!1sen!2sin!4v1772712554652!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className=" transition-all duration-300"
              ></iframe>
            </div>
            
            {/* Map Link */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              href="https://maps.google.com/?q=MAJESTIC+ROSE,Idar,Gujarat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-green-400 hover:text-green-300 transition-colors mt-2"
            >
              Open in Google Maps →
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom Bar */}
{/* Bottom Bar */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  className="border-t border-gray-800 pt-6 mt-6"
>
  <div className="flex flex-col items-center justify-center text-center text-sm text-gray-400">
    <p>© {currentYear} Majestic Rose. All rights reserved.</p>
    <p className="mt-2">
      Design & Developed by{' '}
      <a
        href="https://soulfulscribble.in"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:text-green-300 transition-colors"
      >
        Soulful Scribble
      </a>
    </p>
  </div>
</motion.div>
      </div>
    </footer>
  );
};

export default Footer;