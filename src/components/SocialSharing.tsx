import React, { useState } from 'react';
import { Share2, Linkedin, Twitter, Facebook, Copy, CheckCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialSharingProps {
  title?: string;
  description?: string;
  url?: string;
  hashtags?: string[];
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  title = "Michael Kaminski - Executive Portfolio",
  description = "CXO/CTO specializing in Strategy, Finance, Product, and Analytics. Proven track record in turnarounds and strategic transformations.",
  url = window.location.href,
  hashtags = ["executive", "leadership", "strategy", "finance", "technology"]
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description,
    url
  };

  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} - ${description}`)}&url=${encodeURIComponent(url)}&hashtags=${hashtags.join(',')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`
  };

  const handleShare = async (platform: string) => {
    if (platform === 'native' && 'share' in navigator) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>

      <AnimatePresence>
        {showShareMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowShareMenu(false)}
            />
            
            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
            >
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Share Michael Kaminski's Portfolio
                </h3>
                
                <div className="space-y-2">
                  {/* Native Share */}
                  {'share' in navigator && (
                    <button
                      onClick={() => handleShare('native')}
                      className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <Share2 size={20} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Share via...</span>
                    </button>
                  )}

                  {/* LinkedIn */}
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Linkedin size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Share on LinkedIn</span>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Twitter size={20} className="text-blue-400" />
                    <span className="text-sm font-medium text-gray-700">Share on Twitter</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Facebook size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Share on Facebook</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => handleShare('email')}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Mail size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Share via Email</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    {copied ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <Copy size={20} className="text-gray-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {copied ? 'Link Copied!' : 'Copy Link'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialSharing; 