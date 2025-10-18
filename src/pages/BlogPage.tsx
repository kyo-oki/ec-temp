import { Link } from 'react-router-dom';

export function BlogPage() {
  const blogPosts = [
    {
      id: '1',
      title: '10 Essential Soccer Skills Every Beginner Should Master',
      excerpt: 'Learn the fundamental skills that will help you get started with soccer and build a strong foundation.',
      date: 'October 10, 2025',
      category: 'Soccer',
    },
    {
      id: '2',
      title: 'How to Care for Your Cricket Bat',
      excerpt: 'Proper maintenance can extend the life of your cricket bat significantly. Here are our top tips.',
      date: 'October 8, 2025',
      category: 'Cricket',
    },
    {
      id: '3',
      title: 'Choosing the Right Tennis Racket for Your Playing Style',
      excerpt: 'Not all tennis rackets are created equal. Find out which type suits your game best.',
      date: 'October 5, 2025',
      category: 'Tennis',
    },
    {
      id: '4',
      title: 'Swimming Techniques to Improve Your Speed',
      excerpt: 'Master these techniques to shave seconds off your lap times and swim more efficiently.',
      date: 'October 3, 2025',
      category: 'Swimming',
    },
    {
      id: '5',
      title: 'The Best Warm-up Exercises for Athletes',
      excerpt: 'Prevent injuries and perform better with these essential warm-up routines.',
      date: 'September 28, 2025',
      category: 'Training',
    },
    {
      id: '6',
      title: 'Gear Guide: What Equipment Do You Really Need?',
      excerpt: 'Starting a new sport can be overwhelming. We break down the essential gear for beginners.',
      date: 'September 25, 2025',
      category: 'Gear',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4">Blog & Resources</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Tips, guides, and insights to help you improve your game and get the most out of your equipment.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200"></div>
              <div className="p-6">
                <div className="text-sm text-blue-600 mb-2">{post.category}</div>
                <h3 className="mb-3">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link to={`/blog/${post.id}`} className="text-sm text-blue-600 hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
