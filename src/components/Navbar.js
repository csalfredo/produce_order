import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = ({title, main}) => {
  const router = useRouter();
  
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-rows-1 grid-cols-3 p-4">
            <div className="flex items-center">
              <SearchIcon className="text-gray-600 hover:text-gray-800 transition-colors" />
            </div>
            <div className="flex justify-center">
              <h1 className="text-2xl font-semibold text-gray-800 font-sans">
                {title}
              </h1>
            </div>
            <div className="flex justify-end items-center gap-4">
              <ShoppingCartIcon className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
              <Link href="/produceorder">
                <span onClick={handleMainClick} 
                      className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors font-medium">
                  {main}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar; 