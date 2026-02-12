
import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import HistoryPage from './HistoryPage';
import ProfilePage from './ProfilePage';
import BookingOptionsPage from './BookingOptionsPage';
import LocationMapPage from './LocationMapPage';
import ReceiptDetailsPage from './ReceiptDetailsPage';
import OrderConfirmationPage from './OrderConfirmationPage';
import AboutUsPage from './AboutUsPage';
import AdminDashboardPage from './AdminDashboardPage';

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  secondaryMobile: string;
  address: string;
  landmark: string;
  quantity: string;
  type: string;
  price: string;
  coordinates: { lat: number; lng: number } | null;
  status: 'Pending' | 'Started' | 'Completed';
  timestamp: string;
  isFree: boolean;
}

export interface User {
  username: string;
  mobile: string;
  password?: string;
}

const App: React.FC = () => {
  const getInitialSession = () => {
    const stayLoggedIn = localStorage.getItem('stayLoggedIn') === 'true';
    const savedSession = localStorage.getItem('yt_session');
    if (stayLoggedIn && savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const initialUser = getInitialSession();

  const [currentPage, setCurrentPage] = useState<number>(() => {
    return initialUser ? 4 : 1;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);

  const [orders, setOrders] = useState<Order[]>([]);

  // Real-time Firestore listener for orders
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: data.id,
          customerName: data.customerName,
          mobile: data.mobile,
          secondaryMobile: data.secondaryMobile,
          address: data.address,
          landmark: data.landmark,
          quantity: data.quantity,
          type: data.type,
          price: data.price,
          coordinates: data.coordinates,
          status: data.status,
          timestamp: data.timestamp,
          isFree: data.isFree,
          firestoreId: doc.id // Store Firestore doc ID for updates
        } as Order & { firestoreId?: string });
      });
      setOrders(ordersData);
    }, (error) => {
      console.error('Error fetching orders:', error);
      // Fallback to localStorage if Firestore fails
      const saved = localStorage.getItem('yt_orders');
      if (saved) setOrders(JSON.parse(saved));
    });

    return () => unsubscribe();
  }, []);

  const [userPromoCode, setUserPromoCode] = useState<string | null>(() => {
    return localStorage.getItem('yt_active_promo');
  });

  const [isCurrentOrderFree, setIsCurrentOrderFree] = useState(false);
  const [tempSecondaryMobile, setTempSecondaryMobile] = useState("");

  const [deliveryLocation, setDeliveryLocation] = useState({
    address: "Karimnagar, Telangana, India",
    landmark: "Karimnagar City",
    coordinates: { lat: 18.4386, lng: 79.1288 } as { lat: number; lng: number } | null,
    isAutoDetected: false
  });

  const [bookingOptions, setBookingOptions] = useState({
    type: 'Normal Delivery',
    quantity: '2500 Liters'
  });

  useEffect(() => {
    if (userPromoCode) localStorage.setItem('yt_active_promo', userPromoCode);
    else localStorage.removeItem('yt_active_promo');
  }, [userPromoCode]);

  const addOrder = async () => {
    const price = isCurrentOrderFree ? '₹0' : (bookingOptions.type === 'Express Delivery' ? '₹600' : '₹450');
    const newOrder = {
      id: `#WT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: currentUser?.username || "Guest",
      mobile: currentUser?.mobile || "9876543210",
      secondaryMobile: tempSecondaryMobile,
      address: deliveryLocation.address,
      landmark: deliveryLocation.landmark,
      quantity: bookingOptions.quantity,
      type: bookingOptions.type,
      price: price,
      coordinates: deliveryLocation.coordinates,
      status: 'Pending' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
      isFree: isCurrentOrderFree,
      createdAt: new Date().toISOString() // For Firestore ordering
    };

    try {
      // Add to Firestore (will trigger real-time listener to update UI)
      await addDoc(collection(db, 'orders'), newOrder);

      // Also save to localStorage as backup
      const updatedOrders = [newOrder, ...orders];
      localStorage.setItem('yt_orders', JSON.stringify(updatedOrders));

      if (isCurrentOrderFree) {
        setIsCurrentOrderFree(false);
        setUserPromoCode(null);
      }
    } catch (error) {
      console.error('Error adding order to Firestore:', error);
      // Fallback to local-only mode
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('yt_orders', JSON.stringify(updatedOrders));

      if (isCurrentOrderFree) {
        setIsCurrentOrderFree(false);
        setUserPromoCode(null);
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'Pending' | 'Started' | 'Completed') => {
    try {
      // Find the order with firestoreId
      const order = orders.find(o => o.id === orderId) as (Order & { firestoreId?: string }) | undefined;

      if (order?.firestoreId) {
        // Update in Firestore (will trigger real-time listener)
        await updateDoc(doc(db, 'orders', order.firestoreId), { status });
      } else {
        // Fallback to local update if no firestoreId
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Fallback to local update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const logout = () => {
    localStorage.removeItem('yt_session');
    localStorage.setItem('stayLoggedIn', 'false');
    setCurrentUser(null);
    setCurrentPage(1);
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('yt_session', JSON.stringify(user));
    setCurrentPage(4);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <LandingPage onNavigate={(page) => setCurrentPage(page)} />;
      case 2:
        return <LoginPage onNavigate={(page) => setCurrentPage(page)} onLoginSuccess={loginUser} />;
      case 3:
        return <RegisterPage onNavigate={(page) => setCurrentPage(page)} onRegisterSuccess={loginUser} />;
      case 4:
        return <HomePage
          onNavigate={(page) => setCurrentPage(page)}
          orderCount={orders.filter(o => o.mobile === currentUser?.mobile).length}
          promoCode={userPromoCode}
          setPromoCode={setUserPromoCode}
        />;
      case 5:
        return <HistoryPage onNavigate={(page) => setCurrentPage(page)} userOrders={orders.filter(o => o.mobile === currentUser?.mobile)} />;
      case 6:
        return <BookingOptionsPage
          onNavigate={(page) => setCurrentPage(page)}
          options={bookingOptions}
          setOptions={setBookingOptions}
          userPromoCode={userPromoCode}
          setIsFree={setIsCurrentOrderFree}
        />;
      case 7:
        return (
          <LocationMapPage
            onNavigate={(page) => setCurrentPage(page)}
            location={deliveryLocation}
            setLocation={setDeliveryLocation}
          />
        );
      case 8:
        return (
          <ReceiptDetailsPage
            onNavigate={(page) => setCurrentPage(page)}
            location={deliveryLocation}
            options={bookingOptions}
            mobile={currentUser?.mobile || ""}
            isFree={isCurrentOrderFree}
            setSecondaryMobile={setTempSecondaryMobile}
          />
        );
      case 9:
        return (
          <OrderConfirmationPage
            onNavigate={(page) => setCurrentPage(page)}
            location={deliveryLocation}
            addOrder={addOrder}
          />
        );
      case 10:
        return <ProfilePage onNavigate={(page) => setCurrentPage(page)} onLogout={logout} user={currentUser} orderCount={orders.filter(o => o.mobile === currentUser?.mobile).length} />;
      case 11:
        return <AboutUsPage onNavigate={(page) => setCurrentPage(page)} />;
      case 12:
        return <AdminDashboardPage onNavigate={(page) => setCurrentPage(page)} orders={orders} updateStatus={updateOrderStatus} onLogout={logout} />;
      default:
        return <HomePage onNavigate={(page) => setCurrentPage(page)} orderCount={0} promoCode={null} setPromoCode={() => { }} />;
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      {renderPage()}
    </main>
  );
};

export default App;
