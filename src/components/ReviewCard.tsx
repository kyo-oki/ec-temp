import { Star } from 'lucide-react';

interface ReviewCardProps {
  rating: number;
  title: string;
  text: string;
  reviewerName: string;
  date: string;
}

export function ReviewCard({ rating, title, text, reviewerName, date }: ReviewCardProps) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h4 className="mb-2">{title}</h4>
        <p className="text-gray-600">{text}</p>
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
          <span className="text-blue-600">{reviewerName.charAt(0)}</span>
        </div>
        <div className="text-sm">
          <div>{reviewerName}</div>
          <div className="text-gray-500">{date}</div>
        </div>
      </div>
    </div>
  );
}
