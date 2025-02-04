import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Alert, Snackbar } from '@mui/material';
import { Autocomplete, Button } from '@mui/material';
import Navbar from '../components/Navbar';

export default function produceorder() {
  // ... existing state and functions ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      <Navbar title="PRODUCE ORDER" main="Main" />
      
      <main className="container mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 mb-8">
          <div className="flex gap-3">
            <Autocomplete 
              // ... existing props
              className="flex-1"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#059669',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#059669',
                  },
                }
              }}
            />
            <Button
              // ... existing props
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 shadow-sm"
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userCurrentOrder.map((item) => (
            <div key={item.id} 
                 className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 
                          hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.product_code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    item.stock 
                      ? item.inventory > 20 
                        ? 'bg-emerald-500' 
                        : 'bg-amber-500'
                      : 'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-500">
                    {item.stock ? `${item.inventory} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
              {/* ... rest of item content ... */}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {userCurrentOrder.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-emerald-100">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-emerald-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No items in cart</h3>
            <p className="mt-2 text-sm text-gray-500">
              Start by searching for products above
            </p>
          </div>
        )}

        {/* Order Summary */}
        {userCurrentOrder.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            {/* ... summary content ... */}
          </div>
        )}
      </main>
    </div>
  );
} 