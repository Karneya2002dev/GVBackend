import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Product from './Components/Product'
import AddProduct from './Components/AddProduct'

function App() {
  const [count, setCount] = useState(0)

  return (
    
   <BrowserRouter>

   <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product" element={<Product />}/>
        <Route path="/Add_product" element={<AddProduct />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
