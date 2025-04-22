import { useNavigate } from 'react-router-dom';

function Head() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
      }

    return (
        <div className="h-[60px] border-b border-primary-brown flex items-center justify-between px-8">
            <div>
                <h1 className="text-display-1 font-display text-primary-brown">NextStop</h1>
            </div>
            <div>
                <div className="flex items-center space-x-4 h-[50px]">
                    <button
                        onClick={handleLogout}
                        className="border border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl h-full w-[120px]"
                    >
                        <p className="text-primary-brown text-heading-4">Sign Out</p>
                    </button>
                </div>
            </div>            
        </div>
    );
}

export default Head;