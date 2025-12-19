import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/medications', label: 'Medications', icon: '💊' },
    { path: '/compliance', label: 'Progress', icon: '📊' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-around items-center py-2">
                    {navItems.map((items) => {
                        const isActive = location.pathname === items.path;
                        return (
                            <Link
                                key={items.label}
                                to={items.path} 
                                className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors min-w-[60px] ${
                                    isActive 
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}>    
                                    <span className="text-2xl mb-1">{items.icon}</span>
                                    <span className="text-xs font-medium">{items.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

export default Navigation;