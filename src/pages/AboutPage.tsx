export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4">About ProGear Hub</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Your trusted partner in sports excellence
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-lg text-gray-700">
              ProGear Hub is dedicated to providing high-quality sports equipment to individuals, 
              teams, and schools. Our mission is to make sports accessible and enjoyable for everyone.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="mb-4">Our Philosophy</h2>
            <p className="text-gray-700">
              We believe that the right equipment can make all the difference in performance and enjoyment. 
              That's why we carefully curate our product selection to ensure quality, durability, and value.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To become the most trusted source for sports equipment, known for our commitment to 
              quality, customer service, and supporting active lifestyles.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="mb-4">What We Offer</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Wide selection of sports equipment across multiple disciplines</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Quality products from leading brands</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Expert guidance and product recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Resources to help you improve your game</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Dedicated customer support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
