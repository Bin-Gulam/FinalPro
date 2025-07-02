import React from 'react';
import UserNavbar from '../Components/UserNavbar';

const UserDashboard = () => {
  return (
    <>
    <UserNavbar/>
    <div className="font-sans text-gray-800">
    <section className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-100">
  <div className="md:w-1/2 space-y-4 text-gray-800">
    <h1 className="text-4xl font-bold text-blue-700">Easy And Fast Way to Apply for a Loan with Confidence.</h1>
    <p>Get access to flexible business and personal loans tailored to your needs. Empower your goals with just a few simple steps.</p>
    <div className="space-y-4">
      <button onClick={() => window.location.href = '/apply_loan'}
        className="bg-green-600 hover:bg-green-800 text-white font-bold text-lg px-6 py-3 rounded transition-transform transform hover:scale-105">
        Apply Now
      </button>
      <div className="flex space-x-4 items-center">
        <img
          src="../../../images/app.png"
          alt="App Store"
          className="h-12 w-auto hover:scale-105 transition-transform cursor-pointer"
        />
        <img
          src="../../../images/google.png"
          alt="Google Play"
          className="h-12 w-auto hover:scale-105 transition-transform cursor-pointer"
        />
      </div>
    </div>
  </div>

  {/* Hero Image */}
  <div className="md:w-1/2 mt-6 md:mt-0">
    <img src="../../../images/company.jpg" alt="Hero Car" className="w-full rounded-xl" />
  </div>
</section>

      {/* Features Section */}
<section
  className="p-6 text-center bg-cover bg-center text-white mt-10 border-t pt-10"
  style={{ backgroundImage: "url('../../../images/company.jpg')" }} // replace with a finance-related background
>
  <h2 className="text-3xl font-bold mb-6 text-white drop-shadow">
    Your Trusted Partner for Fast and Secure Loans
  </h2>
  <div className="grid md:grid-cols-3 gap-7">
    {[
      {
        title: 'Quick Approval',
        text: 'Enjoy a streamlined loan application process with fast decision-making to support your urgent financial needs.',
        img: '../../../images/money.png'
      },
      {
        title: 'Flexible Options',
        text: 'Choose from a variety of loan types and repayment plans tailored to your business or personal goals.',
        img: '../../../images/Flexibility.png',
      },
      {
        title: 'Reliable Support',
        text: 'Our support team and system guide you at every step, ensuring a smooth and transparent experience.',
        img: '../../../images/Support.png',
      },
    ].map((feature, index) => (
      <div
        key={index}
        className="bg-white text-gray-800 shadow rounded-xl p-4 transform transition hover:scale-105"
      >
        <img
          src={feature.img}
          alt={feature.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
        <h3 className="text-xl font-semibold">{feature.title}</h3>
        <p>{feature.text}</p>
      </div>
    ))}
  </div>
</section>


    {/* Client Reviews Section */}
<section className="p-6 mt-10 border-t pt-10">
  <h2 className="text-3xl font-bold text-center mb-6">Hear What Our Clients Say</h2>
  <div className="grid md:grid-cols-3 gap-6">
    {[
      {name: 'Sarah H.',comment: 'The loan process was simple and fast. I received support every step of the way!',
        img: '../../../images/Sara.png',
      },
      {name: 'John D.',comment: 'Excellent platform! I secured funding for my business with ease.',
        img: '../../../images/John.png',
      },
      {name: 'Emily R.',comment: 'Reliable service and quick approvals. Highly recommended for small business owners.',
        img: '../../../images/Emily.png',
      },
    ].map((review, index) => (
      <div key={index} className="bg-white shadow p-4 rounded-xl transform transition hover:scale-105">
        <img
          src={review.img}
          alt={review.name}
          className="w-16 h-16 rounded-full mx-auto mb-3"
        />
        <h4 className="font-semibold text-lg text-center">{review.name}</h4>
        <p className="text-sm mt-2 text-center">{review.comment}</p>
      </div>
    ))}
  </div>
</section>


      {/* Call to Action Section */}
     <section className="p-6 mt-10 border-t pt-10 bg-blue-50 text-center">
  <h2 className="text-2xl font-bold mb-4">Empower Your Business with Our Loan Services</h2>
  <p className="mb-4">Ready to grow your business or need financial support? Apply today and take the next step toward success!</p>
  <button className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded text-white transition-transform transform hover:translate-x-1 hover:scale-105"
    onClick={() => window.location.href = '/apply_loan'}>Apply Now</button>
</section>

     {/* Footer */}
<footer className="bg-blue-900 text-white py-6 px-4">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
    
    {/* Brand */}
    <a href="/user-dashboard" className="text-2xl font-bold mb-4 md:mb-0">
      Empower<span className="text-yellow-400 font-extrabold">ment</span>
    </a>

    {/* Social Media Links */}
    <div className="flex items-center space-x-4">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80">
        <img src="../../../images/facebook.svg" alt="Facebook" className="w-6 h-6" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80">
        <img src="../../../images/instagram.svg" alt="Instagram" className="w-6 h-6" />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="hover:opacity-80">
        <img src="../../../images/twitterx.svg" alt="Twitter" className="w-6 h-6" />
      </a>
      <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:opacity-80">
        <img src="/Images/telegram.svg" alt="Telegram" className="w-6 h-6" />
      </a>
    </div>
  </div>
    <div className="mt-4 text-center">
    <p className="text-sm">&copy; {new Date().getFullYear()} Empowerment Loan System. All rights reserved.</p>
  </div>
</footer>

    </div>
    </>
  );
};

export default UserDashboard;
