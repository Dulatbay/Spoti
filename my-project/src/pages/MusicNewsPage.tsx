import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface NewsArticle {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: { name: string };
    urlToImage: string | null;
}

const MusicNewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalResults, setTotalResults] = useState<number>(0);
    const pageSize = 20; // Number of articles per page

    useEffect(() => {
        setLoading(true);
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/music-news', {
                    params: {
                        page: currentPage,
                        pageSize,
                    },
                });
                setNews(response.data.articles);
                setTotalResults(response.data.totalResults); // Store the total number of results
            } catch (error) {
                setError('Failed to load news.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [currentPage]);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalResults / pageSize);

    const handlePagination = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);

            // Scroll to the top of the page after changing the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold mb-8 text-center">Music Industry News</h1>

            {loading && <p className="text-center text-xl">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(news && !loading) && news.map((article, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <img
                                src={article.urlToImage || 'https://via.placeholder.com/400'}
                                alt={article.title}
                                className="w-full h-96 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-2xl font-semibold text-white truncate">{article.title}</h2>
                                <p className="text-gray-400 text-sm mt-2">{article.source.name}</p>
                                <p className="text-gray-300 mt-3">{article.description}</p>
                                <p className="text-xs text-gray-500 mt-2">{new Date(article.publishedAt).toLocaleDateString()}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handlePagination(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-4"
                >
                    Previous
                </button>
                <span className="text-white text-lg">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePagination(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MusicNewsPage;
