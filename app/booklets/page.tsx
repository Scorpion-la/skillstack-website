'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ShoppingCartIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Booklet {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category?: string;
  author?: string;
  pages?: number;
}

export default function BookletsPage() {
  const [booklets, setBooklets] = useState<Booklet[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{id: string, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();

  const categories = ['All', 'Programming', 'Science', 'Mathematics', 'Business', 'Design'];

  useEffect(() => {
    const fetchBooklets = async () => {
      try {
        let query = supabase.from('booklets').select('*');
        
        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;
        setBooklets(data || []);
      } catch (error) {
        console.error('Error fetching booklets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooklets();
  }, [selectedCategory]);

  const addToCart = (bookletId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === bookletId);
      if (existingItem) {
        return prev.map(item => 
          item.id === bookletId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { id: bookletId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (bookletId: string) => {
    setCart(prev => prev.filter(item => item.id !== bookletId));
  };

  const updateQuantity = (bookletId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(bookletId);
      return;
    }
    
    setCart(prev => 
      prev.map(item => 
        item.id === bookletId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const booklet = booklets.find(b => b.id === item.id);
      return total + (booklet ? booklet.price * item.quantity : 0);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center
            ">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                SkillStack
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/courses" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Courses
                </Link>
                <Link href="/booklets" className="text-indigo-600 border-b-2 border-indigo-500 px-3 py-2 text-sm font-medium">
                  Booklets
                </Link>
                <Link href="/about" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  About
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-500 relative"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              {user ? (
                <Link 
                  href="/profile"
                  className="ml-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-200"
                >
                  My Profile
                </Link>
              ) : (
                <div className="ml-4 flex space-x-4">
                  <Link 
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Booklets Shop</h1>
          <p className="mt-2">Find the perfect study materials for your learning journey</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Booklets Grid */}
        {booklets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No booklets found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {booklets.map((booklet) => (
              <div key={booklet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="h-48 bg-gray-200 relative">
                  {booklet.image_url ? (
                    <img
                      src={booklet.image_url}
                      alt={booklet.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <StarIcon className="h-3 w-3 mr-1" />
                    <span>4.5</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{booklet.title}</h3>
                  {booklet.author && (
                    <p className="text-sm text-gray-500 mb-2">By {booklet.author}</p>
                  )}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{booklet.description}</p>
                  {booklet.pages && (
                    <p className="text-xs text-gray-500 mb-2">{booklet.pages} pages</p>
                  )}
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-indigo-600">${booklet.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(booklet.id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm flex items-center hover:bg-indigo-700 transition-colors"
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      <div 
        className={`fixed inset-0 z-50 overflow-hidden ${isCartOpen ? 'block' : 'hidden'}`}
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                      Shopping cart
                    </h2>
                    <div className="ml-3 h-7 flex items-center">
                      <button
                        type="button"
                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => setIsCartOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Start adding some booklets to your cart.</p>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => setIsCartOpen(false)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {cart.map((item) => {
                            const booklet = booklets.find(b => b.id === item.id);
                            if (!booklet) return null;
                            
                            return (
                              <li key={item.id} className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                  <img
                                    src={booklet.image_url}
                                    alt={booklet.title}
                                    className="w-full h-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3 className="line-clamp-1">{booklet.title}</h3>
                                      <p className="ml-4">${(booklet.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">${booklet.price.toFixed(2)} each</p>
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <div className="flex items-center border rounded-md">
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                      >
                                        -
                                      </button>
                                      <span className="px-3">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                      >
                                        +
                                      </button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${getCartTotal()}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <a
                        href="#"
                        className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Checkout
                      </a>
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="text-indigo-600 font-medium hover:text-indigo-500"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
