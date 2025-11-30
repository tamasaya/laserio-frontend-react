import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { HomePage } from './pages/HomePage'
import { CategoriesMapPage } from './pages/CategoriesMapPage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductsListPage } from './pages/ProductsListPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ContactsPage } from './pages/ContactsPage'

function App() {
  return (
    <div className="page-container">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CategoriesMapPage />} />
          <Route path="/catalog/:slug" element={<CatalogPage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </Layout>
      </div>
  )
}

export default App
