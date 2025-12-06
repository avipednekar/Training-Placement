import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div>
                        <img src="/assets/logo-wide.png" className="h-16 mb-5 bg-white p-2 rounded" alt="Footer Logo" />
                        <p className="text-gray-400 mb-6">Connecting talented students with the right opportunities since 2025.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                                <i className="ri-facebook-fill"></i>
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                                <i className="ri-twitter-fill"></i>
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-primary transition-colors">
                                <i className="ri-linkedin-fill"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Jobs</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>© 2025 Training and Placement Portal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
